import { createRouter, createWebHashHistory } from 'vue-router'
import Index from '../pages/Index.vue'
import KeyValGenerator from '../pages/KeyValGenerator.vue'
import ThanksLiVue from '../pages/ThanksLi.vue'
import Safe from '../pages/Safe.vue'
import Fxkp from '../pages/Fxkp.vue'
import NetWorkTop from '../pages/NetWorkTop.vue'


const routes = [
    { path: '/', component: Index, name: "index" },
    { path: '/KeyValGenerator', component: KeyValGenerator, name: "KeyValGenerator" },
    { path: '/thanks', component: ThanksLiVue, name: "thanks" },
    { path: '/safe', component: Safe, name: "safe" },
    { path: '/network', component: NetWorkTop, name: "network" },
    { path: '/fxkp', component: Fxkp, name: "fxkp" },
]

const router = createRouter({
    // 4. 内部提供了 history 模式的实现。为了简单起见，我们在这里使用 hash 模式。
    history: createWebHashHistory(),
    routes, // `routes: routes` 的缩写
})


export { router }


