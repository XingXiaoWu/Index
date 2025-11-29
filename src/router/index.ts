import { createRouter, createWebHashHistory, type RouteRecordRaw } from 'vue-router'
import Index from '../views/Index.vue'
import KeyValGenerator from '../views/KeyValGenerator.vue'
import ThanksLiVue from '../views/ThanksLi.vue'
import Safe from '../views/Safe.vue'
import Fxkp from '../views/Fxkp.vue'
import NetWorkTop from '../views/NetWorkTop.vue'
import Pdf2Png from '../views/Pdf2Png.vue'
import Ciphertext from '../views/Ciphertext.vue'
import ImageTools from '../views/ImageTools.vue'
import ImageBase64 from '../views/ImageBase64.vue'
// import ImageToIco from '../views/ImageToIco.vue'
// import ImagePdf from '../views/ImagePdf.vue'
// import ImageResize from '../views/ImageResize.vue'
import ImageCompress from '../views/ImageCompress.vue'
import TextTools from '../views/TextTools.vue'
import TextCompare from '../views/TextCompare.vue'
import TextCase from '../views/TextCase.vue'
import TextEncode from '../views/TextEncode.vue'

const routes: RouteRecordRaw[] = [
  { path: '/', component: Index, name: "index" },
  { path: '/KeyValGenerator', component: KeyValGenerator, name: "KeyValGenerator" },
  { path: '/thanks', component: ThanksLiVue, name: "thanks" },
  { path: '/safe', component: Safe, name: "safe" },
  { path: '/network', component: NetWorkTop, name: "network" },
  { path: '/fxkp', component: Fxkp, name: "fxkp" },
  { path: '/pdf2png', component: Pdf2Png, name: "pdf2png" },
  { path: '/ciphertext', component: Ciphertext, name: "ciphertext" },
  // 图片工具
  { path: '/image-tools', component: ImageTools, name: "imageTools" },
  { path: '/image-base64', component: ImageBase64, name: "imageBase64" },
  // { path: '/image-to-ico', component: ImageToIco, name: "imageToIco" },
  // { path: '/image-pdf', component: ImagePdf, name: "imagePdf" },
  // { path: '/image-resize', component: ImageResize, name: "imageResize" },
  { path: '/image-compress', component: ImageCompress, name: "imageCompress" },
  // 文本工具
  { path: '/text-tools', component: TextTools, name: "textTools" },
  { path: '/text-compare', component: TextCompare, name: "textCompare" },
  { path: '/text-case', component: TextCase, name: "textCase" },
  { path: '/text-encode', component: TextEncode, name: "textEncode" },
]

const router = createRouter({
  // 4. 内部提供了 history 模式的实现。为了简单起见，我们在这里使用 hash 模式。
  history: createWebHashHistory(),
  routes, // `routes: routes` 的缩写
})

export default router
