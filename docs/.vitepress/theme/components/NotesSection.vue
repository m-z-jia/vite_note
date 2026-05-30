<template>
  <section class="notes-section" ref="notesSection">
    <canvas ref="notesParticleCanvas" class="particle-canvas"></canvas>
    <!-- 移动端目录切换按钮 -->
    <button class="mobile-cat-toggle" @click="showDrawer = true">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M4 6h16M4 12h16M4 18h16"/>
      </svg>
      <span>目录</span>
    </button>

    <!-- 移动端抽屉 -->
    <Transition name="drawer-slide">
      <div v-if="showDrawer" class="drawer-overlay" @click.self="showDrawer = false">
        <div class="drawer-panel">
          <div class="drawer-header">
            <span>笔记目录</span>
            <button class="drawer-close" @click="showDrawer = false">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M18 6L6 18M6 6l12 12"/>
              </svg>
            </button>
          </div>
          <div class="drawer-body">
            <div
              v-for="(category, categoryIndex) in categories"
              :key="categoryIndex"
              class="category-item"
            >
              <div
                class="category-header"
                @click="toggleCategory(categoryIndex)"
              >
                <span class="category-icon" :class="{ expanded: expandedCategories.includes(categoryIndex) }">▶</span>
                <span class="category-dot" :class="'dot-' + category.color"></span>
                <span class="category-name">{{ category.name }}</span>
              </div>
              <div v-if="expandedCategories.includes(categoryIndex)" class="notes-sub-list">
                <div
                  v-for="(note, noteIndex) in category.notes"
                  :key="noteIndex"
                  :class="['note-item', { active: activeCategory === categoryIndex && activeNote === noteIndex }]"
                  @click="selectNote(categoryIndex, noteIndex)"
                >
                  {{ note.title }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Transition>

    <!-- 笔记容器 - 左右布局 -->
    <div class="notes-container">
      <!-- 左侧：多级目录（桌面端） -->
      <aside class="notes-sidebar">
        <div
          v-for="(category, categoryIndex) in categories"
          :key="categoryIndex"
          class="category-item"
        >
          <div
            class="category-header"
            @click="toggleCategory(categoryIndex)"
          >
            <span class="category-icon" :class="{ expanded: expandedCategories.includes(categoryIndex) }">▶</span>
            <span class="category-dot" :class="'dot-' + category.color"></span>
            <span class="category-name">{{ category.name }}</span>
            <span class="category-count">{{ category.notes.length }}</span>
          </div>
          <div v-if="expandedCategories.includes(categoryIndex)" class="notes-sub-list">
            <div
              v-for="(note, noteIndex) in category.notes"
              :key="noteIndex"
              :class="['note-item', { active: activeCategory === categoryIndex && activeNote === noteIndex }]"
              @click="selectNote(categoryIndex, noteIndex)"
            >
              <span class="note-item-dot" :class="'dot-' + category.color"></span>
              {{ note.title }}
            </div>
          </div>
        </div>
      </aside>

      <!-- 右侧：笔记内容显示 -->
      <main class="notes-main" ref="notesMain">
        <!-- 阅读进度条 -->
        <div class="reading-progress-track" v-if="currentNoteContent">
          <div class="reading-progress-bar" :style="{ width: readingProgress + '%' }"></div>
        </div>

        <!-- 内容区 -->
        <div class="note-content-wrapper" ref="contentWrapper" @scroll="updateReadingProgress">
          <Transition name="fade" mode="out-in" @after-enter="onContentEnter">
            <div v-if="loading" class="note-empty" key="loading">
              <div class="loading-spinner"></div>
              <p>加载中...</p>
            </div>
            <div v-else-if="currentNoteContent" key="content">
              <div class="note-content vp-doc" ref="noteContent" v-html="currentNoteContent"></div>

              <!-- 笔记元信息 -->
              <div class="note-meta">
                <span class="meta-reading-time">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>
                  </svg>
                  {{ readingTimeText }}
                </span>
                <span class="meta-category" :class="'dot-' + currentCategoryColor">
                  {{ currentCategoryName }}
                </span>
              </div>

              <!-- 上一篇/下一篇 导航 -->
              <nav class="note-nav">
                <button
                  class="nav-btn nav-prev"
                  :disabled="!hasPrev"
                  @click="goPrev"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M15 18l-6-6 6-6"/>
                  </svg>
                  <span>{{ hasPrev ? prevNoteTitle : '没有了' }}</span>
                </button>
                <button
                  class="nav-btn nav-next"
                  :disabled="!hasNext"
                  @click="goNext"
                >
                  <span>{{ hasNext ? nextNoteTitle : '没有了' }}</span>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M9 18l6-6-6-6"/>
                  </svg>
                </button>
              </nav>
            </div>
            <div v-else class="note-empty" key="empty">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" opacity="0.3">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                <polyline points="14 2 14 8 20 8"/>
              </svg>
              <p>请选择一个笔记查看</p>
            </div>
          </Transition>
        </div>
      </main>

      <!-- 文档目录 -->
      <aside class="docs-toc" v-if="currentNoteContent">
        <div class="toc-title">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M3 3h7v7H3zM14 3h7v7h-7zM3 14h7v7H3zM14 14h7v7h-7z"/>
          </svg>
          目录
        </div>
        <div v-if="headings.length === 0" style="color: var(--vp-c-text-3); font-size: 0.85rem; padding: 0.5rem;">暂无目录</div>
        <div class="toc-list" v-else>
          <div
            v-for="heading in headings"
            :key="heading.id"
            :class="['toc-item', { active: activeHeading === heading.id }]"
            :style="{ paddingLeft: (heading.level - 1) * 12 + 'px' }"
            @click="scrollToHeading(heading)"
          >
            {{ heading.text }}
          </div>
        </div>
      </aside>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import { useParticles } from '../composables/useParticles.js'
import { useNoteLoader } from '../composables/useNoteLoader.js'
import { useReadingProgress } from '../composables/useReadingProgress.js'

const notesSection = ref(null)
const notesParticleCanvas = ref(null)
const notesMain = ref(null)
const noteContent = ref(null)
const contentWrapper = ref(null)

// 笔记加载
const {
  categories,
  activeCategory,
  activeNote,
  loading,
  currentNoteContent,
  expandedCategories,
  showDrawer,
  readingTimeText,
  currentCategoryName,
  currentCategoryColor,
  hasPrev,
  hasNext,
  prevNoteTitle,
  nextNoteTitle,
  toggleCategory,
  selectNote,
  loadNote,
  addCopyButtons,
  updateReadingTime,
  goPrev,
  goNext,
} = useNoteLoader(contentWrapper)

// 阅读进度
const {
  readingProgress,
  headings,
  activeHeading,
  extractHeadings,
  recalcHeadingPositions,
  waitForImagesAndRecalc,
  scrollToHeading,
  updateReadingProgress: updateProgress,
  reset: resetReadingProgress,
} = useReadingProgress(contentWrapper)

// 包装 updateReadingProgress 以同时更新进度和标题
function updateReadingProgress() {
  updateProgress()
}

// 笔记区粒子（漂浮）
const { init: initNotesParticles, resize: resizeNotesParticles } = useParticles(
  notesParticleCanvas, notesSection,
  { count: 40, vxRange: [-0.125, 0.125], vyRange: [-0.125, 0.125], rRange: [0.4, 1.6], opacityRange: [0.15, 0.45], connectionDistance: 80, lineAlpha: 0.08, lineWidth: 0.25 }
)

// Transition 完成后执行后处理
function onContentEnter() {
  if (!currentNoteContent.value) return
  addCopyButtons()
  updateReadingTime()
  updateReadingProgress()
  extractHeadings()
  waitForImagesAndRecalc()
}

// 窗口大小变化时重绘粒子画布
let resizeTimer = null
function handleResize() {
  clearTimeout(resizeTimer)
  resizeTimer = setTimeout(() => {
    resizeNotesParticles()
    recalcHeadingPositions()
  }, 200)
}

// 滚动穿透处理：笔记容器未到视口顶部时，滚轮事件交给页面
let pendingDelta = 0
let rafId = null

// wheel deltaY 单位可能是行(deltaMode=1)或页(deltaMode=2)，统一转为像素
function toPixelDelta(e) {
  const d = e.deltaY
  if (e.deltaMode === 1) return d * 40   // 1 行 ≈ 40px
  if (e.deltaMode === 2) return d * 800  // 1 页 ≈ 800px
  return d                                // 像素
}

function isNotesAtTop() {
  const el = notesMain.value
  if (!el) return true
  return el.getBoundingClientRect().top <= 80
}

function flushPageScroll() {
  if (!pendingDelta) { rafId = null; return }
  const delta = pendingDelta
  pendingDelta = 0
  rafId = null
  // scroll-behavior: smooth 会导致 scrollTop 走动画，快速 wheel 事件会互相打架
  const el = document.documentElement
  const prev = el.style.scrollBehavior
  el.style.scrollBehavior = 'auto'
  el.scrollTop += delta
  document.body.scrollTop += delta
  el.style.scrollBehavior = prev
}

function handleWheel(e) {
  const wrapper = contentWrapper.value
  if (!wrapper) return

  const delta = toPixelDelta(e)

  // 笔记容器还没到视口顶部 → 全部交给页面滚动
  if (!isNotesAtTop()) {
    e.preventDefault()
    pendingDelta += delta
    if (!rafId) rafId = requestAnimationFrame(flushPageScroll)
    return
  }

  // 笔记容器已到顶，检查内部滚动边界
  const atTop = wrapper.scrollTop <= 0
  const atBottom = wrapper.scrollTop + wrapper.clientHeight >= wrapper.scrollHeight - 1
  const innerScrollable = wrapper.scrollHeight > wrapper.clientHeight

  if (innerScrollable) {
    if (delta > 0 && !atBottom) return  // 向下未到底 → 内部滚动
    if (delta < 0 && !atTop) return     // 向上未到顶 → 内部滚动
  }

  // 到达内部边界或内容不可滚动 → 交给页面
  e.preventDefault()
  pendingDelta += delta
  if (!rafId) rafId = requestAnimationFrame(flushPageScroll)
}

onMounted(() => {
  nextTick(() => {
    initNotesParticles()
  })
  window.addEventListener('resize', handleResize)
  contentWrapper.value?.addEventListener('wheel', handleWheel, { passive: false })

  // 默认加载笔记
  if (categories.value.length > 2 && categories.value[2].notes.length > 1) {
    loadNote(2, 1)
  }
})

onUnmounted(() => {
  contentWrapper.value?.removeEventListener('wheel', handleWheel)
})
</script>

<style scoped>
.particle-canvas {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

/* ===== 笔记区域 ===== */
.notes-section {
  position: relative;
  background: var(--vp-c-bg);
  padding: 2rem;
  min-height: calc(100vh - 4rem);
  overflow: hidden;
}

/* 移动端目录切换按钮 */
.mobile-cat-toggle {
  display: none;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.25rem;
  border: 1px solid var(--vp-c-divider);
  border-radius: 10px;
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-1);
  font-size: 0.95rem;
  cursor: pointer;
  margin-bottom: 1rem;
  transition: all 0.2s ease;
}

.mobile-cat-toggle:hover {
  background: var(--vp-c-bg-mute);
  border-color: var(--vp-c-brand);
}

/* 移动端抽屉 */
.drawer-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 200;
  display: flex;
}

