/**
 * 作品 store：卡片列表 + 详情页 + 筛选。
 *
 * 原来这块逻辑散落在「作品页 DOM 操作」和「弹层里的 PROJ 对象」两处，
 * 现在收敛为一个 store：随笔来源统一，新增作品只要往 data/projects.js 里加一条。
 */
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { projects, findProject } from '@/data/projects'

export const useProjectsStore = defineStore('projects', () => {
  const list = ref(projects)
  const activeFilter = ref('all')

  const filtered = computed(() =>
    activeFilter.value === 'all'
      ? list.value
      : list.value.filter((p) => p.category === activeFilter.value),
  )

  function setFilter(key) {
    activeFilter.value = key
  }

  /** 详情页用：支持用 id（p1）或 slug（bilingual-cuisine）两种形式访问 */
  function byId(key) {
    return findProject(key)
  }

  /** 详情页底部「上一个 / 下一个」 */
  function neighbours(id) {
    const i = list.value.findIndex((p) => p.id === id)
    if (i === -1) return { prev: null, next: null }
    return {
      prev: i > 0 ? list.value[i - 1] : null,
      next: i < list.value.length - 1 ? list.value[i + 1] : null,
    }
  }

  return { list, activeFilter, filtered, setFilter, byId, neighbours }
})
