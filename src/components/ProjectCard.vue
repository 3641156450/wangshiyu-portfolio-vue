<script setup>
/**
 * 作品卡片。
 *
 * 原来靠 data-open / data-link 属性 + 全局事件委托决定点击行为，
 * 跳转规则散落在一段 IIFE 里，很难看出「点这张卡会发生什么」。
 * 现在每张卡自己根据内容决定去向：
 *  - 没有额外操作按钮时，整张卡就是一个 <RouterLink>，能中键新开、能被搜索引擎抓到
 *  - 卡片内部还有「下载游戏包」这类链接时，不能用 <a> 套 <a>，改用 article + 键盘可达的点击
 */
import { computed } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { asset } from '@/utils/asset'

const props = defineProps({
  project: { type: Object, required: true },
})

const router = useRouter()
const hasActions = computed(
  () => props.project.kind === 'external' || Boolean(props.project.links?.download),
)
const linkComponent = RouterLink

function go() {
  router.push({ name: 'project-detail', params: { key: props.project.slug } })
}
</script>

<template>
  <component
    :is="hasActions ? 'article' : linkComponent"
    :to="hasActions ? undefined : { name: 'project-detail', params: { key: project.slug } }"
    class="proj-card"
    :role="hasActions ? 'link' : undefined"
    :tabindex="hasActions ? 0 : undefined"
    @click="hasActions ? go() : undefined"
    @keydown.enter="hasActions ? go() : undefined"
  >
    <div class="proj-thumb">
      <img :src="asset(project.cover)" :alt="project.coverAlt" loading="lazy" />
      <div class="overlay"><span>查看项目详情</span></div>
    </div>
    <div class="proj-body">
      <div class="tags">
        <span v-for="t in project.tags" :key="t.text" :class="['tag', t.type]">{{ t.text }}</span>
      </div>
      <h3>{{ project.title }}</h3>
      <p>{{ project.summary }}</p>
      <div v-if="hasActions" class="proj-actions">
        <a
          v-if="project.links?.demo"
          class="btn btn-sm btn-dark"
          :href="project.links.demo"
          target="_blank"
          rel="noopener"
          @click.stop
        >
          网页版游玩
        </a>
        <a
          v-if="project.links?.download"
          class="btn btn-sm btn-primary"
          :href="project.links.download"
          download
          @click.stop
        >
          下载游戏包
        </a>
      </div>
    </div>
  </component>
</template>

<style scoped>
.proj-card {
  cursor: pointer;
  outline-offset: 3px;
}
</style>
