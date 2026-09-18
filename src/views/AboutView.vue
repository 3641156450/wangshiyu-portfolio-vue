<script setup>
/**
 * 关于我。
 *
 * 个人信息、证书列表原本直接写在 HTML 里，改一次要翻半天；
 * 现在全部来自 data/profile.js，页面只负责排版。
 */
import AppIcon from '@/components/AppIcon.vue'
import { profile, traits, certificates } from '@/data/profile'
import { education } from '@/data/timeline'
import { asset } from '@/utils/asset'
</script>

<template>
  <div class="page">
    <div class="page-hero">
      <div class="container">
        <div class="crumb">ABOUT</div>
        <h1>关于我</h1>
        <p>一个既能做设计、又能写代码和做测试的应届生，习惯把每一件事做扎实。</p>
      </div>
    </div>

    <div class="section">
      <div class="container">
        <div class="about-grid">
          <aside class="about-card">
            <div class="avatar-wrap">
              <img :src="asset('assets/avatar.jpg')" alt="王诗宇的个人照片" />
            </div>
            <h3>{{ profile.name }}</h3>
            <div class="role">{{ profile.title }}</div>
            <ul class="info-list">
              <li v-for="b in profile.basics" :key="b.text">
                <AppIcon :name="b.icon" :size="18" />
                {{ b.text }}
              </li>
            </ul>
          </aside>

          <div class="about-text">
            <h3>一句话介绍</h3>
            <p>
              我是 2026 届<b>计算机应用技术</b>专业应届生，求职方向是<b>网页设计 / 前端开发</b>。专科三年，我在江西同科做过软件测试实习、在长沙群艺担任 PPT 设计师，也独立完成了双语对照网页项目，形成了"设计 + 开发 + 测试"的复合能力。
            </p>
            <p>
              我擅长把<b>模糊需求拆解成可落地的任务</b>：面对客户零散的文字资料，我能快速梳理逻辑并锁定设计风格；面对产品缺陷，我能从用例设计到回归测试全程跟进。现在正用 Vue 3 重写个人作品集，把工程化习惯落实到每一个组件。
            </p>

            <h3 style="margin-top: 26px">个人特质</h3>
            <div class="traits">
              <div v-for="t in traits" :key="t.title" class="trait">
                <AppIcon :name="t.icon" :size="20" />
                <div><b>{{ t.title }}</b><span>{{ t.desc }}</span></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 教育背景 -->
    <div class="section" style="padding-top: 0">
      <div class="container">
        <div class="sec-head">
          <span class="kicker">EDUCATION</span>
          <h2>教育背景</h2>
        </div>
        <div class="about-card">
          <div class="road">
            <div v-for="(item, i) in education" :key="item.title" class="road-item">
              <div class="road-time">{{ item.time }}</div>
              <div class="road-axis">
                <span class="road-dot"></span>
                <span v-if="i < education.length - 1" class="road-line"></span>
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
    </div>

    <!-- 证书 -->
    <div class="section" style="padding-top: 0">
      <div class="container">
        <div class="sec-head">
          <span class="kicker">CERTIFICATES</span>
          <h2>专业证书</h2>
        </div>
        <div class="cert-grid cert-grid-4">
          <div v-for="c in certificates" :key="c.name" class="cert-card">
            <div class="c-ico"><AppIcon :name="c.icon" :size="20" /></div>
            <div><h4>{{ c.name }}</h4><div class="org">{{ c.org }}</div></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