.drawer-panel {
  width: 300px;
  max-width: 85vw;
  height: 100%;
  background: var(--vp-c-bg);
  display: flex;
  flex-direction: column;
  box-shadow: 4px 0 20px rgba(0, 0, 0, 0.15);
}

.drawer-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 1.25rem;
  border-bottom: 1px solid var(--vp-c-divider);
  font-weight: 600;
  color: var(--vp-c-text-1);
}

.drawer-close {
  background: none;
  border: none;
  color: var(--vp-c-text-2);
  cursor: pointer;
  padding: 4px;
  border-radius: 6px;
  display: flex;
  transition: all 0.2s ease;
}

.drawer-close:hover {
  background: var(--vp-c-bg-mute);
  color: var(--vp-c-text-1);
}

.drawer-body {
  flex: 1;
  overflow-y: auto;
  padding: 0.75rem;
}

/* 抽屉滑入动画 */
.drawer-slide-enter-active { transition: opacity 0.3s ease; }
.drawer-slide-leave-active { transition: opacity 0.2s ease; }
.drawer-slide-enter-from,
.drawer-slide-leave-to { opacity: 0; }

.drawer-slide-enter-active .drawer-panel { animation: slideIn 0.3s ease; }
.drawer-slide-leave-active .drawer-panel { animation: slideOut 0.2s ease; }

