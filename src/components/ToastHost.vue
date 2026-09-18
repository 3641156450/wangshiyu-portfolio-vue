<script setup>
/**
 * Toast 渲染宿主。
 *
 * 迁移前是每处都自己 createElement + appendChild 到 #toastWrap；
 * 现在只由这一个组件订阅 useToast 的队列并渲染，调用方完全解耦。
 */
import { useToast } from '@/composables/useToast'
import AppIcon from './AppIcon.vue'

const { items } = useToast()
</script>

<template>
  <div class="toast-wrap" aria-live="polite" aria-atomic="false">
    <TransitionGroup name="v-fade">
      <div v-for="t in items" :key="t.id" class="toast" :class="{ show: t.visible }">
        <AppIcon name="check" :size="16" />
        <span>{{ t.message }}</span>
      </div>
    </TransitionGroup>
  </div>
</template>
