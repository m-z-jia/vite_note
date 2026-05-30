import { ref } from 'vue'

export function useReadingProgress(contentWrapperRef) {
  const readingProgress = ref(0)
  const headings = ref([])
  const activeHeading = ref(null)
  let headingElementRefs = []
  let headingPositions = []

  // 计算元素相对于滚动容器的偏移量
  function getElementOffsetInContainer(el, container) {
    const elRect = el.getBoundingClientRect()
    const containerRect = container.getBoundingClientRect()
    return elRect.top - containerRect.top + container.scrollTop
  }

  // 提取文档标题并生成目录
  function extractHeadings() {
    const wrapper = contentWrapperRef.value
    if (!wrapper) return

    const headingElements = wrapper.querySelectorAll('h1, h2, h3, h4')
    headings.value = []
    headingElementRefs = []
    headingPositions = []

    headingElements.forEach((el, index) => {
      const id = `heading-${index}`
      el.id = id

      headings.value.push({
        id,
        text: el.textContent || '',
        level: parseInt(el.tagName.charAt(1))
      })

      headingElementRefs.push(el)
    })

    recalcHeadingPositions()
  }

  // 重新计算所有标题的位置
  function recalcHeadingPositions() {
    const wrapper = contentWrapperRef.value
    if (!wrapper || headingElementRefs.length === 0) return

    headingPositions = headingElementRefs.map(el =>
      getElementOffsetInContainer(el, wrapper)
    )
  }

  // 等待内容中所有图片加载完成后重新计算位置
  function waitForImagesAndRecalc() {
    const wrapper = contentWrapperRef.value
    if (!wrapper) return

    const images = wrapper.querySelectorAll('img')
    let pending = images.length

    if (pending === 0) return

    const onLoad = () => {
      pending--
      if (pending <= 0) {
        recalcHeadingPositions()
      }
    }

    images.forEach(img => {
      if (img.complete) {
        onLoad()
      } else {
        img.addEventListener('load', onLoad, { once: true })
        img.addEventListener('error', onLoad, { once: true })
      }
    })
  }

  // 滚动到指定标题
  function scrollToHeading(heading) {
    const wrapper = contentWrapperRef.value
    const index = headings.value.findIndex(h => h.id === heading.id)

    if (!wrapper || index < 0) return

    recalcHeadingPositions()

    if (index >= headingPositions.length) return

    const top = Math.max(0, headingPositions[index] - 80)
    wrapper.scrollTo({ top, behavior: 'smooth' })
  }

  // 更新当前激活的标题
  function updateActiveHeading() {
    const wrapper = contentWrapperRef.value
    if (!wrapper || headings.value.length === 0 || headingPositions.length === 0) return

    const scrollTop = wrapper.scrollTop
    let newActive = null

    for (let i = headingPositions.length - 1; i >= 0; i--) {
      if (headingPositions[i] - 100 <= scrollTop) {
        newActive = headings.value[i]?.id
        break
      }
    }

    if (newActive !== activeHeading.value) {
      activeHeading.value = newActive
    }
  }

  // 更新阅读进度
  function updateReadingProgress() {
    const wrapper = contentWrapperRef.value
    if (!wrapper) return
    const scrollTop = wrapper.scrollTop
    const scrollHeight = wrapper.scrollHeight - wrapper.clientHeight
    if (scrollHeight <= 0) {
      readingProgress.value = 0
    } else {
      readingProgress.value = Math.round((scrollTop / scrollHeight) * 100)
    }
    updateActiveHeading()
  }

  // 重置状态
  function reset() {
    readingProgress.value = 0
    headings.value = []
    activeHeading.value = null
    headingElementRefs = []
    headingPositions = []
  }

  return {
    readingProgress,
    headings,
    activeHeading,
    extractHeadings,
    recalcHeadingPositions,
    waitForImagesAndRecalc,
    scrollToHeading,
    updateReadingProgress,
    reset,
  }
}