@keyframes slideIn {
  from { transform: translateX(-100%); }
  to { transform: translateX(0); }
}

@keyframes slideOut {
  from { transform: translateX(0); }
  to { transform: translateX(-100%); }
}

/* 笔记容器 */
.notes-container {
  position: relative;
  z-index: 10;
  max-width: 1600px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 300px 1fr 240px;
  gap: 2rem;
  align-items: start;
}

/* 左侧目录 */
.notes-sidebar {
  background: var(--vp-c-bg-soft);
  border-radius: 12px;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  position: sticky;
  top: 76px;
  overflow-y: auto;
  height: calc(100vh - 116px);
  flex-shrink: 0;
}

/* 分类项 */
.category-item {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.category-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  color: var(--vp-c-text-1);
  font-weight: 600;
  font-size: 1.05rem;
  flex-shrink: 0;
}

.category-header:hover {
  background: var(--vp-c-bg-mute);
}

.category-icon {
  display: inline-block;
  transition: transform 0.2s ease;
  font-size: 0.7rem;
  color: var(--vp-c-text-3);
  flex-shrink: 0;
}

.category-icon.expanded {
  transform: rotate(90deg);
}

/* 分类颜色点 */
.category-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  flex-shrink: 0;
}

.dot-purple { background: var(--gradient-primary); }
.dot-blue { background: var(--gradient-accent); }
.dot-orange { background: linear-gradient(135deg, #f97316 0%, #fb923c 100%); }
.dot-green { background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%); }

.category-count {
  margin-left: auto;
  font-size: 0.8rem;
  color: var(--vp-c-text-3);
  font-weight: 400;
}

/* 笔记子列表 */
.notes-sub-list {
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
  padding-left: 1.75rem;
  margin-top: 0.25rem;
  overflow-y: auto;
}

.note-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.55rem 0.85rem;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
  color: var(--vp-c-text-2);
  font-weight: 500;
  font-size: 0.93rem;
  flex-shrink: 0;
}

