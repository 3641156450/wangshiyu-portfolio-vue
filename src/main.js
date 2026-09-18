import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import { registerMotionDirectives } from './directives/motion'

import './styles/tokens.css'
import './styles/main.css'
import './styles/app.css'

const app = createApp(App)

app.use(createPinia())
app.use(router)
registerMotionDirectives(app)

app.mount('#app')
