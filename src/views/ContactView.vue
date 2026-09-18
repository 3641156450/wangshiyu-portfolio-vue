<script setup>
/**
 * 联系我 + 留言板。
 *
 * 迁移要点：
 *  1. 表单用 v-model 双向绑定，不再手动读 value / 清 value；
 *  2. 留言列表由 store 里的响应式数组渲染，增删不再需要重绘 innerHTML；
 *  3. 数据读写走 services 层，本地版与云端版共用同一套交互。
 */
import { ref, computed, onMounted } from 'vue'
import AppIcon from '@/components/AppIcon.vue'
import { profile, contactItems } from '@/data/profile'
import { useGuestbookStore } from '@/stores/guestbook'
import { useAdminStore } from '@/stores/admin'
import { useToast } from '@/composables/useToast'

const board = useGuestbookStore()
const admin = useAdminStore()
const { push } = useToast()

const form = ref({ name: '', text: '' })
const textareaEl = ref(null)

const tip = computed(() =>
  board.isCloud
    ? '留言已保存到服务端，任何设备都能看到。'
    : '留言保存在你当前浏览器本地，换设备或清理缓存后不会保留。',
)

onMounted(async () => {
  await board.load()
  form.value.name = board.savedName()
})

async function submit() {
  const name = form.value.name.trim()
  const text = form.value.text.trim()
  if (!name) return push('请先填写昵称')
  if (!text) return push('留言内容不能为空')

  const ok = await board.add({ name, text }, admin.token)
  if (ok) {
    form.value.text = ''
    push('留言已发布')
  } else {
    push(board.error || '发布失败，请稍后再试')
  }
}

function replyTo(name) {
  const prefix = `回复 @${name}：`
  if (!form.value.text.startsWith(prefix)) {
    form.value.text = prefix + form.value.text
  }
  textareaEl.value?.focus()
}

async function remove(id) {
  if (!admin.isAuthed) return push('删除留言需要先在管理端登录')
  if (!window.confirm('确定删除这条留言？')) return
  const ok = await board.remove(id, admin.token)
  push(ok ? '留言已删除' : board.error || '删除失败')
}
</script>

<template>
  <div class="page">
    <div class="page-hero">
      <div class="container">
        <div class="crumb">CONTACT</div>
        <h1>联系我</h1>
        <p>如果有网页设计、前端开发或测试方向的岗位机会，欢迎随时联系。</p>
      </div>
    </div>

    <div class="section">
      <div class="container">
        <div class="contact-grid">
          <div>
            <div v-for="c in contactItems" :key="c.label" class="contact-item">
              <div class="ci"><AppIcon :name="c.icon" :size="20" /></div>
              <div><b>{{ c.label }}</b><span>{{ c.value }}</span></div>
            </div>
          </div>

          <form class="form-card" novalidate @submit.prevent="submit">
            <h3>给我留言</h3>
            <p class="hint">想说的话会显示在下方的留言板里。{{ tip }}</p>
            <div class="field">
              <label for="gbName">您的昵称</label>
              <input id="gbName" v-model="form.name" type="text" placeholder="怎么称呼您" maxlength="20" />
            </div>
            <div class="field">
              <label for="gbText">想说的话</label>
              <textarea
                id="gbText"
                ref="textareaEl"
                v-model="form.text"
                rows="4"
                placeholder="写下想对我说的话…"
                maxlength="500"
              ></textarea>
            </div>
            <button class="btn btn-primary" type="submit" style="width: 100%" :disabled="board.submitting">
              <AppIcon name="send" :size="16" />
              {{ board.submitting ? '发送中…' : '发送留言' }}
            </button>
          </form>
        </div>

        <!-- 留言板 -->
        <div class="board">
          <div class="board-head">
            <h3>
              留言板 <span class="board-count">{{ board.total }} 条</span>
            </h3>
            <span class="board-source" :class="board.isCloud ? 'cloud' : 'local'">
              <AppIcon name="db" :size="14" />
              {{ board.isCloud ? '云端持久化' : '本地存储' }}
            </span>
          </div>

          <p v-if="board.loading" class="board-empty">正在加载留言…</p>
          <div v-else-if="!board.total" class="board-list">
            <div class="board-empty">还没有留言，来抢沙发。</div>
          </div>
          <div v-else class="board-list">
            <div v-for="msg in board.messages" :key="msg.id" class="board-item">
              <div class="board-meta">
                <b>{{ msg.name }}</b>
                <span class="bd-time">{{ msg.time }}</span>
                <div class="board-ops">
                  <button class="board-btn" type="button" @click="replyTo(msg.name)">回复</button>
                  <button
                    v-if="admin.isAuthed"
                    class="board-btn danger"
                    type="button"
                    @click="remove(msg.id)"
                  >
                    删除
                  </button>
                </div>
              </div>
              <p class="board-text">
                <span v-if="msg.replyTo" class="board-reply">回复 @{{ msg.replyTo }}：</span>
                {{ msg.text }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
