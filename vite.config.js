import { fileURLToPath, URL } from 'node:url'
import { readFileSync, writeFileSync, existsSync } from 'node:fs'
import { resolve } from 'node:path'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

const r = (p) => fileURLToPath(new URL(p, import.meta.url))

/**
 * GitHub Pages 的子路径基准。
 * 默认值与仓库名保持一致；更换仓库名时通过环境变量 PAGES_BASE 覆盖即可。
 */
const BASE = process.env.PAGES_BASE || '/wangshiyu-portfolio-vue/'

/**
 * 自建插件：把打包产物 index.html 复制为 404.html。
 * GitHub Pages 在访问未命中静态资源的路径时会返回 404.html，
 * 借此实现 HTML5 History 模式下的前端路由深链（直接打开 /projects/p1 也能渲染）。
 */
function spa404Fallback() {
  return {
    name: 'spa-404-fallback',
    closeBundle() {
      const outDir = resolve(process.cwd(), 'dist')
      const indexFile = resolve(outDir, 'index.html')
      if (existsSync(indexFile)) {
        writeFileSync(resolve(outDir, '404.html'), readFileSync(indexFile, 'utf-8'), 'utf-8')
      }
    },
  }
}

export default defineConfig({
  base: BASE,
  plugins: [vue(), spa404Fallback()],
  resolve: {
    alias: { '@': r('./src') },
  },
  build: {
    // 依赖体积很小，直接内联告警阈值放宽
    chunkSizeWarningLimit: 900,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['vue', 'vue-router', 'pinia'],
        },
      },
    },
  },
})
