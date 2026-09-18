/**
 * 路由表。
 *
 * 单独抽出来是为了让「有哪些路由」这件事可以被单独引用 —— 比如渲染冒烟测试里
 * 用内存模式的路由把所有页面渲染一遍，而不需要真的跑浏览器。
 */
import HomeView from '@/views/HomeView.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView,
    meta: { title: '首页' },
  },
  {
    path: '/about',
    name: 'about',
    component: () => import('@/views/AboutView.vue'),
    meta: { title: '关于我' },
  },
  {
    path: '/projects',
    name: 'projects',
    component: () => import('@/views/ProjectsView.vue'),
    meta: { title: '作品集' },
  },
  {
    // 动态路由：支持 /projects/p1（id）与 /projects/bilingual-cuisine（slug）
    path: '/projects/:key',
    name: 'project-detail',
    component: () => import('@/views/ProjectDetailView.vue'),
    meta: { title: '项目详情' },
  },
  {
    path: '/tool',
    name: 'tool',
    component: () => import('@/views/ToolView.vue'),
    meta: { title: '证件照工具' },
  },
  {
    path: '/resume',
    name: 'resume',
    component: () => import('@/views/ResumeView.vue'),
    meta: { title: '简历' },
  },
  {
    path: '/contact',
    name: 'contact',
    component: () => import('@/views/ContactView.vue'),
    meta: { title: '联系我' },
  },
  {
    path: '/admin',
    name: 'admin',
    component: () => import('@/views/AdminView.vue'),
    meta: { title: '留言管理' },
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: () => import('@/views/NotFoundView.vue'),
    meta: { title: '页面不存在' },
  },
]

export default routes
