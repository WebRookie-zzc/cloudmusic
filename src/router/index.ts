import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'

const routes: Array<RouteRecordRaw> = [
  {
    path: ``,
    redirect: `/search`
  },
  {
    path:"/home",
    component: () => import(`../views/content/Home.vue`),
    children: [
      {
        path: ``,
        redirect: `/home/recommend`,
      },
      {
        path: `recommend`,
        component: () => import(`../views/content/Home/Recommend.vue`)
      },
      {
        path: `exclusive`,
        component: () => import(`../views/content/Home/Exclusive.vue`)
      },
      {
        path: `singers`,
        component: () => import(`../views/content/Home/Artist.vue`)
      },
    ]
  },
  {
    path: `/podcast`,
    component: () => import(`../views/content/Boo.vue`)
  },
  {
    path: `/streaming`,
    component: () => import(`../views/content/Streaming.vue`)
  },
  {
    path: `/audio`,
    component: () => import(`../views/content/Audio.vue`)
  },
  {
    path: `/search`,
    component: () => import(`@/views/content/SongMv.vue`)
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
  linkActiveClass: `active`
})

export default router
