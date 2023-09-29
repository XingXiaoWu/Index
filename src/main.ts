import { createApp } from 'vue'
import 'virtual:uno.css'
import '@unocss/reset/normalize.css'
// 通用字体
import 'vfonts/Lato.css'
// 等宽字体
import 'vfonts/FiraCode.css'
import App from './App.vue'
import { router } from './routes'

const app = createApp(App)
app.use(router)
const meta = document.createElement('meta')
meta.name = 'naive-ui-style'
document.head.appendChild(meta)
app.mount('#app')
