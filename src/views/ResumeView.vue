<script setup>
/**
 * 简历页。
 *
 * 原版这里所有经历都是手写 <div class="edu-item">，
 * 现在技能/经历/项目都由 data 驱动，新增经历只需往数组里加一项。
 */
import { computed } from 'vue'
import AppIcon from '@/components/AppIcon.vue'
import { profile } from '@/data/profile'
import { resumeSkills } from '@/data/skills'
import { experiences } from '@/data/timeline'
import { projects } from '@/data/projects'
import { useToast } from '@/composables/useToast'

const { push } = useToast()

const certs = ['计算机二级', '工业与信息技术职业技能证书', '普通话二级乙等', '驾驶证 C2']
const projectItems = computed(() => projects)

function downloadResume() {
  push('示例简历：请替换为您的正式 PDF 简历')
}
</script>

<template>
  <div class="page">
    <div class="page-hero">
      <div class="container">
        <div class="crumb">RESUME</div>
        <h1>简历</h1>
        <p>一份可以直接提交的应届生简历，按岗位要求整理了技能、经历与作品。</p>
      </div>
    </div>

    <div class="section">
      <div class="container">
        <div class="resume-shell">
          <aside class="resume-side">
            <div class="side-block">
              <h3><AppIcon name="user" :size="18" />基本信息</h3>
              <ul>
                <li>王诗宇 · 女 · 23 岁</li>
                <li>计算机应用技术 · 大专</li>
                <li>求职意向：网页设计 / 前端开发</li>
                <li>期望薪资：{{ profile.salary }}</li>
                <li>期望城市：{{ profile.city }}</li>
              </ul>
            </div>
            <div class="side-block">
              <h3><AppIcon name="back" :size="18" />技能</h3>
              <ul>
                <li v-for="s in resumeSkills" :key="s">{{ s }}</li>
              </ul>
            </div>
            <div class="side-block">
              <h3><AppIcon name="award" :size="18" />证书</h3>
              <ul>
                <li v-for="c in certs" :key="c">{{ c }}</li>
              </ul>
            </div>
          </aside>

          <div class="resume-main">
            <div class="resume-head">
              <div>
                <h3>王诗宇</h3>
                <p>网页设计 / 前端开发（应届）· {{ profile.email }} · {{ profile.phone }}</p>
              </div>
              <button class="btn btn-dark" type="button" @click="downloadResume">
                <AppIcon name="download" :size="16" />
                下载简历
              </button>
            </div>

            <div class="doc-block">
              <div class="doc-title"><span class="no">01</span>教育经历</div>
              <div class="edu-item">
                <time>2023.09 - 2026.06</time>
                <div>
                  <h4>计算机应用技术 · 大专</h4>
                  <div class="org">山东海事职业学院</div>
                  <p>主修：计算机基础、计算机网络技术、操作系统、C 语言、Python、Java、Web 前端开发、数据库技术、网页设计、平面设计、办公自动化。</p>
                </div>
              </div>
            </div>

            <div class="doc-block">
              <div class="doc-title"><span class="no">02</span>工作与实习经历</div>
              <div v-for="e in experiences" :key="e.title" class="edu-item">
                <time>{{ e.time }}</time>
                <div>
                  <h4>{{ e.title }}</h4>
                  <div class="org">{{ e.org }}</div>
                  <p>{{ e.desc }}</p>
                </div>
              </div>
            </div>

            <div class="doc-block">
              <div class="doc-title"><span class="no">03</span>项目经历</div>
              <div v-for="p in projectItems" :key="p.id" class="edu-item">
                <time>{{ p.year }}</time>
                <div>
                  <h4>{{ p.title }}</h4>
                  <div class="org">{{ p.stack.join(' · ') }} · {{ p.role }}</div>
                  <p>{{ p.points[0] }}。{{ p.points[1] }}</p>
                </div>
              </div>
            </div>

            <div class="doc-block">
              <div class="doc-title"><span class="no">04</span>自我评价</div>
              <p style="font-size: 14.5px; color: var(--muted); line-height: 1.9">
                具备"设计 + 开发 + 测试"的复合能力：既能完成响应式页面开发与平面设计，也能编写自动化脚本、设计测试用例并跟进缺陷闭环。近期用 Vue 3 + Vite 对个人作品集做了完整重构，熟悉组件拆分、路由与状态管理。习惯把模糊需求拆解成具体任务，注重代码规范与交付细节。希望加入一支务实的技术团队，在网页设计 / 前端方向持续成长。
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
