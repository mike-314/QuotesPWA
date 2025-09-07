<template>
  <div class="card shadow-sm">
    <div class="card-body">
      <h2 class="h5 mb-3">Losowy cytat</h2>

      <div v-if="loading" class="text-muted">Ładowanie…</div>
      <div v-else-if="error" class="alert alert-warning py-2">
        {{ error }}
      </div>

      <blockquote v-else class="blockquote mb-0">
        <p class="mb-2">“{{ quote?.quote }}”</p>
        <footer class="blockquote-footer">
          <cite>{{ quote?.author }}</cite>
        </footer>
      </blockquote>

      <div class="mt-3 d-flex flex-wrap gap-2">
        <button class="btn btn-primary" @click="fetchQuote">Losuj cytat</button>

        <button class="btn btn-outline-secondary" @click="useOffline" title="Pokaż ostatnio zapisany cytat">
          Ostatni zapisany
        </button>

        <button
          v-if="loggedIn"
          class="btn btn-outline-success"
          :disabled="!quote || alreadyFavorite"
          @click="addToFav"
          title="Zapisz ten cytat do Ulubionych"
        >
          {{ alreadyFavorite ? 'Już w ulubionych' : 'Dodaj do ulubionych' }}
        </button>

        <router-link v-else class="btn btn-outline-success" :to="{ name: 'login', query: { redirect: '/quotes' } }">
          Zaloguj się, aby dodać
        </router-link>
      </div>

      <small class="text-muted d-block mt-2">
        Działa offline: ostatni wynik i ulubione trzymamy w localStorage.
      </small>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { saveLastQuote, loadLastQuote, addFavorite, isFavorite } from '../lib/storage.js'
import { isLoggedIn } from '../lib/auth.js'

const loading = ref(false)
const error = ref('')
const quote = ref(null)
const favTick = ref(0)
const loggedIn = ref(isLoggedIn())

function onAuthChanged() {
  loggedIn.value = isLoggedIn()
  favTick.value++ // przelicz "alreadyFavorite"
}

onMounted(() => {
  window.addEventListener('auth-changed', onAuthChanged)
})
onBeforeUnmount(() => {
  window.removeEventListener('auth-changed', onAuthChanged)
})

async function fetchQuote() {
  loading.value = true
  error.value = ''
  try {
    const res = await fetch('https://dummyjson.com/quotes/random')
    if (!res.ok) throw new Error('Błąd sieci')
    const data = await res.json()
    quote.value = data
    saveLastQuote(data)
  } catch (e) {
    error.value = 'Brak internetu lub błąd API. Użyj przycisku „Ostatni zapisany”.'
  } finally {
    loading.value = false
  }
}

function useOffline() {
  const cached = loadLastQuote()
  if (cached) {
    quote.value = cached
    error.value = ''
  } else {
    error.value = 'Brak zapisanego cytatu w pamięci.'
  }
}

function addToFav() {
  if (!quote.value) return
  addFavorite(quote.value)
  favTick.value++
}

const alreadyFavorite = computed(() => {
  void favTick.value
  return quote.value ? isFavorite(quote.value.id) : false
})

// na start: pokaż z cache, a jak brak — pobierz
const cached = loadLastQuote()
if (cached) quote.value = cached
else fetchQuote()
</script>
