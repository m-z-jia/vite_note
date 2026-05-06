<template>
  <div class="scroll-home">
    <!-- 上半部分：背景 -->
    <section class="hero-upper">
      <div class="hero-background"></div>
      <div class="hero-overlay"></div>
      <div class="hero-content-upper">
        <h1 class="hero-title">笔记星徽</h1>
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
      <!-- 笔记容器 - 左右布局 -->
      <div class="notes-container">
        <!-- 左侧：多级目录 -->
        <div class="notes-list">
          <div 
            v-for="(category, categoryIndex) in categories" 
            :key="categoryIndex"
            class="category-item"
          >
            <div 
              class="category-header"
              @click="toggleCategory(categoryIndex)"
            >
              <span class="category-icon" :class="{ expanded: expandedCategories.includes(categoryIndex) }">
                ▶
              </span>
              <span class="category-name">{{ category.name }}</span>
            </div>
            <div v-if="expandedCategories.includes(categoryIndex)" class="notes-sub-list">
              <div 
                v-for="(note, noteIndex) in category.notes" 
                :key="noteIndex"
                :class="['note-item', { active: activeCategory === categoryIndex && activeNote === noteIndex }]"
                @click="loadNote(categoryIndex, noteIndex)"
              >
                {{ note.title }}
              </div>
            </div>
          </div>
        </div>

        <!-- 右侧：笔记内容显示 -->
        <div class="note-content-display">
          <div v-if="loading" class="note-empty">
            <p>加载中...</p>
          </div>
          <div v-else-if="currentNoteContent" class="note-content vp-doc" v-html="currentNoteContent"></div>
          <div v-else class="note-empty">
            <p>请选择一个笔记查看</p>
          </div>
        </div>
      </div>
    </section>


  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch, nextTick } from 'vue'
import MarkdownIt from 'markdown-it'

const notesSection = ref(null)
const activeCategory = ref(null)
const activeNote = ref(null)
const loading = ref(false)
const currentNoteContent = ref(null)
const expandedCategories = ref([2]) // 默认展开"随心记"分类

const md = new MarkdownIt({
  html: true,
  linkify: true,
  typographer: true
})

// 使用 import.meta.glob 加载所有 Markdown 文件
const markdownModules = import.meta.glob('../../notes/**/*.md', { as: 'raw' })

const categories = ref([
  {
    name: '机器学习',
    notes: [
      {
        title: 'L1、L2 范数 + 正则化',
        path: '../../notes/guide/机器学习/L1-L2正则化.md'
      },
      {
        title: '梯度下降算法梳理',
        path: '../../notes/guide/机器学习/一些梯度下降算法.md'
      },
      {
        title: '特征工程',
        path: '../../notes/guide/机器学习/特征工程.md'
      }
    ]
  },
  {
    name: '前端相关',
    notes: [
      {
        title: '组件间调用',
        path: '../../notes/guide/前端相关/组件调用.md'
      },
      {
        title: 'JSON.stringify',
        path: '../../notes/guide/前端相关/JSON.stringify.md'
      }
    ]
  },
  {
    name: '随心记',
    notes: [
      {
        title: 'Markdown 常用语法',
        path: '../../notes/guide/随心记/Markdown常用语法.md'
      },
      {
        title: '使用VitePress创建个人博客',
        path: '../../notes/guide/随心记/first.md'
      }
    ]
  }
])

const toggleCategory = (categoryIndex) => {
  const index = expandedCategories.value.indexOf(categoryIndex)
  if (index > -1) {
    expandedCategories.value.splice(index, 1)
  } else {
    expandedCategories.value.push(categoryIndex)
  }
}

