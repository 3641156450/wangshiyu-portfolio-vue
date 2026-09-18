/**
 * 留言板后端（可选）。
 *
 * 前端默认跑在纯静态环境下（GitHub Pages），留言存 localStorage。
 * 想升级成真正的「云端持久化」，把这个服务起起来，
 * 再给前端配上 VITE_GUESTBOOK_API=http://localhost:3000 即可，业务代码零改动。
 *
 * 启动：  node server/index.js
 * 依赖：  Node 18+（内置 http 模块，无需 npm install）
 *
 * 接口：
 *   GET    /api/messages        留言列表
 *   POST   /api/messages        发布留言  { name, text, replyTo }
 *   DELETE /api/messages        清空全部（需口令）
 *   DELETE /api/messages/:id    删除单条（需口令）
 *   POST   /api/admin/login     { password } -> { token, expiresAt }
 */
import { createServer } from 'node:http'
import { randomUUID } from 'node:crypto'
import { readFile, writeFile, mkdir } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const DATA_FILE = join(__dirname, 'data', 'messages.json')

const PORT = process.env.PORT || 3000
const PASSWORD = process.env.ADMIN_PASSWORD || 'wsy2026'
const ADMIN_PASSWORD = PASSWORD

/** 令牌有效期 2 小时 */
const TOKEN_TTL = 2 * 60 * 60 * 1000
const tokens = new Set()

let messages = []

/** 简易节流：同一 IP 每分钟最多 10 条，防止被灌水 */
const rate = new Map()
const RATE_LIMIT = 10
const RATE_WINDOW = 60 * 1000

function hit(ip) {
  const now = Date.now()
  const list = (rate.get(ip) || []).filter((t) => now - t < RATE_WINDOW)
  list.push(now)
  rate.set(ip, list)
  return list.length <= RATE_LIMIT
}

async function load() {
  try {
    messages = JSON.parse(await readFile(DATA_FILE, 'utf-8'))
  } catch {
    messages = []
  }
}

async function persist() {
  await mkdir(dirname(DATA_FILE), { recursive: true })
  await writeFile(DATA_FILE, JSON.stringify(messages, null, 2), 'utf-8')
}

function json(res, status, body) {
  const payload = JSON.stringify(body)
  res.writeHead(status, {
    'Content-Type': 'application/json;charset=utf-8',
    'Content-Length': Buffer.byteLength(payload),
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type,Authorization',
    'Access-Control-Allow-Methods': 'GET,POST,DELETE,OPTIONS',
  })
  res.end(payload)
}

function readBody(req) {
  return new Promise((resolve) => {
    let raw = ''
    req.on('data', (c) => {
      raw += c
      // 超过 32KB 直接丢弃，避免被大 body 打爆
      if (raw.length > 32 * 1024) req.destroy()
    })
    req.on('end', () => {
      try {
        resolve(raw ? JSON.parse(raw) : {})
      } catch {
        resolve({})
      }
    })
  })
}

function authorized(req) {
  const header = req.headers.authorization || ''
  const token = header.replace(/^Bearer\s+/i, '')
  return tokens.has(token)
}

function formatTime(d) {
  const p = (n) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())} ${p(d.getHours())}:${p(d.getMinutes())}`
}

const server = createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`)
  const { pathname } = url

  // CORS 预检
  if (req.method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Content-Type,Authorization',
      'Access-Control-Allow-Methods': 'GET,POST,DELETE,OPTIONS',
    })
    return res.end()
  }

  const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'unknown'

  try {
    // —— 管理员登录 ——
    if (pathname === '/api/admin/login' && req.method === 'POST') {
      const { password } = await readBody(req)
      if (password !== ADMIN_PASSWORD) return json(res, 401, { error: '口令不正确' })
      const token = randomUUID()
      tokens.add(token)
      setTimeout(() => tokens.delete(token), TOKEN_TTL)
      return json(res, 200, { token, expiresAt: Date.now() + TOKEN_TTL })
    }

    // —— 留言列表 ——
    if (pathname === '/api/messages' && req.method === 'GET') {
      return json(res, 200, messages)
    }

    // —— 发布留言 ——
    if (pathname === '/api/messages' && req.method === 'POST') {
      if (!hit(ip)) return json(res, 429, { error: '留言过于频繁，请稍后再试' })
      const body = await readBody(req)
      const name = String(body.name || '').trim().slice(0, 20) || '匿名'
      const text = String(body.text || '').trim().slice(0, 500)
      if (!text) return json(res, 400, { error: '留言内容不能为空' })
      const item = {
        id: randomUUID(),
        name,
        text,
        replyTo: body.replyTo ? String(body.replyTo).slice(0, 20) : null,
        time: formatTime(new Date()),
      }
      messages.unshift(item)
      await persist()
      return json(res, 201, item)
    }

    // —— 清空全部 ——
    if (pathname === '/api/messages' && req.method === 'DELETE') {
      if (!authorized(req)) return json(res, 401, { error: '未授权' })
      messages = []
      await persist()
      return json(res, 200, { ok: true })
    }

    // —— 删除单条 ——
    const del = pathname.match(/^\/api\/messages\/([\w-]+)$/)
    if (del && req.method === 'DELETE') {
      if (!authorized(req)) return json(res, 401, { error: '未授权' })
      messages = messages.filter((m) => m.id !== del[1])
      await persist()
      return json(res, 200, { ok: true })
    }

    return json(res, 404, { error: 'Not Found' })
  } catch (e) {
    return json(res, 500, { error: e.message || '服务器内部错误' })
  }
})

await load()
server.listen(PORT, () => {
  console.log(`留言板服务已启动: http://localhost:${PORT}`)
  console.log(`管理口令: ${ADMIN_PASSWORD}`)
})
