/**
 * 留言板：云端 REST 适配器。
 *
 * 配置了 VITE_GUESTBOOK_API 环境变量后自动启用，
 * 对接 server/index.js（或与之一致的任意后端）。
 *
 * 接口契约：
 *   GET    /api/messages            -> Message[]
 *   POST   /api/messages            -> Message
 *   DELETE /api/messages/:id        -> { ok: true }
 *   POST   /api/admin/login         -> { token, expiresAt }
 */
const BASE = import.meta.env.VITE_GUESTBOOK_API || ''

function buildHeaders(token) {
  const headers = { 'Content-Type': 'application/json' }
  if (token) headers.Authorization = `Bearer ${token}`
  return headers
}

async function request(path, options = {}, token = '') {
  const res = await fetch(`${BASE}${path}`, {
    headers: buildHeaders(token),
    ...options,
  })
  if (!res.ok) {
    const detail = await res.text().catch(() => '')
    throw new Error(`请求失败(${res.status}) ${detail}`)
  }
  return res.status === 204 ? null : res.json()
}

export const httpRepository = {
  mode: 'cloud',

  list() {
    return request('/api/messages')
  },

  create(payload, token) {
    return request(
      '/api/messages',
      { method: 'POST', body: JSON.stringify(payload) },
      token,
    )
  },

  remove(id, token) {
    return request(`/api/messages/${encodeURIComponent(id)}`, { method: 'DELETE' }, token)
  },

  clear(token) {
    return request('/api/messages', { method: 'DELETE' }, token)
  },

  login(password) {
    return request('/api/admin/login', {
      method: 'POST',
      body: JSON.stringify({ password }),
    })
  },

  async logout() {
    return true
  },

  savedName() {
    if (typeof localStorage === 'undefined') return ''
    return localStorage.getItem('wsy_guestbook_name') || ''
  },
}
