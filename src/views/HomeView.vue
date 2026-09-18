<script setup>
/**
 * 首页。
 *
 * 迁移要点：Hero、技能、精选作品、成长轨迹四块原本是一整片写死的 HTML，
 * 现在各自的数据来自 data/ 目录，DOM 结构则由 v-for 生成，
 * 新增一条技能或时间轴节点不需要再复制粘贴一整段标签。
 */
import { RouterLink } from 'vue-router'
import AppIcon from '@/components/AppIcon.vue'
import SkillCard from '@/components/SkillCard.vue'
import ProjectCard from '@/components/ProjectCard.vue'
import { useTypewriter } from '@/composables/useTypewriter'
import { profile, heroStats } from '@/data/profile'
import { skillGroups } from '@/data/skills'
import { timeline } from '@/data/timeline'
import { terminalLines } from '@/data/terminal'
import { featuredProjects } from '@/data/projects'

const { visible: termVisible } = useTypewriter(terminalLines, 260)
</script>

<template>
  <div class="page">
    <!-- Hero -->
    <div class="hero">
      <div class="container hero-inner">
        <div>
          <span class="hero-eyebrow">
            <AppIcon name="smile" :size="16" />
            {{ profile.graduation }}
          </span>
          <h1>你好，我是<span class="accent-text">{{ profile.name }}</span><br />一名网页设计与前端开发应届生</h1>
          <p class="role-line">求职方向：<b>网页设计 / 前端开发</b> · 兼有软件测试实习背景</p>
          <p class="intro">{{ profile.intro }}</p>
          <div class="hero-actions">
            <RouterLink class="btn btn-primary" to="/projects">
              <AppIcon name="grid" :size="16" />
              查看作品集
            </RouterLink>
            <RouterLink class="btn btn-ghost" to="/contact">联系我</RouterLink>
          </div>
          <div class="hero-stats">
            <div v-for="s in heroStats" :key="s.label" class="stat">
              <div class="num" v-count-up="s.num" :data-count="s.num">0</div>
              <div class="lbl">{{ s.label }}</div>
            </div>
          </div>
        </div>

        <div class="terminal" role="img" aria-label="终端窗口展示个人介绍代码">
          <div class="term-bar">
            <span class="dot r"></span><span class="dot y"></span><span class="dot g"></span>
            <span class="title">wangshiyu@portfolio: ~/profile.sh</span>
          </div>
          <div class="term-body" aria-live="polite">
            <div
              v-for="(line, i) in termVisible"
              :key="i"
              class="term-line"
              v-html="line"
            ></div>
          </div>
        </div>
      </div>
    </div>

    <!-- 技能概览 -->
    <div class="section">
      <div class="container">
        <div class="sec-head">
          <span class="kicker">01 · SKILLS</span>
          <h2>核心技能能力</h2>
          <p class="sub">以网页设计为主线，叠加程序开发、数据库与软件测试的复合能力。</p>
        </div>
        <div class="skills-grid">
          <SkillCard v-for="s in skillGroups" :key="s.key" :skill="s" />
        </div>
      </div>
    </div>

    <!-- 精选作品 -->
    <div class="section" style="padding-top: 0">
      <div class="container">
        <div class="sec-head">
          <span class="kicker">02 · FEATURED WORKS</span>
          <h2>精选作品</h2>
          <p class="sub">从课程作业到工作产出，每个作品都有完整的实现过程与成果。</p>
        </div>
        <div class="feat-grid">
          <ProjectCard v-for="p in featuredProjects" :key="p.id" :project="p" />
        </div>
        <div style="text-align: center; margin-top: 36px">
          <RouterLink class="btn btn-dark" to="/projects">查看全部作品</RouterLink>
        </div>
      </div>
    </div>

    <!-- 成长时间轴 -->
    <div class="section" style="padding-top: 0">
      <div class="container">
        <div class="sec-head">
          <span class="kicker">03 · TIMELINE</span>
          <h2>成长轨迹</h2>
          <p class="sub">三年大专生涯，从敲出第一行代码到独立承担设计与测试工作。</p>
        </div>
        <div class="road">
          <div v-for="(item, i) in timeline" :key="item.time + item.title" class="road-item">
            <div class="road-time">{{ item.time }}</div>
            <div class="road-axis">
              <span class="road-dot"></span>
              <span v-if="i < timeline.length - 1" class="road-line"></span>
            </div>
            <div class="road-body">
              <h4>{{ item.title }}</h4>
              <div class="meta">{{ item.meta }}</div>
              <p>{{ item.desc }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- CTA -->
    <div class="section" style="padding-top: 0">
      <div class="container">
        <div class="cta-band">
          <div>
            <h3>正在寻找网页设计 / 前端开发岗位机会</h3>
            <p>如果您在招聘网页设计、前端开发或测试方向的应届生，欢迎随时联系我，我可以提供完整的简历、项目源码与作品文件。</p>
          </div>
          <RouterLink class="btn btn-primary" to="/contact">
            和我聊聊
            <AppIcon name="arrow-right" :size="16" />
          </RouterLink>
        </div>
      </div>
    </div>
  </div>
</template>
