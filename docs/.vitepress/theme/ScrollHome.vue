<template>
  <div class="scroll-home">
    <!-- 上半部分：粒子背景 -->
    <section class="hero-upper" ref="heroUpper">
      <canvas ref="particleCanvas" class="particle-canvas"></canvas>
      <div class="hero-overlay"></div>
      <div class="hero-content-upper">
        <h1 class="hero-title">
          <span>{{ displayedTitle }}</span>
          <span class="typewriter-cursor" :class="{ blink: titleDone }">|</span>
        </h1>
      </div>
      <div class="hero-gradient-bottom"></div>
    </section>

    <!-- 下半部分：文字描述 -->
    <section class="hero-lower">
      <div class="hero-content-lower">
        <h2 class="hero-subtitle">知识的星辉照亮成长之路</h2>
        <p class="hero-description">
          恭喜你成为尊贵的星辉-奔驰车主！愿知识的星辉照亮你的学习与成长之路——
          一记天时，二录地利，三写人和。星光不问赶路人，时光不负有心人。
        </p>
        <div class="scroll-indicator" @click="scrollToNotes">
          <span>点击查看笔记</span>
          <div class="scroll-arrow"></div>
        </div>
      </div>
    </section>

    <!-- 笔记内容区域 -->
    <section class="notes-section" ref="notesSection">
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
            <Transition name="fade" mode="out-in">
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
      </div>
    </section>

    <!-- 回到顶部 -->
    <Transition name="fade">
      <button v-if="showBackToTop" class="back-to-top" @click="scrollToTop" title="回到顶部">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M18 15l-6-6-6 6"/>
        </svg>
      </button>
    </Transition>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, nextTick, watch } from 'vue'
import MarkdownIt from 'markdown-it'

const heroUpper = ref(null)
const particleCanvas = ref(null)
const notesSection = ref(null)
const notesMain = ref(null)
const noteContent = ref(null)
const contentWrapper = ref(null)
const activeCategory = ref(null)
const activeNote = ref(null)
const loading = ref(false)
const currentNoteContent = ref(null)
const expandedCategories = ref([2])
const showDrawer = ref(false)
const showBackToTop = ref(false)
const readingProgress = ref(0)

let animationId = null
let particles = []
let particleCtx = null

const md = new MarkdownIt({
  html: true,
  linkify: true,
  typographer: true
})

const markdownModules = import.meta.glob('../../notes/**/*.md', { query: '?raw', import: 'default' })

const categories = ref([
  {
    name: '机器学习',
    color: 'purple',
    notes: [
      { title: 'L1、L2 范数 + 正则化', path: '../../notes/guide/机器学习/L1-L2正则化.md' },
      { title: '梯度下降算法梳理', path: '../../notes/guide/机器学习/一些梯度下降算法.md' },
      { title: '特征工程', path: '../../notes/guide/机器学习/特征工程.md' }
    ]
  },
  {
    name: '前端相关',
    color: 'blue',
    notes: [
      { title: '组件间调用', path: '../../notes/guide/前端相关/组件调用.md' },
      { title: 'JSON.stringify', path: '../../notes/guide/前端相关/JSON.stringify.md' }
    ]
  },
  {
    name: '随心记',
    color: 'green',
    notes: [
      { title: 'Markdown 常用语法', path: '../../notes/guide/随心记/Markdown常用语法.md' },
      { title: '使用VitePress创建个人博客', path: '../../notes/guide/随心记/first.md' }
    ]
  }
])

// 打字机效果
const displayedTitle = ref('')
const titleDone = ref(false)
const fullTitle = '笔记星徽'

function startTypewriter() {
  let i = 0
  displayedTitle.value = ''
  titleDone.value = false
  const timer = setInterval(() => {
    if (i < fullTitle.length) {
      displayedTitle.value += fullTitle[i]
      i++
    } else {
      titleDone.value = true
      clearInterval(timer)
    }
  }, 150)
}

// 粒子系统
function initParticles() {
  const canvas = particleCanvas.value
  const container = heroUpper.value
  if (!canvas || !container) return

  particleCtx = canvas.getContext('2d')
  resizeCanvas()

  const count = 70
  particles = []
  for (let i = 0; i < count; i++) {
    particles.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.4,
      vy: -(Math.random() * 0.3 + 0.15),
      r: Math.random() * 2 + 0.8,
      opacity: Math.random() * 0.5 + 0.3
    })
  }
  animateParticles()
}

