<script setup>
/**
 * 应用外壳：顶栏 + 路由视图 + 页脚 + 全局 Toast。
 * 原来 <main> 里六个 page 区块靠 class 切换显隐，现在只渲染当前路由对应的那一屏。
 */
import { ref, onMounted, onBeforeUnmount } from 'vue'
import SiteHeader from './components/SiteHeader.vue'
import SiteFooter from './components/SiteFooter.vue'
import ToastHost from './components/ToastHost.vue'
import AppIcon from './components/AppIcon.vue'

const showTop = ref(false)

function onScroll() {
  showTop.value = window.scrollY > 500
}
function backToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

onMounted(() => {
  onScroll()
  window.addEventListener('scroll', onScroll, { passive: true })
})
onBeforeUnmount(() => window.removeEventListener('scroll', onScroll))
</script>

<template>
  <SiteHeader />

  <main>
    <RouterView v-slot="{ Component }">
      <Transition name="route-fade" mode="out-in">
        <component :is="Component" />
      </Transition>
    </RouterView>
  </main>

  <SiteFooter />

  <Transition name="v-fade">
    <button v-if="showTop" class="to-top" type="button" aria-label="回到顶部" @click="backToTop">
      <AppIcon name="arrow-up" :size="18" />
    </button>
  </Transition>

  <ToastHost />
</template>
