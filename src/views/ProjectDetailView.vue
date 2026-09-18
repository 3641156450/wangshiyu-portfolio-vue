<script setup>
/**
 * 项目详情页 —— 本次 Vue 迁移新增的能力。
 *
 * 原版把详情做成一个弹层，问题很直接：
 *   1. 链接无法分享，招聘方只能看到列表，看不到单个项目地址；
 *   2. 浏览器的前进/后退失效，关掉弹层等于「关掉了一个页面」但 URL 没变；
 *   3. 内容由 JS 拼字符串塞进 DOM，既不好维护也没有 SEO。
 *
 * 改成 /projects/:key 动态路由后，每个作品都有独立地址，
 * 可以直接把链接发给面试官。
 */
import { computed } from 'vue'
import { useRoute, useRouter, RouterLink } from 'vue-router'
import AppIcon from '@/components/AppIcon.vue'
import { useProjectsStore } from '@/stores/projects'
import { asset, isExternal, openExternal } from '@/utils/asset'

const route = useRoute()
const router = useRouter()
const store = useProjectsStore()

const project = computed(() => store.byId(route.params.key))

// 参数变化时 vue-router 会复用同一个组件实例，
// 所以「上一个 / 下一个」也必须写成 computed，不能只在 setup 里算一次。
const neighbours = computed(() =>
  project.value ? store.neighbours(project.value.id) : { prev: null, next: null },
)

function openLink(url) {
  if (!url) return
  if (isExternal(url)) openExternal(url)
  else if (url.startsWith('/')) router.push(url)
}

const detailRoute = (p) => (p ? { name: 'project-detail', params: { key: p.slug } } : null)
</script>

<template>
  <div class="page">
    <div v-if="!project" class="page">
      <div class="page-hero">
        <div class="container">
          <div class="crumb">404</div>
          <h1>没有找到这个项目</h1>
          <p>它可能已经下架，或者链接地址不正确。</p>
          <RouterLink class="btn btn-primary" to="/projects" style="margin-top: 18px">
            回到作品集
          </RouterLink>
        </div>
      </div>
    </div>

    <template v-else>
      <div class="detail-hero">
        <div class="container">
          <RouterLink class="detail-back" to="/projects">
            <AppIcon name="arrow-left" :size="14" />返回作品集
          </RouterLink>
          <div class="detail-crumb">{{ project.category === 'front' ? 'WEB PROJECT' : 'AUTOMATION' }}</div>
          <h1 style="color: #fff; margin-top: 10px">{{ project.title }}</h1>
          <div class="tags" style="margin-top: 14px">
            <span v-for="t in project.tags" :key="t.text" :class="['tag', t.type]">{{ t.text }}</span>
          </div>
        </div>
      </div>

      <div class="section">
        <div class="container">
          <div class="detail-layout">
            <div>
              <img
                class="detail-cover"
                :src="asset(project.cover)"
                :alt="project.coverAlt"
                style="width: 100%; border-radius: 12px; margin-bottom: 26px"
              />

              <h4 style="font-size: 18px; margin-bottom: 10px">项目简介</h4>
              <p style="color: var(--muted)">{{ project.description }}</p>

              <h4 style="font-size: 18px; margin: 26px 0 10px">职责与亮点</h4>
              <ul class="detail-points">
                <li v-for="(pt, i) in project.points" :key="i">{{ pt }}</li>
              </ul>

              <!-- 可实时预览的静态子站点 -->
              <template v-if="project.preview">
                <h4 style="font-size: 18px; margin: 30px 0 12px">网页实时预览</h4>
                <div class="preview-frame">
                  <iframe
                    :src="asset(project.preview)"
                    :title="`${project.title} 实时预览`"
                    loading="lazy"
                  ></iframe>
                </div>
              </template>

              <!-- 核心代码：数据在 data/projects.js 中集中维护 -->
              <template v-if="project.snippets?.length">
                <h4 style="font-size: 18px; margin: 30px 0 12px">核心实现（含注释）</h4>
                <p class="code-note">以下为从完整实现中截取的核心片段，绿=注释、橙=标签/关键字、黄=字符串。</p>
                <div v-for="s in project.snippets" :key="s.file" class="code-block">
                  <div class="code-head">
                    <i class="cd r"></i><i class="cd y"></i><i class="cd g"></i>
                    <span>{{ s.file }}</span>
                  </div>
                  <pre class="code" v-html="s.html"></pre>
                </div>
              </template>

              <div class="detail-nav">
                <RouterLink v-if="neighbours.prev" :to="detailRoute(neighbours.prev)">
                  ← {{ neighbours.prev.title }}
                </RouterLink>
                <RouterLink v-if="neighbours.next" :to="detailRoute(neighbours.next)" style="margin-left: auto">
                  {{ neighbours.next.title }} →
                </RouterLink>
              </div>
            </div>

            <aside class="detail-side-card">
              <div class="meta-row"><span>时间</span><b>{{ project.year }}</b></div>
              <div class="meta-row"><span>担当角色</span><b>{{ project.role }}</b></div>
              <div class="meta-row">
                <span>技术栈</span><b>{{ project.stack.join(' / ') }}</b>
              </div>

              <div class="modal-metrics" style="margin: 18px 0">
                <div v-for="m in project.metrics" :key="m[1]" class="m">
                  <b>{{ m[0] }}</b><span>{{ m[1] }}</span>
                </div>
              </div>

              <button
                v-if="project.links?.demo"
                class="btn btn-dark"
                style="width: 100%; margin-bottom: 10px"
                type="button"
                @click="openLink(project.links.demo)"
              >
                <AppIcon name="external" :size="16" />
                在线演示
              </button>
              <button
                v-if="project.links?.repo"
                class="btn btn-line"
                style="width: 100%"
                type="button"
                @click="openLink(project.links.repo)"
              >
                <AppIcon name="github" :size="16" />
                查看源码
              </button>
              <button
                v-if="project.links?.download"
                class="btn btn-primary"
                style="width: 100%; margin-top: 10px"
                type="button"
                @click="openLink(project.links.download)"
              >
                <AppIcon name="download" :size="16" />
                下载作品包
              </button>
            </aside>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<style scoped>
.detail-points li {
  margin-left: 20px;
  color: var(--muted);
  margin-bottom: 8px;
}
</style>
