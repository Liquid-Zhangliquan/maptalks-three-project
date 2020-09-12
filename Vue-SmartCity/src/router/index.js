import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes =
    [
      {
        path: '/',
        name: 'shanghai',
        component: () => import('../views/Shanghai.vue')
      },
      {
        path: '/wuhan',
        name: 'wuhan',
        component: () => import('../views/Wuhan.vue')
      },
      {
        path: '/home',
        name: 'home',
        component: () => import('../views/Home.vue')
      }
    ]

    const router = new VueRouter({routes})

export default router
