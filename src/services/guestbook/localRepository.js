/**
 * 留言板：本地存储适配器。
 *
 * 运行在没有服务端的环境（GitHub Pages）时使用，
 * 数据保存在浏览器 localStorage，开箱即用、零成本。
 * 接口与 httpRepository 完全一致，切换时对上层无感知。
 */
const KEY_ITEMS = 'wsy_guestbook_v1'
const KEY_NAME = 'wsy_guestbook_name'

const newId = () =>
  `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`

function safeParse(raw, fallback) {
  if (!raw) return fallback
  try {
    const val = JSON.parse(raw)
    return Array.isArray(val) ? val : fallback
  } catch {
    return fallback
  }
}

/** 旧版本没有 id 字段，补一个，避免删除/回复定位不到 */
function normalize(list) {
  return list.map((it) => ({
    id: it.id || newId(),
    name: it.name || '匿名',
    text: it.text || '',
    replyTo: it.replyTo || null,
    time: it.time || '',
  }))
}

function read() {
  if (typeof localStorage === 'undefined') return []
  return safeParse(localStorage.getItem(KEY_ITEMS), [])
}

function write(list) {
  if (typeof localStorage === 'undefined') return
  try {
    localStorage.setItem(KEY_ITEMS, JSON.stringify(list))
  } catch {
    // 隐私模式 / 容量不足时静默降级，不阻塞交互
  }
}

/** 模拟一点网络延迟，让 loading 态在本地也能被看到 */
const delay = (ms = 120) => new Promise((r) => setTimeout(r, ms))

export const localRepository = {
  mode: 'local',

  async list() {
    await delay()
    return normalize(read()).reverse()
  },

  async create({ name, text, replyTo }) {
    await delay()
    const item = {
      id: newId(),
      name: name.trim() || '匿名',
      text: text.trim(),
      replyTo: replyTo || null,
      time: formatTime(new Date()),
    }
    const next = [item, ...read()]
    write(next)
    if (typeof localStorage !== 'undefined') {
      try {
        localStorage.setItem(KEY_NAME, item.name)
      } catch {
        /* ignore */
      }
    }
    return item
  },

  async remove(id) {
    await delay(80)
    const next = read().filter((it) => (it.id || '') !== id)
    write(next)
    return true
  },

  async clear() {
    write([])
    return true
  },

  /** 本地模式下没有服务端鉴权，仅做演示用的口令校验 */
  async login(password) {
    await delay(200)
    const ok = Boolean(password) && password === import.meta.env.VITE_ADMIN_PASSWORD
    if (!ok) throw new Error('口令不正确')
    return { token: 'local-token', expiresAt: Date.now() + 30 * 60 * 1000 }
  },

  async logout() {
    return true
  },

  savedName() {
    if (typeof localStorage === 'undefined') return ''
    return localStorage.getItem(KEY_NAME) || ''
  },
}

export function formatTime(d) {
  const p = (n) => String(n).padStart(2, '0')
  return (
    `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())} ` +
    `${p(d.getHours())}:${p(d.getMinutes())}`
  )
}
