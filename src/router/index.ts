import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'

const routes: Array<RouteRecordRaw> = [
  {
    path: ``,
    redirect: `/home`
  },
  {
    path:"/home",
    component: () => import(`../views/content/Home.vue`),
    children: [
      {
        path: ``,
        redirect: `/home/exclusive`,
      },
      {
        path: `recommend`,
        component: () => import(`../views/content/Home/Recommend.vue`)
      },
      {
        path: `exclusive`,
        component: () => import(`../views/content/Home/Exclusive.vue`)
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
  linkActiveClass: `active`
})

export default router