.note-item:hover {
  background: var(--vp-c-bg-mute);
  color: var(--vp-c-text-1);
}

.note-item.active {
  background: var(--vp-c-brand);
  color: #fff;
}

.note-item-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  flex-shrink: 0;
}

/* 右侧内容区 */
.notes-main {
  background: var(--vp-c-bg-soft);
  border-radius: 12px;
  position: sticky;
  top: 76px;
  height: calc(100vh - 116px);
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

/* 文档目录 */
.docs-toc {
  background: var(--vp-c-bg-soft);
  border-radius: 12px;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  position: sticky;
  top: 76px;
  overflow-y: auto;
  height: calc(100vh - 116px);
  flex-shrink: 0;
}

.toc-title {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid var(--vp-c-divider);
  font-weight: 600;
  color: var(--vp-c-text-1);
  font-size: 0.95rem;
}

.toc-list {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  padding-top: 0.25rem;
}

.toc-item {
  font-size: 0.85rem;
  color: var(--vp-c-text-2);
  cursor: pointer;
  padding: 0.4rem 0.6rem;
  border-radius: 6px;
  transition: all 0.2s ease;
  line-height: 1.5;
}

.toc-item:hover {
  color: var(--vp-c-brand);
  background: var(--vp-c-bg-mute);
}

.toc-item.active {
  color: var(--vp-c-brand);
  font-weight: 500;
  background: var(--vp-c-bg-mute);
}

/* 阅读进度条 */
.reading-progress-track {
  height: 3px;
  background: var(--vp-c-divider);
  flex-shrink: 0;
}

.reading-progress-bar {
  height: 100%;
  background: var(--gradient-primary);
  transition: width 0.15s linear;
  border-radius: 0 2px 2px 0;
}

/* 内容滚动区 */
.note-content-wrapper {
  flex: 1;
  overflow-y: auto;
  padding: 2rem;
}

.note-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  gap: 1rem;
  color: var(--vp-c-text-3);
  font-size: 1.1rem;
}

