<script setup>
/** 页脚：导航与联系方式都由数据驱动，新增渠道只改一处。 */
import { RouterLink } from 'vue-router'
import { profile } from '@/data/profile'

const navLinks = [
  { to: '/', label: '首页' },
  { to: '/about', label: '关于我' },
  { to: '/projects', label: '作品集' },
  { to: '/resume', label: '简历' },
  { to: '/contact', label: '联系我' },
  { to: '/tool', label: '证件照工具' },
]
</script>

<template>
  <footer class="site-footer">
    <div class="container">
      <div class="footer-grid">
        <div>
          <div class="footer-brand">
            <span class="brand-mark">W.</span>王诗宇·作品集
          </div>
          <p class="footer-about">
            2026 届计算机应用技术应届生，求职网页设计 / 前端开发岗位。设计、开发、测试一肩挑，期待与您共事。
          </p>
        </div>
        <div>
          <h4>站内导航</h4>
          <nav class="footer-links">
            <RouterLink v-for="l in navLinks" :key="l.to" :to="l.to">{{ l.label }}</RouterLink>
          </nav>
        </div>
        <div>
          <h4>联系方式</h4>
          <nav class="footer-links">
            <a :href="`mailto:${profile.email}`">{{ profile.email }}</a>
            <a :href="`tel:${profile.phone}`">{{ profile.phone }}</a>
            <span>期望城市：{{ profile.city }}</span>
            <span>期望薪资：{{ profile.salary }}</span>
          </nav>
        </div>
      </div>
      <div class="footer-bottom">
        <span>© 2026 王诗宇 · 作品集网站</span>
        <span>Vue 3 + Vite 构建 · 本站信息来自个人简历</span>
      </div>
    </div>
  </footer>
</template>
