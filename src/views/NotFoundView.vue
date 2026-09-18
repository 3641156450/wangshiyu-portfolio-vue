<script setup>
/** 404：兜底路由，避免访客直接访问不存在地址时白屏。 */
import { RouterLink } from 'vue-router'
</script>

<template>
  <div class="page">
    <div class="page-hero">
      <div class="container">
        <div class="crumb">404</div>
        <h1>页面走丢了</h1>
        <p>这个地址下没有内容，也许是被我重构掉了。</p>
        <div style="margin-top: 22px; display: flex; gap: 12px; flex-wrap: wrap">
          <RouterLink class="btn btn-primary" to="/">回到首页</RouterLink>
          <RouterLink class="btn btn-ghost" to="/projects">看看作品集</RouterLink>
        </div>
      </div>
    </div>
  </div>
</template>