/* 加载动画 */
.loading-spinner {
  width: 32px;
  height: 32px;
  border: 3px solid var(--vp-c-divider);
  border-top-color: var(--vp-c-brand);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* 笔记内容样式 */
.note-content {
  line-height: 1.8;
}

.note-content :deep(h1) {
  font-size: 1.75rem;
  font-weight: 700;
  color: var(--vp-c-text-1);
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid var(--vp-c-brand);
}

.note-content :deep(h2) {
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--vp-c-text-1);
  margin: 1.5rem 0 1rem;
}

.note-content :deep(h3) {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--vp-c-text-1);
  margin: 1.25rem 0 0.75rem;
}

.note-content :deep(h4) {
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--vp-c-text-1);
  margin: 1rem 0 0.5rem;
}

.note-content :deep(p) {
  font-size: 1rem;
  color: var(--vp-c-text-2);
  margin: 0.75rem 0;
}

.note-content :deep(ul),
.note-content :deep(ol) {
  margin: 0.75rem 0;
  padding-left: 1.5rem;
}

.note-content :deep(li) {
  color: var(--vp-c-text-2);
  margin: 0.5rem 0;
}

.note-content :deep(blockquote) {
  border-left: 4px solid var(--vp-c-brand);
  padding: 0.5rem 1rem;
  margin: 1rem 0;
  background: var(--vp-c-bg-mute);
  border-radius: 0 8px 8px 0;
  color: var(--vp-c-text-2);
}

.note-content :deep(table) {
  width: 100%;
  border-collapse: collapse;
  margin: 1rem 0;
  font-size: 0.9rem;
}

.note-content :deep(th),
.note-content :deep(td) {
  border: 1px solid var(--vp-c-divider);
  padding: 0.6rem 1rem;
  text-align: left;
}

.note-content :deep(th) {
  background: var(--vp-c-bg-mute);
  font-weight: 600;
}

