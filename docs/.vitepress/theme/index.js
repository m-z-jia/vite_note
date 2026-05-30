import DefaultTheme from 'vitepress/theme'
import ScrollHome from './ScrollHome.vue'
import './custom.css'

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    app.component('ScrollHome', ScrollHome)
  }
}