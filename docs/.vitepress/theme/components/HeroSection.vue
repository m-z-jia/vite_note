<template>
  <section class="hero-stage" ref="heroStage" :style="{ '--hero-bg': `url(${heroImage})` }">
    <canvas ref="particleCanvas" class="particle-canvas"></canvas>
    <div class="hero-scrim"></div>

    <div class="hero-layout">
      <div class="hero-copy">
        <p class="hero-kicker">Mzj's learning field</p>
        <h1>把零散的学习，整理成可回望的星图。</h1>
        <p class="hero-lead">
          这里收纳机器学习、前端、课程作业和随手记录。写下来的不是答案终点，
          而是每次理解重新变清楚的轨迹。
        </p>

        <div class="hero-actions">
          <button class="primary-action" @click="$emit('scrollToNotes')">
            <span>进入笔记</span>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M5 12h14M13 5l7 7-7 7"/>
            </svg>
          </button>
          <!-- <a class="text-action" :href="firstNoteLink">搭建记录</a> -->
        </div>

        <dl class="hero-stats" aria-label="笔记概览">
          <div>
            <dt>4</dt>
            <dd>主题</dd>
          </div>
          <div>
            <dt>15</dt>
            <dd>笔记</dd>
          </div>
          <div>
            <dt>∞</dt>
            <dd>持续更新</dd>
          </div>
        </dl>
      </div>

      <div class="hero-atlas" aria-hidden="true">
        <div class="atlas-image"></div>
        <div class="atlas-line line-a"></div>
        <div class="atlas-line line-b"></div>
        <div class="atlas-note note-a">
          <span>ML</span>
          <strong>L1 / L2 正则化</strong>
        </div>
        <div class="atlas-note note-b">
          <span>FE</span>
          <strong>JSON.stringify</strong>
        </div>
        <div class="atlas-note note-c">
          <span>HW</span>
          <strong>Java 反射机制</strong>
        </div>
      </div>
    </div>

    <button class="scroll-cue" @click="$emit('scrollToNotes')" title="查看笔记">
      <span></span>
    </button>
  </section>
</template>

<script setup>
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import { withBase } from 'vitepress'
import { useParticles } from '../composables/useParticles.js'

defineEmits(['scrollToNotes'])

const heroStage = ref(null)
const particleCanvas = ref(null)
const heroImage = withBase('/img/background.jpg')
const firstNoteLink = withBase('/notes/guide/随心记/first')

const { init: initParticles, resize: resizeParticles } = useParticles(
  particleCanvas,
  heroStage,
  {
    count: 52,
    vxRange: [-0.16, 0.16],
    vyRange: [-0.24, -0.08],
    rRange: [0.6, 2.2],
    opacityRange: [0.2, 0.62],
    connectionDistance: 96,
    lineAlpha: 0.08,
    lineWidth: 0.4,
  }
)

onMounted(() => {
  nextTick(initParticles)
  window.addEventListener('resize', resizeParticles)
})

onUnmounted(() => {
  window.removeEventListener('resize', resizeParticles)
})
</script>

