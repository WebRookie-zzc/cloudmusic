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
<<<<<<< HEAD
<<<<<<< HEAD
        redirect: `/home/recommend`,
=======
        redirect: `/home/exclusive`,
>>>>>>> 3fac76e (2022.2.12)
=======
        redirect: `/home/recommend`,
>>>>>>> 9f1452e (2022.2.14)
      },
      {
        path: `recommend`,
        component: () => import(`../views/content/Home/Recommend.vue`)
      },
      {
        path: `exclusive`,
        component: () => import(`../views/content/Home/Exclusive.vue`)
<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> 9f1452e (2022.2.14)
      },
      {
        path: `singers`,
        component: () => import(`../views/content/Home/Artist.vue`)
<<<<<<< HEAD
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
=======
=======
>>>>>>> 9f1452e (2022.2.14)
      }
    ]
>>>>>>> 3fac76e (2022.2.12)
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
  linkActiveClass: `active`
})

export default router