/* ===== 代码块 CSDN 风格 ===== */
.note-content :deep(.code-block) {
  position: relative;
  margin: 1rem 0;
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid #3e3e3e;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

/* 顶部语言标签栏 */
.note-content :deep(.code-block[data-lang])::before {
  content: attr(data-lang);
  display: block;
  padding: 6px 16px;
  background: #1e1e1e;
  color: #858585;
  font-size: 12px;
  font-family: 'JetBrains Mono', 'Fira Code', monospace;
  border-bottom: 1px solid #3e3e3e;
  letter-spacing: 0.5px;
  user-select: none;
}

/* 复制按钮 */
.note-content :deep(.copy-btn) {
  position: absolute;
  top: 4px;
  right: 8px;
  z-index: 10;
  background: #3a3a3a;
  color: #999;
  border: none;
  border-radius: 4px;
  padding: 5px 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.2s, background 0.2s;
}

.note-content :deep(.code-block:hover .copy-btn) {
  opacity: 1;
}

.note-content :deep(.copy-btn:hover) {
  background: #505050;
  color: #fff;
}

.note-content :deep(.copy-btn.copied) {
  background: #2ea043;
  color: #fff;
  opacity: 1;
}

.note-content :deep(pre.hljs) {
  margin: 0;
  padding: 16px;
  border-radius: 0;
  background: #282c34;
  overflow-x: auto;
}

.note-content :deep(pre.hljs code) {
  font-family: 'JetBrains Mono', 'Fira Code', 'Consolas', monospace;
  font-size: 14px;
  line-height: 1.8;
  color: #abb2bf;
  background: transparent;
  padding: 0;
}

/* highlight.js 语法高亮色 */
.note-content :deep(.hljs-keyword) { color: #c678dd; }
.note-content :deep(.hljs-string) { color: #98c379; }
.note-content :deep(.hljs-number) { color: #d19a66; }
.note-content :deep(.hljs-comment) { color: #5c6370; font-style: italic; }
.note-content :deep(.hljs-function) { color: #61afef; }
.note-content :deep(.hljs-class .hljs-title) { color: #e5c07b; }
.note-content :deep(.hljs-title) { color: #61afef; }
.note-content :deep(.hljs-params) { color: #abb2bf; }
.note-content :deep(.hljs-built_in) { color: #e5c07b; }
.note-content :deep(.hljs-type) { color: #e5c07b; }
.note-content :deep(.hljs-attr) { color: #d19a66; }
.note-content :deep(.hljs-literal) { color: #56b6c2; }
.note-content :deep(.hljs-variable) { color: #e06c75; }
.note-content :deep(.hljs-meta) { color: #61afef; }
.note-content :deep(.hljs-selector-tag) { color: #e06c75; }
.note-content :deep(.hljs-selector-class) { color: #e5c07b; }
.note-content :deep(.hljs-selector-id) { color: #61afef; }
.note-content :deep(.hljs-tag) { color: #e06c75; }
.note-content :deep(.hljs-name) { color: #e06c75; }
.note-content :deep(.hljs-attribute) { color: #d19a66; }
.note-content :deep(.hljs-symbol) { color: #56b6c2; }
.note-content :deep(.hljs-bullet) { color: #d19a66; }
.note-content :deep(.hljs-addition) { color: #98c379; background: rgba(152, 195, 121, 0.1); }
.note-content :deep(.hljs-deletion) { color: #e06c75; background: rgba(224, 108, 117, 0.1); }
.note-content :deep(.hljs-emphasis) { font-style: italic; }
.note-content :deep(.hljs-strong) { font-weight: bold; }

/* 代码块内滚动条 */
.note-content :deep(pre.hljs)::-webkit-scrollbar {
  height: 6px;
}
.note-content :deep(pre.hljs)::-webkit-scrollbar-track {
  background: transparent;
}
.note-content :deep(pre.hljs)::-webkit-scrollbar-thumb {
  background: #555;
  border-radius: 3px;
}
.note-content :deep(pre.hljs)::-webkit-scrollbar-thumb:hover {
  background: #888;
}

/* 内联代码 */
.note-content :deep(:not(pre) > code) {
  font-family: 'JetBrains Mono', 'Fira Code', 'Consolas', monospace;
  background: var(--vp-c-bg-mute);
  color: #c7254e;
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 0.9em;
  border: 1px solid var(--vp-c-divider);
}

.note-content :deep(img) {
  max-width: 100%;
  border-radius: 8px;
  margin: 1rem 0;
}

/* 笔记元信息 */
.note-meta {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-top: 2rem;
  padding-top: 1rem;
  border-top: 1px solid var(--vp-c-divider);
  flex-wrap: wrap;
}

.meta-reading-time {
  display: flex;
  align-items: center;
  gap: 0.35rem;
  font-size: 0.85rem;
  color: var(--vp-c-text-3);
}

.meta-category {
  font-size: 0.8rem;
  padding: 0.2rem 0.75rem;
  border-radius: 20px;
  font-weight: 500;
}

/* 上一篇/下一篇导航 */
.note-nav {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin-top: 1.5rem;
}

.nav-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.85rem 1rem;
  border: 1px solid var(--vp-c-divider);
  border-radius: 10px;
  background: var(--vp-c-bg);
  color: var(--vp-c-text-1);
  cursor: pointer;
  font-size: 0.9rem;
  transition: all 0.2s ease;
  text-align: left;
}

.nav-btn:hover:not(:disabled) {
  border-color: var(--vp-c-brand);
  color: var(--vp-c-brand);
  background: var(--vp-c-bg-soft);
}

.nav-btn:disabled {
  opacity: 0.4;
  cursor: default;
}

.nav-prev { justify-self: start; }
.nav-next { justify-self: end; text-align: right; }

/* 内容淡入淡出 */
.fade-enter-active { transition: opacity 0.2s ease; }
.fade-leave-active { transition: opacity 0.1s ease; }
.fade-enter-from,
.fade-leave-to { opacity: 0; }

/* 响应式 */
@media (max-width: 968px) {
  .notes-sidebar { display: none; }
  .mobile-cat-toggle { display: flex; }

  .notes-container {
    grid-template-columns: 1fr;
  }

  .notes-main {
    position: static;
    height: auto;
    min-height: 60vh;
  }

  .note-content-wrapper {
    padding: 1.25rem;
  }

  .docs-toc {
    display: none;
  }
}

@media (max-width: 768px) {
  .notes-section { padding: 1rem; }

  .note-nav {
    grid-template-columns: 1fr;
  }
}
</style>
