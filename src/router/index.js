/**
 * 路由实例。
 *
 * 与原版最大的不同：原来用 #/home 这类 hash 手动切 div 显隐，
 * 现在交给 vue-router，除了天然支持前进/后退/分享链接，
 * 还能用动态路由 /projects/:key 做真正的详情页。
 *
 * 路由表单独放在 routes.js，便于被渲染冒烟测试等场景单独引用。
 */
import { createRouter, createWebHistory } from 'vue-router'
import routes from './routes'

const router = createRouter({
  // BASE_URL 由 vite.config.js 的 base 决定，GitHub Pages 子路径部署时才不会错位
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  // 切换路由后回到顶部（原版是在 renderRoute 里手动 scrollTo）
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) return savedPosition
    return { top: 0 }
  },
})

router.afterEach((to) => {
  const base = '王诗宇 · 作品集'
  document.title = to.meta?.title ? `${to.meta.title} | ${base}` : base
})

export default router
