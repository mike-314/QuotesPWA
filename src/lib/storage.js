import { getUserId } from './auth.js'

export const LS_KEYS = {
  lastQuote: 'lastQuote',
};

const parseOr = (raw, fallback) => {
  try {
    const v = JSON.parse(raw);
    return v ?? fallback;
  } catch {
    return fallback;
  }
};

export function saveLastQuote(q) {
  localStorage.setItem(LS_KEYS.lastQuote, JSON.stringify(q));
}
export function loadLastQuote() {
  return parseOr(localStorage.getItem(LS_KEYS.lastQuote), null);
}

function favKey(uid) {
  return `favorites:${uid}`;
}
export function loadFavorites(uid = getUserId()) {
  if (!uid) return [];
  const v = parseOr(localStorage.getItem(favKey(uid)), []);
  return Array.isArray(v) ? v : [];
}
export function saveFavorites(list, uid = getUserId()) {
  if (!uid) return;
  localStorage.setItem(favKey(uid), JSON.stringify(list ?? []));
}
export function addFavorite(q, uid = getUserId()) {
  if (!uid || !q) return loadFavorites(uid);
  const list = loadFavorites(uid);
  if (!list.find(it => it.id === q.id)) {
    list.unshift({ id: q.id, quote: q.quote, author: q.author });
    saveFavorites(list, uid);
  }
  return list;
}
export function removeFavorite(id, uid = getUserId()) {
  if (!uid) return [];
  const list = loadFavorites(uid).filter(it => it.id !== id);
  saveFavorites(list, uid);
  return list;
}
export function isFavorite(id, uid = getUserId()) {
  if (!uid) return false;
  return loadFavorites(uid).some(it => it.id === id);
}
