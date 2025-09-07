<template>
  <div>
    <h1 class="h4 mb-3">Ulubione cytaty</h1>

    <div class="mb-3">
      <input
        v-model="query"
        type="text"
        class="form-control"
        placeholder="Filtruj po treści lub autorze…"
      />
      <small class="text-muted d-block">
        Działa offline — filtr jest po stronie klienta.
      </small>
    </div>

    <div v-if="filtered.length === 0" class="alert alert-light border">
      Brak wyników. Spróbuj zmienić filtr lub
      <router-link to="/quotes">dodaj coś do ulubionych</router-link>.
    </div>

    <div class="row g-3" v-else>
      <div v-for="item in filtered" :key="item.id" class="col-12">
        <div class="card shadow-sm">
          <div class="card-body d-flex flex-column flex-md-row align-items-start gap-3">
            <div class="flex-grow-1">
              <blockquote class="blockquote mb-0">
                <p class="mb-2">“{{ item.quote }}”</p>
                <footer class="blockquote-footer"><cite>{{ item.author }}</cite></footer>
              </blockquote>
            </div>
            <div>
              <button class="btn btn-outline-danger" @click="remove(item.id)">
                Usuń
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { loadFavorites, removeFavorite } from '../lib/storage.js'

const list = ref(loadFavorites())
const query = ref('')

function remove(id) {
  const updated = removeFavorite(id)
  list.value = updated
}

const filtered = computed(() => {
  const q = query.value.trim().toLowerCase()
  if (!q) return list.value
  return list.value.filter(it =>
    it.quote.toLowerCase().includes(q) ||
    it.author.toLowerCase().includes(q)
  )
})
</script>
