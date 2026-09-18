<script setup>
/**
 * 技能卡片：进度条宽度由 v-bar 指令在滚动进入视口后再动画到目标值。
 * 这样可以避免首屏之外的进度条在用户看不见时就播完了。
 */
import AppIcon from './AppIcon.vue'

defineProps({
  skill: { type: Object, required: true },
})
</script>

<template>
  <div class="skill-card">
    <div class="ico" :class="skill.ico"><AppIcon :name="skill.ico" :size="22" /></div>
    <h3>{{ skill.title }}</h3>
    <p class="desc">{{ skill.desc }}</p>
    <template v-for="(bar, i) in skill.bars" :key="bar.name">
      <div class="bar-row" :style="{ marginTop: i === 0 ? '0' : '10px' }">
        <span>{{ bar.name }}</span><b>{{ bar.value }}%</b>
      </div>
      <div class="bar">
        <div class="bar-fill" v-bar="bar.value"></div>
      </div>
    </template>
  </div>
</template>