function resizeCanvas() {
  const canvas = particleCanvas.value
  const container = heroUpper.value
  if (!canvas || !container) return
  const rect = container.getBoundingClientRect()
  const dpr = window.devicePixelRatio || 1
  canvas.width = rect.width * dpr
  canvas.height = rect.height * dpr
  canvas.style.width = rect.width + 'px'
  canvas.style.height = rect.height + 'px'
  if (particleCtx) {
    particleCtx.scale(dpr, dpr)
  }
}

function animateParticles() {
  if (!particleCtx || !particleCanvas.value) return
  const canvas = particleCanvas.value
  const w = canvas.width / (window.devicePixelRatio || 1)
  const h = canvas.height / (window.devicePixelRatio || 1)
  const brandColor = getComputedStyle(document.documentElement).getPropertyValue('--vp-c-brand').trim() || '#667eea'

  particleCtx.clearRect(0, 0, w, h)

  particles.forEach(p => {
    p.x += p.vx
    p.y += p.vy
    if (p.x < 0) p.x = w
    if (p.x > w) p.x = 0
    if (p.y < -10) p.y = h + 10
    if (p.y > h + 10) p.y = -10

    particleCtx.beginPath()
    particleCtx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
    particleCtx.fillStyle = `${brandColor}${Math.round(p.opacity * 255).toString(16).padStart(2, '0')}`
    particleCtx.fill()
  })

  // 连线
  particles.forEach((a, i) => {
    particles.slice(i + 1).forEach(b => {
      const dx = a.x - b.x
      const dy = a.y - b.y
      const dist = Math.sqrt(dx * dx + dy * dy)
      if (dist < 120) {
        const alpha = (1 - dist / 120) * 0.15
        particleCtx.beginPath()
        particleCtx.moveTo(a.x, a.y)
        particleCtx.lineTo(b.x, b.y)
        particleCtx.strokeStyle = `${brandColor}${Math.round(alpha * 255).toString(16).padStart(2, '0')}`
        particleCtx.lineWidth = 0.5
        particleCtx.stroke()
      }
    })
  })

  animationId = requestAnimationFrame(animateParticles)
}

// 滚动到笔记区
function scrollToNotes() {
  notesSection.value?.scrollIntoView({ behavior: 'smooth' })
}

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

// 分类展开/折叠
function toggleCategory(categoryIndex) {
  const idx = expandedCategories.value.indexOf(categoryIndex)
  if (idx > -1) {
    expandedCategories.value.splice(idx, 1)
  } else {
    expandedCategories.value.push(categoryIndex)
  }
}

// 选择笔记
function selectNote(categoryIndex, noteIndex) {
  showDrawer.value = false
  loadNote(categoryIndex, noteIndex)
}

// 加载笔记
async function loadNote(categoryIndex, noteIndex) {
  activeCategory.value = categoryIndex
  activeNote.value = noteIndex
  loading.value = true
  readingProgress.value = 0

  try {
    const note = categories.value[categoryIndex].notes[noteIndex]
    const markdownLoader = markdownModules[note.path]
    if (markdownLoader) {
      const markdown = await markdownLoader()
      currentNoteContent.value = md.render(markdown)
      await nextTick()
      addCopyButtons()
      updateReadingTime()
      updateReadingProgress()
    } else {
      currentNoteContent.value = '<p>笔记文件不存在。</p>'
    }
  } catch (error) {
    console.error('加载笔记失败:', error)
    currentNoteContent.value = '<p>加载笔记失败，请检查文件是否存在。</p>'
  } finally {
    loading.value = false
  }
}

// 代码块复制按钮
function addCopyButtons() {
  const wrapper = noteContent.value
  if (!wrapper) return
  const blocks = wrapper.querySelectorAll('pre')
  blocks.forEach(pre => {
    if (pre.querySelector('.copy-btn')) return
    const btn = document.createElement('button')
    btn.className = 'copy-btn'
    btn.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>'
    btn.title = '复制代码'
    btn.addEventListener('click', async () => {
      const code = pre.querySelector('code')
      if (!code) return
      try {
        await navigator.clipboard.writeText(code.textContent || '')
        btn.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>'
        btn.classList.add('copied')
        setTimeout(() => {
          btn.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>'
          btn.classList.remove('copied')
        }, 2000)
      } catch {
        btn.textContent = '失败'
        setTimeout(() => {
          btn.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>'
        }, 2000)
      }
    })
    pre.style.position = 'relative'
    pre.appendChild(btn)
  })
}

