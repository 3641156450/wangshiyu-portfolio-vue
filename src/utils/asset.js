/**
 * 静态资源路径工具。
 *
 * 站点部署在 GitHub Pages 子路径下（如 /wangshiyu-portfolio-vue/），
 * 如果直接写 "assets/x.jpg"，在 /projects/p1 这类深层路由下会被解析成
 * /wangshiyu-portfolio-vue/projects/assets/x.jpg 而 404。
 * 统一走 BASE_URL 前缀可以避免这类路径偏移。
 */
const BASE = import.meta.env.BASE_URL || '/'

export function asset(path) {
  return `${BASE}${String(path).replace(/^\/+/, '')}`
}

/** 是否是外链地址 */
export function isExternal(url = '') {
  return /^https?:\/\//.test(url)
}

/** 打开外链，避免 opener 安全隐患 */
export function openExternal(url) {
  window.open(url, '_blank', 'noopener,noreferrer')
}
