// 冒烟测试入口（不参与发布）：用内存模式的路由构建一个可渲染的应用实例。
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createRouter, createMemoryHistory } from 'vue-router'
import App from '../src/App.vue'
import routes from '../src/router/routes'
import { registerMotionDirectives } from '../src/directives/motion'

export function build() {
  const app = createApp(App)
  const router = createRouter({ history: createMemoryHistory(), routes })
  app.use(createPinia())
  app.use(router)
  registerMotionDirectives(app)
  return { app, router }
}
