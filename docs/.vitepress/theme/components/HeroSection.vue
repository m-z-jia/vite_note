<template>
  <!-- 上半部分：粒子背景 -->
  <section class="hero-upper" ref="heroUpper">
    <canvas ref="particleCanvas" class="particle-canvas"></canvas>
    <div class="hero-overlay"></div>
    <div class="hero-content-upper" v-if="fullTitle">
      <h1 class="hero-title">
        <span>{{ displayedTitle }}</span>
        <span class="typewriter-cursor" :class="{ blink: titleDone }">|</span>
      </h1>
    </div>
    <div class="hero-gradient-bottom"></div>
  </section>

  <!-- 下半部分：文字描述 -->
  <section class="hero-lower" ref="heroLower">
    <canvas ref="lowerParticleCanvas" class="particle-canvas"></canvas>
    <div class="hero-content-lower">
      <h2 class="hero-subtitle">知识的星辉照亮成长之路</h2>
      <p class="hero-description">
        恭喜你成为尊贵的星辉-奔驰车主！愿知识的星辉照亮你的学习与成长之路——
        一记天时，二录地利，三写人和。星光不问赶路人，时光不负有心人。
      </p>
      <div class="scroll-indicator" @click="$emit('scrollToNotes')">
        <span>点击查看笔记</span>
        <div class="scroll-arrow"></div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue'
import { useParticles } from '../composables/useParticles.js'

defineEmits(['scrollToNotes'])

const heroUpper = ref(null)
const particleCanvas = ref(null)
const heroLower = ref(null)
const lowerParticleCanvas = ref(null)

// 打字机效果
const displayedTitle = ref('')
const titleDone = ref(false)
const fullTitle = ''

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

// 上半部分粒子（向上飘）
const { init: initHeroParticles, resize: resizeHeroParticles } = useParticles(
  particleCanvas, heroUpper,
  { count: 70, vxRange: [-0.2, 0.2], vyRange: [-0.45, -0.15], rRange: [0.8, 2.8], opacityRange: [0.3, 0.8], connectionDistance: 120, lineAlpha: 0.15, lineWidth: 0.5 }
)

// 下半部分粒子（向下飘）
const { init: initLowerParticles, resize: resizeLowerParticles } = useParticles(
  lowerParticleCanvas, heroLower,
  { count: 50, vxRange: [-0.15, 0.15], vyRange: [0.1, 0.3], rRange: [0.5, 2], opacityRange: [0.2, 0.6], connectionDistance: 100, lineAlpha: 0.1, lineWidth: 0.3 }
)

function resizeAll() {
  resizeHeroParticles()
  resizeLowerParticles()
}

onMounted(() => {
  // startTypewriter()
  nextTick(() => {
    initHeroParticles()
    initLowerParticles()
  })
  window.addEventListener('resize', resizeAll)
})
</script>

<style scoped>
/* ===== 上半部分：粒子背景 ===== */
.hero-upper {
  position: relative;
  width: 100%;
  height: 50vh;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  background: url('/img/background.jpg') center/cover no-repeat;
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
  background: rgba(0, 0, 0, 0);
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
  text-shadow:
    0 0 40px rgba(102, 126, 234, 0.8),
    0 2px 4px rgba(0, 0, 0, 0.8),
    0 4px 8px rgba(0, 0, 0, 0.6),
    0 8px 16px rgba(0, 0, 0, 0.4);
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
  height: 90%;
  background: linear-gradient(to bottom,
    transparent 0%,
    rgba(13, 13, 26, 0) 50%,
    var(--vp-c-bg) 100%);
  z-index: 5;
}

/* ===== 下半部分：文字描述 ===== */
.hero-lower {
  position: relative;
  height: 50vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--vp-c-bg);
  padding: 2rem;
  overflow: hidden;
}

.hero-content-lower {
  position: relative;
  z-index: 10;
  max-width: 800px;
  text-align: center;
}

.hero-subtitle {
  font-size: 2rem;
  font-weight: 700;
  line-height: 1.4;
  margin: 0 0 1.5rem;
  padding: 0.25rem 0;
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

@media (max-width: 768px) {
  .hero-title { font-size: 2.5rem; }
  .hero-subtitle { font-size: 1.5rem; }
  .hero-description { font-size: 1rem; }
}
</style>