const loadNote = async (categoryIndex, noteIndex) => {
  activeCategory.value = categoryIndex
  activeNote.value = noteIndex
  loading.value = true
  
  try {
    const note = categories.value[categoryIndex].notes[noteIndex]
    const markdownLoader = markdownModules[note.path]
    if (markdownLoader) {
      const markdown = await markdownLoader()
      currentNoteContent.value = md.render(markdown)
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

const scrollToNotes = () => {
  notesSection.value?.scrollIntoView({ behavior: 'smooth' })
}

const handleSidebar = () => {
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

onMounted(() => {
  handleSidebar()
  // 默认加载"使用VitePress创建个人博客"
  if (categories.value.length > 2 && categories.value[2].notes.length > 1) {
    loadNote(2, 1)
  }
})

onUnmounted(() => {
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
  padding-top: 60px; /* 为固定导航栏留出空间 */
}

/* 上半部分：背景区域 - 真正全屏 */
.hero-upper {
  position: relative;
  width: 100%;
  height: 50vh;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.hero-background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%);
  background-size: 400% 400%;
  animation: gradientShift 15s ease infinite;
}

@keyframes gradientShift {
  0%, 100% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
}

.hero-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.3);
}

.hero-content-upper {
  position: relative;
  z-index: 10;
  text-align: center;
  color: white;
  padding: 2rem;
}

.hero-title {
  font-size: 4rem;
  font-weight: 800;
  text-shadow: 2px 2px 20px rgba(0, 0, 0, 0.3);
  letter-spacing: 0.05em;
}

.hero-gradient-bottom {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 80px;
  background: linear-gradient(to bottom, transparent, var(--vp-c-bg));
}

/* 下半部分：文字描述区域 */
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
}

.hero-description {
  font-size: 1.1rem;
  line-height: 1.8;
  color: var(--vp-c-text-2);
  margin-bottom: 2rem;
}

.scroll-indicator {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.8rem;
  animation: bounce 2s infinite;
  cursor: pointer;
  padding: 1rem;
  border-radius: 12px;
  transition: background 0.2s ease;
}

.scroll-indicator:hover {
  background: var(--vp-c-bg-soft);
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

/* 笔记区域 */
.notes-section {
  background: var(--vp-c-bg);
  padding: 2rem;
  min-height: calc(100vh - 4rem);
}

/* 笔记容器 - 左右布局 */
.notes-container {
  max-width: 1400px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 300px 1fr;
  gap: 2rem;
  align-items: start;
}

/* 笔记列表 - 多级目录 */
.notes-list {
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

/* 一级目录：分类 */
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
  font-size: 0.8rem;
  color: var(--vp-c-brand);
  flex-shrink: 0;
}

.category-icon.expanded {
  transform: rotate(90deg);
}

/* 二级目录：笔记列表 */
.notes-sub-list {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  padding-left: 1.5rem;
  margin-top: 0.25rem;
  overflow-y: auto;
}

.note-item {
  padding: 0.6rem 1rem;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
  color: var(--vp-c-text-2);
  font-weight: 500;
  font-size: 0.95rem;
  flex-shrink: 0;
}

.note-item:hover {
  background: var(--vp-c-bg-mute);
  color: var(--vp-c-text-1);
}

.note-item.active {
  background: var(--vp-c-brand);
  color: white;
}

/* 笔记内容显示区 */
.note-content-display {
  background: var(--vp-c-bg-soft);
  border-radius: 12px;
  padding: 2rem;
  overflow-y: auto;
  position: sticky;
  top: 76px;
  height: calc(100vh - 116px);
  flex-shrink: 0;
}

.note-empty {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: var(--vp-c-text-3);
  font-size: 1.1rem;
}

.note-content {
  line-height: 1.8;
}

/* 让 Markdown 内容使用 VitePress 的样式 */
.note-content :deep(.vp-doc),
.note-content :deep(h1) {
  font-size: 1.75rem;
  font-weight: 700;
  color: var(--vp-c-text-1);
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid var(--vp-c-brand);
}

.note-content :deep(.vp-doc h2),
.note-content :deep(h2) {
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--vp-c-text-1);
  margin: 1.5rem 0 1rem;
}

.note-content :deep(.vp-doc h3),
.note-content :deep(h3) {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--vp-c-text-1);
  margin: 1.25rem 0 0.75rem;
}

.note-content :deep(.vp-doc h4),
.note-content :deep(h4) {
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--vp-c-text-1);
  margin: 1rem 0 0.5rem;
}

.note-content :deep(.vp-doc p),
.note-content :deep(p) {
  font-size: 1rem;
  color: var(--vp-c-text-2);
  margin: 0.75rem 0;
}

.note-content :deep(.vp-doc ul),
.note-content :deep(.vp-doc ol),
.note-content :deep(ul),
.note-content :deep(ol) {
  margin: 0.75rem 0;
  padding-left: 1.5rem;
}

.note-content :deep(.vp-doc li),
.note-content :deep(li) {
  color: var(--vp-c-text-2);
  margin: 0.5rem 0;
}

.note-content :deep(.vp-doc pre),
.note-content :deep(pre) {
  background: var(--vp-c-bg-mute);
  padding: 1rem;
  border-radius: 8px;
  margin: 1rem 0;
  overflow-x: auto;
}

.note-content :deep(.vp-doc code),
.note-content :deep(code) {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.9rem;
}

/* 响应式设计 */
@media (max-width: 968px) {
  .notes-container {
    grid-template-columns: 1fr;
  }
  
  .notes-list {
    position: static;
    max-height: none;
  }
}

@media (max-width: 768px) {
  .hero-title {
    font-size: 2.5rem;
  }
  
  .hero-subtitle {
    font-size: 1.5rem;
  }
  
  .hero-description {
    font-size: 1rem;
  }
}
</style>