// 阅读时间
const readingTimeText = ref('')

function updateReadingTime() {
  const wrapper = noteContent.value
  if (!wrapper) return
  const text = wrapper.textContent || ''
  const charCount = text.replace(/\s/g, '').length
  const minutes = Math.max(1, Math.ceil(charCount / 500))
  readingTimeText.value = `约 ${minutes} 分钟阅读`
}

// 阅读进度
function updateReadingProgress() {
  const wrapper = contentWrapper.value
  if (!wrapper) return
  const scrollTop = wrapper.scrollTop
  const scrollHeight = wrapper.scrollHeight - wrapper.clientHeight
  if (scrollHeight <= 0) {
    readingProgress.value = 0
  } else {
    readingProgress.value = Math.round((scrollTop / scrollHeight) * 100)
  }
}

// 当前分类信息
const currentCategoryName = computed(() => {
  if (activeCategory.value === null) return ''
  return categories.value[activeCategory.value]?.name || ''
})

const currentCategoryColor = computed(() => {
  if (activeCategory.value === null) return ''
  return categories.value[activeCategory.value]?.color || ''
})

// 扁平化笔记列表（用于上一篇/下一篇导航）
const flatNotes = computed(() => {
  const result = []
  categories.value.forEach((cat, ci) => {
    cat.notes.forEach((note, ni) => {
      result.push({ categoryIndex: ci, noteIndex: ni, title: note.title, category: cat.name })
    })
  })
  return result
})

const currentFlatIndex = computed(() => {
  if (activeCategory.value === null || activeNote.value === null) return -1
  return flatNotes.value.findIndex(
    n => n.categoryIndex === activeCategory.value && n.noteIndex === activeNote.value
  )
})

const hasPrev = computed(() => currentFlatIndex.value > 0)
const hasNext = computed(() => currentFlatIndex.value < flatNotes.value.length - 1)

const prevNoteTitle = computed(() => {
  if (!hasPrev.value) return ''
  return flatNotes.value[currentFlatIndex.value - 1].title
})

const nextNoteTitle = computed(() => {
  if (!hasNext.value) return ''
  return flatNotes.value[currentFlatIndex.value + 1].title
})

function goPrev() {
  if (!hasPrev.value) return
  const prev = flatNotes.value[currentFlatIndex.value - 1]
  loadNote(prev.categoryIndex, prev.noteIndex)
}

function goNext() {
  if (!hasNext.value) return
  const next = flatNotes.value[currentFlatIndex.value + 1]
  loadNote(next.categoryIndex, next.noteIndex)
}

// 滚动监听（回到顶部按钮）
function handlePageScroll() {
  showBackToTop.value = window.scrollY > 400
}

// 处理侧边栏
function handleSidebar() {
  nextTick(() => {
    const sidebar = document.querySelector('.VPSidebar')
    if (sidebar) {
      const currentPath = window.location.pathname
      if (currentPath === '/' || currentPath === '/index.html') {
        sidebar.classList.add('hidden-on-home')
      } else {
        sidebar.classList.remove('hidden-on-home')
      }
    }
  })
}

// 窗口大小变化时重绘粒子画布
let resizeTimer = null
function handleResize() {
  clearTimeout(resizeTimer)
  resizeTimer = setTimeout(() => {
    resizeCanvas()
  }, 200)
}

onMounted(() => {
  handleSidebar()
  startTypewriter()
  nextTick(() => {
    initParticles()
  })
  window.addEventListener('scroll', handlePageScroll)
  window.addEventListener('resize', handleResize)

  // 默认加载"使用VitePress创建个人博客"
  if (categories.value.length > 2 && categories.value[2].notes.length > 1) {
    loadNote(2, 1)
  }
})

onUnmounted(() => {
  if (animationId) {
    cancelAnimationFrame(animationId)
  }
  window.removeEventListener('scroll', handlePageScroll)
  window.removeEventListener('resize', handleResize)
  const sidebar = document.querySelector('.VPSidebar')
  if (sidebar) {
    sidebar.classList.remove('hidden-on-home')
  }
})
</script>

<style scoped>
.scroll-home {
  width: 100vw;
  margin-left: calc(-50vw + 50%);
  min-height: 100vh;
  position: relative;
  padding-top: 60px;
}

