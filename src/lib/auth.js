export const AUTH_KEYS = {
  user: 'auth:user',
  accessToken: 'auth:accessToken',
  refreshToken: 'auth:refreshToken',
  expiresAt: 'auth:expiresAt',
};

export function getCurrentUser() {
  try { return JSON.parse(localStorage.getItem(AUTH_KEYS.user)) || null; }
  catch { return null; }
}
export function getUserId() {
  const u = getCurrentUser();
  return u?.id ?? null;
}
export function isLoggedIn() {
  return !!getCurrentUser();
}
export function logout() {
  localStorage.removeItem(AUTH_KEYS.user);
  localStorage.removeItem(AUTH_KEYS.accessToken);
  localStorage.removeItem(AUTH_KEYS.refreshToken);
  localStorage.removeItem(AUTH_KEYS.expiresAt);
  window.dispatchEvent(new CustomEvent('auth-changed'));
}

export async function login({ username, password, expiresInMins = 60 } = {}) {
  const res = await fetch('https://dummyjson.com/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password, expiresInMins })
  });
  if (!res.ok) {
    let msg = 'Nieprawidłowy login lub hasło';
    try {
      const err = await res.json();
      if (err?.message) msg = err.message;
    } catch {}
    throw new Error(msg);
  }
  const data = await res.json();

  const user = {
    id: data.id,
    username: data.username,
    firstName: data.firstName,
    lastName: data.lastName,
    image: data.image
  };
  localStorage.setItem(AUTH_KEYS.user, JSON.stringify(user));
  if (data.accessToken) localStorage.setItem(AUTH_KEYS.accessToken, data.accessToken);
  if (data.refreshToken) localStorage.setItem(AUTH_KEYS.refreshToken, data.refreshToken);
  if (expiresInMins) {
    const exp = Date.now() + expiresInMins * 60 * 1000;
    localStorage.setItem(AUTH_KEYS.expiresAt, String(exp));
  }

  window.dispatchEvent(new CustomEvent('auth-changed'));
  return user;
}