<style scoped>
.hero-stage {
  position: relative;
  min-height: calc(100vh - 60px);
  overflow: hidden;
  background:
    radial-gradient(circle at 18% 18%, rgba(214, 168, 95, 0.18), transparent 34%),
    linear-gradient(135deg, #081413 0%, #10151a 42%, #1b1b18 100%);
  color: #f8f3e8;
}

.particle-canvas,
.hero-scrim {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.hero-scrim {
  background:
    linear-gradient(90deg, rgba(8, 20, 19, 0.94) 0%, rgba(8, 20, 19, 0.72) 48%, rgba(8, 20, 19, 0.2) 100%),
    linear-gradient(180deg, rgba(8, 20, 19, 0.05) 0%, var(--vp-c-bg) 100%);
  z-index: 1;
}

.hero-layout {
  position: relative;
  z-index: 3;
  width: min(1180px, calc(100% - 48px));
  min-height: calc(100vh - 60px);
  margin: 0 auto;
  display: grid;
  grid-template-columns: minmax(0, 0.94fr) minmax(360px, 0.8fr);
  gap: clamp(2rem, 5vw, 5rem);
  align-items: center;
  padding: clamp(4rem, 8vw, 7rem) 0 5rem;
}

.hero-copy {
  max-width: 720px;
}

.hero-kicker {
  margin: 0 0 1.15rem;
  color: #d6a85f;
  font-size: 0.78rem;
  font-weight: 700;
  letter-spacing: 0.18em;
  text-transform: uppercase;
}

.hero-copy h1 {
  margin: 0;
  max-width: 11em;
  font-size: clamp(2.7rem, 7vw, 6.25rem);
  line-height: 0.98;
  font-weight: 820;
  letter-spacing: 0;
}

.hero-lead {
  max-width: 640px;
  margin: 1.6rem 0 0;
  color: rgba(248, 243, 232, 0.75);
  font-size: clamp(1rem, 1.6vw, 1.18rem);
  line-height: 1.9;
}

.hero-actions {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
  margin-top: 2rem;
}

.primary-action,
.text-action {
  min-height: 44px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.55rem;
  border-radius: 7px;
  font-weight: 700;
  text-decoration: none;
}

.primary-action {
  padding: 0 1.25rem;
  border: 1px solid rgba(214, 168, 95, 0.85);
  background: #d6a85f;
  color: #17201d;
  cursor: pointer;
  transition: transform 0.2s ease, background 0.2s ease;
}

.primary-action:hover {
  transform: translateY(-2px);
  background: #edc985;
}

.text-action {
  color: rgba(248, 243, 232, 0.76);
  border-bottom: 1px solid rgba(248, 243, 232, 0.26);
}

.text-action:hover {
  color: #fff;
  border-color: #d6a85f;
}

.hero-stats {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 1px;
  max-width: 520px;
  margin: clamp(2.5rem, 5vw, 4.25rem) 0 0;
  padding: 0;
  border-top: 1px solid rgba(248, 243, 232, 0.16);
  border-bottom: 1px solid rgba(248, 243, 232, 0.16);
}

.hero-stats div {
  padding: 1.1rem 1rem 1rem 0;
}

.hero-stats dt {
  color: #f8f3e8;
  font-size: 1.75rem;
  line-height: 1;
  font-weight: 780;
}

.hero-stats dd {
  margin: 0.35rem 0 0;
  color: rgba(248, 243, 232, 0.58);
  font-size: 0.82rem;
}

.hero-atlas {
  position: relative;
  min-height: min(64vh, 620px);
}

.atlas-image {
  position: absolute;
  inset: 5% 0 8% 8%;
  background-image:
    linear-gradient(180deg, rgba(8, 20, 19, 0.06), rgba(8, 20, 19, 0.34)),
    var(--hero-bg);
  background-position: center;
  background-size: cover;
  clip-path: polygon(12% 0, 100% 9%, 88% 100%, 0 86%);
  box-shadow: 0 34px 90px rgba(0, 0, 0, 0.34);
}

.atlas-image::after {
  content: '';
  position: absolute;
  inset: 18px;
  border: 1px solid rgba(248, 243, 232, 0.24);
  clip-path: polygon(12% 0, 100% 9%, 88% 100%, 0 86%);
}

.atlas-line {
  position: absolute;
  height: 1px;
  transform-origin: left center;
  background: linear-gradient(90deg, transparent, rgba(214, 168, 95, 0.85), transparent);
}

.line-a {
  top: 32%;
  left: 10%;
  width: 82%;
  transform: rotate(-13deg);
}

.line-b {
  top: 62%;
  left: 16%;
  width: 70%;
  transform: rotate(19deg);
}

.atlas-note {
  position: absolute;
  width: min(210px, 48%);
  padding: 0.9rem;
  border: 1px solid rgba(248, 243, 232, 0.2);
  border-radius: 8px;
  background: rgba(9, 16, 15, 0.76);
  color: #f8f3e8;
  backdrop-filter: blur(12px);
  box-shadow: 0 18px 48px rgba(0, 0, 0, 0.22);
}

.atlas-note span {
  display: block;
  color: #d6a85f;
  font-size: 0.72rem;
  font-weight: 800;
  letter-spacing: 0.12em;
  margin-bottom: 0.35rem;
}

.atlas-note strong {
  font-size: 0.96rem;
  line-height: 1.42;
}

.note-a { top: 9%; right: 4%; }
.note-b { top: 43%; left: 0; }
.note-c { right: 2%; bottom: 8%; }

.scroll-cue {
  position: absolute;
  z-index: 4;
  left: 50%;
  bottom: 1.4rem;
  width: 32px;
  height: 48px;
  border: 1px solid rgba(248, 243, 232, 0.38);
  border-radius: 999px;
  background: rgba(8, 20, 19, 0.25);
  transform: translateX(-50%);
  cursor: pointer;
}

.scroll-cue span {
  display: block;
  width: 4px;
  height: 9px;
  margin: 9px auto 0;
  border-radius: 999px;
  background: #d6a85f;
  animation: cueMove 1.8s ease-in-out infinite;
}

@keyframes cueMove {
  0%, 100% { transform: translateY(0); opacity: 0.45; }
  50% { transform: translateY(14px); opacity: 1; }
}

@media (max-width: 960px) {
  .hero-layout {
    grid-template-columns: 1fr;
    gap: 1.5rem;
    align-items: start;
    padding-top: 4.5rem;
  }

  .hero-atlas {
    min-height: 360px;
  }
}

@media (max-width: 640px) {
  .hero-stage,
  .hero-layout {
    min-height: auto;
  }

  .hero-layout {
    width: min(100% - 32px, 1180px);
    padding: 3.25rem 0 4.5rem;
  }

  .hero-copy h1 {
    font-size: clamp(2.25rem, 14vw, 3.8rem);
  }

  .hero-stats {
    grid-template-columns: 1fr;
  }

  .hero-stats div {
    padding: 0.9rem 0;
  }

  .hero-atlas {
    min-height: 300px;
  }

  .atlas-note {
    width: 176px;
    padding: 0.75rem;
  }

  .note-b {
    top: 48%;
  }
}
</style>
