<template>
  <div>
    <nav class="navbar navbar-dark bg-primary">
      <div class="container d-flex justify-content-between align-items-center">
        <a class="navbar-brand m-0" href="#">Quotes PWA</a>

        <div class="d-flex align-items-center gap-4">
          <router-link class="nav-link text-white px-3 py-2" to="/" :class="{ active: $route.path === '/' }">
            Home
          </router-link>

          <router-link class="nav-link text-white px-3 py-2" to="/quotes" :class="{ active: $route.path.startsWith('/quotes') }">
            Quotes
          </router-link>

          <router-link v-if="loggedIn" class="nav-link text-white px-3 py-2"
                       to="/favorites" :class="{ active: $route.path.startsWith('/favorites') }">
            Favorites
          </router-link>

          <router-link v-else class="btn btn-outline-light btn-sm" :to="{ name: 'login', query: { redirect: '/favorites' } }">
            Zaloguj
          </router-link>

          <div v-if="loggedIn" class="d-flex align-items-center gap-2">
            <span class="text-white-50 small">Zalogowano jako</span>
            <span class="badge bg-light text-dark">{{ user?.username }}</span>
            <button class="btn btn-light btn-sm" @click="doLogout">Wyloguj</button>
          </div>
        </div>
      </div>
    </nav>

    <main class="container py-4">
      <router-view />
    </main>

    <footer class="text-center text-muted py-3">
      <small>Offline ready • Vue + Vite + PWA</small>
    </footer>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { getCurrentUser, isLoggedIn, logout } from './lib/auth.js'

const router = useRouter()
const route = useRoute()

const user = ref(getCurrentUser())
const loggedIn = ref(isLoggedIn())

function onAuthChanged() {
  user.value = getCurrentUser()
  loggedIn.value = isLoggedIn()
}

onMounted(() => {
  window.addEventListener('auth-changed', onAuthChanged)
})
onBeforeUnmount(() => {
  window.removeEventListener('auth-changed', onAuthChanged)
})

function doLogout() {
  logout()
  if (route.path.startsWith('/favorites')) router.replace('/')
}
</script>

<style>
.navbar .nav-link.active {
  font-weight: 600;
  background-color: rgba(255,255,255,.15);
  border-radius: .5rem;
}
</style>
