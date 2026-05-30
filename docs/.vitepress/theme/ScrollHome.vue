<template>
  <div class="scroll-home">
    <HeroSection @scroll-to-notes="scrollToNotes" />
    <NotesSection ref="notesSectionRef" />

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
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import HeroSection from './components/HeroSection.vue'
import NotesSection from './components/NotesSection.vue'

const notesSectionRef = ref(null)
const showBackToTop = ref(false)

function scrollToNotes() {
  const el = notesSectionRef.value?.$el || notesSectionRef.value
  if (el) {
    el.scrollIntoView({ behavior: 'smooth' })
  }
}

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

function handlePageScroll() {
  showBackToTop.value = window.scrollY > 400
}

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

onMounted(() => {
  handleSidebar()
  window.addEventListener('scroll', handlePageScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handlePageScroll)
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
</style>
