<script setup>
/**
 * 站点顶栏。
 *
 * 迁移要点：
 *  1. 原来的 href="#/xxx" 改成 <RouterLink>，浏览器前进后退天然可用；
 *  2. 移动端菜单的开合从 classList.toggle 改成受 language 控制的 navOpen 状态；
 *  3. 滚动阴影用 scrollY > 10 驱动 class，逻辑与原来一致但不再需要手动 querySelector。
 */
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import AppIcon from './AppIcon.vue'
import { useThemeStore } from '@/stores/theme'

const theme = useThemeStore()
const route = useRoute()

const navItems = [
  { to: '/', key: 'home', label: '首页' },
  { to: '/about', key: 'about', label: '关于我' },
  { to: '/projects', key: 'projects', label: '作品集' },
  { to: '/resume', key: 'resume', label: '简历' },
  { to: '/contact', key: 'contact', label: '联系我', cta: true },
]

const navOpen = ref(false)
const scrolled = ref(false)

function toggleNav() {
  navOpen.value = !navOpen.value
}
function closeNav() {
  navOpen.value = false
}

function onScroll() {
  scrolled.value = window.scrollY > 10
}

onMounted(() => {
  onScroll()
  window.addEventListener('scroll', onScroll, { passive: true })
})
onBeforeUnmount(() => window.removeEventListener('scroll', onScroll))

const ariaExpanded = computed(() => String(navOpen.value))
</script>

<template>
  <header class="site-header" :class="{ scrolled }">
    <div class="container header-inner">
      <RouterLink class="brand" to="/" aria-label="返回首页">
        <span class="brand-mark">W.</span>
        <span>王诗宇·作品集</span>
      </RouterLink>

      <nav class="main-nav" :class="{ open: navOpen }" aria-label="主导航">
        <RouterLink
          v-for="item in navItems"
          :key="item.key"
          :to="item.to"
          :class="{ 'nav-cta': item.cta }"
          @click="closeNav"
        >
          {{ item.label }}
        </RouterLink>
      </nav>

      <div class="header-actions">
        <button
          class="theme-toggle"
          type="button"
          :aria-label="theme.isDark ? '切换到浅色模式' : '切换到深色模式'"
          :title="theme.isDark ? '切换到浅色模式' : '切换到深色模式'"
          @click="theme.toggle()"
        >
          <AppIcon :name="theme.isDark ? 'sun' : 'moon'" />
        </button>

        <button
          class="nav-toggle"
          :class="{ open: navOpen }"
          type="button"
          :aria-expanded="ariaExpanded"
          :aria-label="navOpen ? '关闭菜单' : '打开菜单'"
          @click="toggleNav"
        >
          <span></span><span></span><span></span>
        </button>
      </div>
    </div>
  </header>
</template>

<style scoped>
.header-inner {
  gap: 10px;
}
.header-actions {
  display: flex;
  align-items: center;
}
/* 路由激活态：vue-router 自带的 router-link-active */
.main-nav a.router-link-active:not(.nav-cta) {
  color: #fff;
  background: rgba(232, 163, 61, 0.16);
  font-weight: 500;
}
</style>
