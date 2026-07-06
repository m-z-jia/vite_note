import { ref, computed } from 'vue'
import MarkdownIt from 'markdown-it'
import hljs from 'highlight.js/lib/core'
import java from 'highlight.js/lib/languages/java'
import javascript from 'highlight.js/lib/languages/javascript'
import python from 'highlight.js/lib/languages/python'
import xml from 'highlight.js/lib/languages/xml'
import css from 'highlight.js/lib/languages/css'
import json from 'highlight.js/lib/languages/json'
import bash from 'highlight.js/lib/languages/bash'
import sql from 'highlight.js/lib/languages/sql'
import markdown from 'highlight.js/lib/languages/markdown'

hljs.registerLanguage('java', java)
hljs.registerLanguage('javascript', javascript)
hljs.registerLanguage('js', javascript)
hljs.registerLanguage('python', python)
hljs.registerLanguage('py', python)
hljs.registerLanguage('html', xml)
hljs.registerLanguage('xml', xml)
hljs.registerLanguage('css', css)
hljs.registerLanguage('json', json)
hljs.registerLanguage('bash', bash)
hljs.registerLanguage('sh', bash)
hljs.registerLanguage('sql', sql)
hljs.registerLanguage('markdown', markdown)

const LANG_MAP = {
  java: 'Java', javascript: 'JavaScript', js: 'JavaScript',
  typescript: 'TypeScript', ts: 'TypeScript', python: 'Python', py: 'Python',
  html: 'HTML', xml: 'XML', css: 'CSS', vue: 'Vue', json: 'JSON',
  bash: 'Shell', sh: 'Shell', sql: 'SQL', go: 'Go', rust: 'Rust',
  c: 'C', cpp: 'C++', csharp: 'C#', php: 'PHP', ruby: 'Ruby',
  kotlin: 'Kotlin', swift: 'Swift', md: 'Markdown', markdown: 'Markdown',
  yaml: 'YAML', yml: 'YAML',
}

const md = new MarkdownIt({
  html: true,
  linkify: true,
  typographer: true,
  highlight(str, lang) {
    const label = LANG_MAP[lang] || lang || ''
    const dataAttr = lang ? ` data-lang="${label}"` : ''
    if (lang && hljs.getLanguage(lang)) {
      try {
        const result = hljs.highlight(str, { language: lang })
        return `<div class="code-block"${dataAttr}><pre class="hljs"><code>${result.value}</code></pre></div>`
      } catch (_) {}
    }
    return `<div class="code-block"${dataAttr}><pre class="hljs"><code>${md.utils.escapeHtml(str)}</code></pre></div>`
  }
})

function withBaseForRootAbsoluteUrls(html) {
  const base = import.meta.env.BASE_URL.replace(/\/$/, '')
  if (!base) return html

  return html.replace(/(src|href)="\/(?!\/)/g, `$1="${base}/`)
}

const markdownModules = import.meta.glob('../../../notes/**/*.md', { query: '?raw', import: 'default' })

const categories = ref([
  {
    name: '机器学习',
    color: 'purple',
    notes: [
      { title: 'L1、L2 范数 + 正则化', path: '../../../notes/guide/机器学习/L1-L2正则化.md' },
      { title: '梯度下降算法梳理', path: '../../../notes/guide/机器学习/一些梯度下降算法.md' },
      { title: '特征工程', path: '../../../notes/guide/机器学习/特征工程.md' }
    ]
  },
  {
    name: '前端相关',
    color: 'blue',
    notes: [
      { title: '组件间调用', path: '../../../notes/guide/前端相关/组件调用.md' },
      { title: 'JSON.stringify', path: '../../../notes/guide/前端相关/JSON.stringify.md' }
    ]
  },
  {
    name: '作业',
    color: 'orange',
    notes: [
      { title: 'Java反射机制', path: '../../../notes/guide/作业/需求1-Java反射机制.md' },
      { title: '文本文件复制', path: '../../../notes/guide/作业/需求2-文本文件复制.md' },
      { title: '计算方法执行时间+匿名内部类', path: '../../../notes/guide/作业/需求3-计算方法执行时间+匿名内部类.md' },
      { title: '形式化方法', path: '../../../notes/guide/作业/需求4-形式化方法.md' },
      { title: 'Prime Numbers素数', path: '../../../notes/guide/作业/需求5-Prime-Numbers素数.md' },
      { title: '枚举类型应用场景', path: '../../../notes/guide/作业/需求6-枚举类型应用场景.md' },
      { title: '实验4-App运行说明', path: '../../../notes/guide/作业/需求7-实验4-App运行说明.md' }
    ]
  },
  {
    name: '随心记',
    color: 'green',
    notes: [
      { title: 'Markdown 常用语法', path: '../../../notes/guide/随心记/Markdown常用语法.md' },
      { title: '使用VitePress创建个人博客', path: '../../../notes/guide/随心记/first.md' },
      { title: 'skills - AI 编程工程化指令集', path: '../../../notes/guide/随心记/skills.md' },
      { title: 'codegraph - 代码语义图谱索引工具', path: '../../../notes/guide/随心记/codegraph.md' }
    ]
  }
])

export function useNoteLoader(contentWrapperRef) {
  const activeCategory = ref(null)
  const activeNote = ref(null)
  const loading = ref(false)
  const currentNoteContent = ref(null)
  const expandedCategories = ref([2])
  const showDrawer = ref(false)
  const readingTimeText = ref('')

  // 代码块复制按钮
  function addCopyButtons() {
    const wrapper = contentWrapperRef.value
    if (!wrapper) return
    const blocks = wrapper.querySelectorAll('.code-block')
    blocks.forEach(block => {
      if (block.querySelector('.copy-btn')) return
      const pre = block.querySelector('pre')
      if (!pre) return
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
      block.appendChild(btn)
    })
  }

  // 阅读时间
  function updateReadingTime() {
    const wrapper = contentWrapperRef.value
    if (!wrapper) return
    const text = wrapper.textContent || ''
    const charCount = text.replace(/\s/g, '').length
    const minutes = Math.max(1, Math.ceil(charCount / 500))
    readingTimeText.value = `约 ${minutes} 分钟阅读`
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

    try {
      const note = categories.value[categoryIndex].notes[noteIndex]
      const markdownLoader = markdownModules[note.path]
      if (markdownLoader) {
        const markdown = await markdownLoader()
        currentNoteContent.value = withBaseForRootAbsoluteUrls(md.render(markdown))
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

  return {
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
    flatNotes,
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
  }
}
