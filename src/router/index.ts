import { createRouter, createWebHashHistory, type RouteRecordRaw } from 'vue-router'
import Index from '../views/Index.vue'
import KeyValGenerator from '../views/KeyValGenerator.vue'
import ThanksLiVue from '../views/ThanksLi.vue'
import Safe from '../views/Safe.vue'
import Fxkp from '../views/Fxkp.vue'
import NetWorkTop from '../views/NetWorkTop.vue'
import Pdf2Png from '../views/Pdf2Png.vue'
import Ciphertext from '../views/Ciphertext.vue'

const routes: RouteRecordRaw[] = [
  { path: '/', component: Index, name: "index" },
  { path: '/KeyValGenerator', component: KeyValGenerator, name: "KeyValGenerator" },
  { path: '/thanks', component: ThanksLiVue, name: "thanks" },
  { path: '/safe', component: Safe, name: "safe" },
  { path: '/network', component: NetWorkTop, name: "network" },
  { path: '/fxkp', component: Fxkp, name: "fxkp" },
  { path: '/pdf2png', component: Pdf2Png, name: "pdf2png" },
  { path: '/ciphertext', component: Ciphertext, name: "ciphertext" },
]

const router = createRouter({
  // 4. 内部提供了 history 模式的实现。为了简单起见，我们在这里使用 hash 模式。
  history: createWebHashHistory(),
  routes, // `routes: routes` 的缩写
})

export default router
