<script setup>
/**
 * 作品集列表。
 *
 * 原来的筛选是靠 JS 遍历卡片、改 style.display。
 * 现在 filter 只是 store 里的一个状态，filtered 是派生値，
 * Vue 负责把差异渲染出来，不需要人肉操作 DOM。
 */
import ProjectCard from '@/components/ProjectCard.vue'
import { useProjectsStore } from '@/stores/projects'
import { projectFilters } from '@/data/projects'

const store = useProjectsStore()
</script>

<template>
  <div class="page">
    <div class="page-hero">
      <div class="container">
        <div class="crumb">PROJECTS</div>
        <h1>作品集</h1>
        <p>3 个代表作品，覆盖网页开发、自动化脚本与图像处理工具，点击卡片查看详情。</p>
      </div>
    </div>

    <div class="section">
      <div class="container">
        <div class="filter-bar" role="tablist" aria-label="作品分类筛选">
          <button
            v-for="f in projectFilters"
            :key="f.key"
            class="filter-btn"
            :class="{ active: store.activeFilter === f.key }"
            type="button"
            @click="store.setFilter(f.key)"
          >
            {{ f.label }}
          </button>
        </div>

        <div class="projects-grid">
          <ProjectCard v-for="p in store.filtered" :key="p.id" :project="p" />
        </div>

        <p v-if="!store.filtered.length" class="board-empty">这个分类下还没有作品。</p>
      </div>
    </div>
  </div>
</template>