/* ===== 上半部分：粒子背景 ===== */
.hero-upper {
  position: relative;
  width: 100%;
  height: 50vh;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  background: radial-gradient(ellipse at center, #1a1a2e 0%, #0d0d1a 100%);
}

.particle-canvas {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.hero-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.25);
}

.hero-content-upper {
  position: relative;
  z-index: 10;
  text-align: center;
  color: #fff;
  padding: 2rem;
}

.hero-title {
  font-size: 4rem;
  font-weight: 800;
  text-shadow: 0 0 40px rgba(102, 126, 234, 0.5);
  letter-spacing: 0.08em;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0;
}

.typewriter-cursor {
  font-weight: 300;
  opacity: 1;
  color: var(--vp-c-brand);
}

.typewriter-cursor.blink {
  animation: cursorBlink 1s step-end infinite;
}

@keyframes cursorBlink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0; }
}

.hero-gradient-bottom {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 80px;
  background: linear-gradient(to bottom, transparent, var(--vp-c-bg));
  z-index: 5;
}

/* ===== 下半部分：文字描述 ===== */
.hero-lower {
  height: 50vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--vp-c-bg);
  padding: 2rem;
}

.hero-content-lower {
  max-width: 800px;
  text-align: center;
}

.hero-subtitle {
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
  color: var(--vp-c-text-1);
  background: var(--gradient-primary);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.hero-description {
  font-size: 1.1rem;
  line-height: 1.8;
  color: var(--vp-c-text-2);
  margin-bottom: 2rem;
}

.scroll-indicator {
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  gap: 0.6rem;
  animation: bounce 2s infinite;
  cursor: pointer;
  padding: 0.75rem 1.5rem;
  border-radius: 12px;
  transition: background 0.2s ease;
  color: var(--vp-c-text-2);
}

.scroll-indicator:hover {
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-brand);
}

@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(10px); }
}

.scroll-arrow {
  width: 24px;
  height: 24px;
  border-right: 3px solid var(--vp-c-brand);
  border-bottom: 3px solid var(--vp-c-brand);
  transform: rotate(45deg);
  opacity: 0.8;
}

/* ===== 笔记区域 ===== */
.notes-section {
  background: var(--vp-c-bg);
  padding: 2rem;
  min-height: calc(100vh - 4rem);
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
  max-width: 1400px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 300px 1fr;
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

.note-content :deep(pre) {
  background: var(--vp-c-bg-mute);
  padding: 1rem;
  border-radius: 10px;
  margin: 1rem 0;
  overflow-x: auto;
}

.note-content :deep(code) {
  font-family: 'JetBrains Mono', 'Fira Code', monospace;
  font-size: 0.88rem;
}

.note-content :deep(img) {
  max-width: 100%;
  border-radius: 8px;
  margin: 1rem 0;
}

/* 代码复制按钮 */
.note-content :deep(.copy-btn) {
  position: absolute;
  top: 8px;
  right: 8px;
  background: var(--vp-c-bg);
  border: 1px solid var(--vp-c-divider);
  border-radius: 6px;
  padding: 5px 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--vp-c-text-3);
  transition: all 0.2s ease;
  opacity: 0;
}

.note-content :deep(pre:hover .copy-btn) {
  opacity: 1;
}

.note-content :deep(.copy-btn:hover) {
  color: var(--vp-c-brand);
  border-color: var(--vp-c-brand);
}

.note-content :deep(.copy-btn.copied) {
  color: #22c55e;
  border-color: #22c55e;
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

.meta-category.dot-purple {
  background: rgba(102, 126, 234, 0.12);
  color: #667eea;
}

.meta-category.dot-blue {
  background: rgba(79, 172, 254, 0.12);
  color: #4facfe;
}

.meta-category.dot-green {
  background: rgba(67, 233, 123, 0.12);
  color: #2ea85a;
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

/* 回到顶部按钮 */
.back-to-top {
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  z-index: 150;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  border: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-1);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.back-to-top:hover {
  background: var(--vp-c-brand);
  color: #fff;
  border-color: var(--vp-c-brand);
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(102, 126, 234, 0.35);
}

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
}

@media (max-width: 768px) {
  .hero-title { font-size: 2.5rem; }
  .hero-subtitle { font-size: 1.5rem; }
  .hero-description { font-size: 1rem; }

  .notes-section { padding: 1rem; }

  .note-nav {
    grid-template-columns: 1fr;
  }
}
</style>
