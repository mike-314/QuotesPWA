import { createRouter, createWebHistory } from 'vue-router'
import Home from './views/Home.vue'
import Quotes from './views/Quotes.vue'
import Favorites from './views/Favorites.vue'
import Login from './views/Login.vue'
import { isLoggedIn } from './lib/auth.js'

const routes = [
  { path: '/', name: 'home', component: Home },
  { path: '/quotes', name: 'quotes', component: Quotes },
  { path: '/favorites', name: 'favorites', component: Favorites, meta: { requiresAuth: true } },
  { path: '/login', name: 'login', component: Login }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  linkActiveClass: 'active',
  linkExactActiveClass: 'active'
})

router.beforeEach((to) => {
  if (to.meta?.requiresAuth && !isLoggedIn()) {
    return { name: 'login', query: { redirect: to.fullPath } }
  }
  return true
})

export default router
