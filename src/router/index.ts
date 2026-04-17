import { createRouter, createWebHashHistory, type RouteRecordRaw } from 'vue-router'

import Index from '@/views/portal/Index.vue'
import CollectionView from '@/views/portal/CollectionView.vue'
import KeyValGenerator from '@/views/myself/KeyValGenerator.vue'
import ThanksLiVue from '@/views/myself/ThanksLi.vue'
import Fxkp from '@/views/myself/Fxkp.vue'
import NetWorkTop from '@/views/network/Top.vue'
import Pdf2Png from '@/views/myself/Pdf2Png.vue'
import Ciphertext from '@/views/myself/Ciphertext.vue'
import ImageTools from '@/views/image/Tools.vue'
import ImageBase64 from '@/views/image/Base64.vue'
import ImageCompress from '@/views/image/Compress.vue'
import TextTools from '@/views/text/Tools.vue'
import TextCompare from '@/views/text/Compare.vue'
import TextCase from '@/views/text/Case.vue'
import TextEncode from '@/views/text/Encode.vue'
import MySelfFood from '@/views/myself/Food.vue'
import HackToolsClassic from '@/views/hack/Tools.vue'
import DevelopToolsClassic from '@/views/develop/Tools.vue'
import AIToolsClassic from '@/views/ai/Tools.vue'
import AITools2Classic from '@/views/ai/Tools2.vue'
import MySelfToolsClassic from '@/views/myself/Tools.vue'
import MaybeToolsClassic from '@/views/maybe/Tools.vue'
import Windows from '@/views/windows/Tools.vue'

const routes: RouteRecordRaw[] = [
  { path: '/', component: Index, name: 'index' },
  { path: '/KeyValGenerator', component: KeyValGenerator, name: 'KeyValGenerator' },
  { path: '/thanks', component: ThanksLiVue, name: 'thanks' },
  { path: '/network', component: NetWorkTop, name: 'network' },
  { path: '/fxkp', component: Fxkp, name: 'fxkp' },
  { path: '/pdf2png', component: Pdf2Png, name: 'pdf2png' },
  { path: '/ciphertext', component: Ciphertext, name: 'ciphertext' },
  { path: '/image-tools', component: ImageTools, name: 'imageTools' },
  { path: '/image-base64', component: ImageBase64, name: 'imageBase64' },
  { path: '/image-compress', component: ImageCompress, name: 'imageCompress' },
  { path: '/text-tools', component: TextTools, name: 'textTools' },
  { path: '/text-compare', component: TextCompare, name: 'textCompare' },
  { path: '/text-case', component: TextCase, name: 'textCase' },
  { path: '/text-encode', component: TextEncode, name: 'textEncode' },
  { path: '/hack-tools', component: CollectionView, name: 'hackTools', meta: { collectionId: 'hack-tools' } },
  { path: '/develop-tools', component: CollectionView, name: 'developTools', meta: { collectionId: 'develop-tools' } },
  { path: '/ai-tools', component: CollectionView, name: 'AITools', meta: { collectionId: 'ai-tools' } },
  { path: '/ai-tools2', component: CollectionView, name: 'AITools2', meta: { collectionId: 'ai-tools2' } },
  { path: '/myself-tools', component: CollectionView, name: 'MySelf', meta: { collectionId: 'myself-tools' } },
  { path: '/myself-food', component: MySelfFood, name: 'MySelfFood' },
  { path: '/maybe-tools', component: CollectionView, name: 'Maybe', meta: { collectionId: 'maybe-tools' } },
  { path: '/hack-tools-classic', component: HackToolsClassic, name: 'HackToolsClassic' },
  { path: '/develop-tools-classic', component: DevelopToolsClassic, name: 'DevelopToolsClassic' },
  { path: '/ai-tools-classic', component: AIToolsClassic, name: 'AIToolsClassic' },
  { path: '/ai-tools2-classic', component: AITools2Classic, name: 'AITools2Classic' },
  { path: '/myself-tools-classic', component: MySelfToolsClassic, name: 'MySelfToolsClassic' },
  { path: '/maybe-tools-classic', component: MaybeToolsClassic, name: 'MaybeToolsClassic' },
  { path: '/windows', component: Windows, name: 'Windows' },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
})

export default router
