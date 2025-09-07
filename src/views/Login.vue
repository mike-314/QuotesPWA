““<template>
  <div class="row justify-content-center">
    <div class="col-12 col-md-6 col-lg-5">
      <div class="card shadow-sm">
        <div class="card-body">
          <h1 class="h4 mb-3">Logowanie</h1>

          <div v-if="error" class="alert alert-danger py-2">{{ error }}</div>

          <form @submit.prevent="onSubmit" class="d-grid gap-3">
            <div>
              <label class="form-label">Nazwa użytkownika</label>
              <input v-model.trim="username" class="form-control" autocomplete="username" required />
            </div>
            <div>
              <label class="form-label">Hasło</label>
              <input v-model.trim="password" type="password" class="form-control" autocomplete="current-password" required />

              <small class="form-text text-muted d-block mt-1">
                To demo DummyJSON – użyj jednego z wbudowanych kont, np.
                <code>emilys / emilyspass</code> albo <code>michaelw / michaelwpass</code>,
                lub dowolny z
                <a href="https://dummyjson.com/users" target="_blank" rel="noreferrer">listy użytkowników</a>.
                Dla każdego użytkownika „Ulubione” będą prywatne. No chyba, że wejdziemy sobie w dev tools'y
                <span class="ms-1" aria-hidden="true">&#58;&#41;</span>
              </small>
            </div>
            <button class="btn btn-primary" :disabled="loading">
              {{ loading ? 'Logowanie…' : 'Zaloguj' }}
            </button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { login } from '../lib/auth.js'

const router = useRouter()
const route = useRoute()

const username = ref('')
const password = ref('')
const loading = ref(false)
const error = ref('')

async function onSubmit() {
  loading.value = true
  error.value = ''
  try {
    await login({ username: username.value, password: password.value, expiresInMins: 60 })
    const redirect = route.query.redirect || '/favorites'
    router.replace(String(redirect))
  } catch (e) {
    error.value = e.message || 'Nie udało się zalogować.'
  } finally {
    loading.value = false
  }
}
</script>
