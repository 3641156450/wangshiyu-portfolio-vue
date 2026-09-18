/**
 * 渲染冒烟测试：在 Node 里把每个路由真实渲染一遍。
 *
 * 目的：抓出「模板引用了不存在的变量 / 组件 / 指令」这类编译期发现不了的运行时错误。
 * 做法：用 Vite 的 SSR 加载器现场编译 SFC，再用 @vue/server-renderer 渲染每个路由，
 * 同时监听 Vue 的告警（未解析的组件、指令会在这里冒出来）。
 *
 * 运行： node smoke/render.mjs
 * 这不是单元测试，也不打包进发布产物。
 */
import path from 'node:path'
import { createRequire } from 'node:module'
import { fileURLToPath } from 'node:url'
import { createServer } from 'vite'

const here = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(here, '..')
const require = createRequire(import.meta.url)

const ROUTES = [
  '/',
  '/about',
  '/projects',
  '/projects/bilingual-cuisine',
  '/projects/id-photo-tool',
  '/projects/mygo-fnaf-game',
  '/projects/not-a-real-slug',
  '/tool',
  '/resume',
  '/contact',
  '/admin',
  '/totally-missing',
]

/** 每个路由至少要出现的关键内容，用来确认「页面渲染出来了」而不只是「没报错」 */
const EXPECT = {
  '/': ['王诗宇', 'term-bar', 'skills-grid', 'cta-band', '查看作品集'],
  '/about': ['avatar-wrap', 'cert-card', '山东海事职业学院'],
  '/projects': ['filter-bar', 'proj-card', 'id-photo-tool'],
  '/projects/bilingual-cuisine': ['detail-side-card', 'chuancai', '英语学习双语对照静态网页'],
  '/projects/id-photo-tool': ['detail-side-card', 'layoutSheet', 'coverScale'],
  '/projects/mygo-fnaf-game': ['在线演示', '下载作品包', 'Pygame'],
  '/projects/not-a-real-slug': ['没有找到这个项目'],
  '/tool': ['spec-btn', 'tool-num', 'upload-box', '5 寸画布排版'],
  '/resume': ['resume-side', 'doc-block', ' Vue 3 '],
  '/contact': ['form-card', 'board-list', '给我留言'],
  '/admin': ['管理员登录', '管理口令'],
  '/totally-missing': ['页面走丢了'],
}

const warnings = []
const errors = []
const realWarn = console.warn
const realError = console.error
console.warn = (...a) => warnings.push(a.join(' '))
console.error = (...a) => errors.push(a.join(' '))

let failed = 0

try {
  const vite = await createServer({
    root: ROOT,
    logLevel: 'error',
    server: { middlewareMode: true, watch: null },
    appType: 'custom',
  })

  const { build } = await vite.ssrLoadModule('/smoke/entry.js')
  const { renderToString } = require('@vue/server-renderer')

  for (const route of ROUTES) {
    // 每个路由都用全新的 app + pinia 实例，避免 SSRContext 复用产生干扰告警
    const { app, router } = build()
    await router.push(route)
    await router.isReady()

    const mark = warnings.length + errors.length
    let html = ''
    try {
      html = await renderToString(app)
    } catch (e) {
      errors.push(`[${route}] 渲染失败：${e.message}`)
    }
    const issues = warnings.length + errors.length - mark
    const missing = (EXPECT[route] || []).filter((kw) => !html.includes(kw))
    const ok = html.length > 800 && issues === 0 && missing.length === 0
    if (!ok) failed += 1
    realWarn(
      `${ok ? 'PASS' : 'FAIL'}  ${route.padEnd(34)} html=${String(html.length).padStart(6)}B  ` +
        `新问题=${issues}  缺失内容=${missing.length ? missing.join('|') : '无'}`,
    )
  }

  await vite.close()
} catch (e) {
  failed += 1
  realError('测试脚本自身出错：', e)
}

console.warn = realWarn
console.error = realError

if (warnings.length) {
  realWarn('\n--- Vue 告警 ---')
  for (const w of [...new Set(warnings)]) realWarn('  * ' + w)
}
if (errors.length) {
  realWarn('\n--- 错误 ---')
  for (const e of [...new Set(errors)]) realWarn('  * ' + e)
}
realWarn(`\n结果：${failed === 0 ? '全部通过' : failed + ' 个路由未通过'}`)
process.exit(failed === 0 ? 0 : 1)
