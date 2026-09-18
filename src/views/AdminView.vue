<script setup>
/**
 * 留言管理端。
 *
 * 设计说明：静态部署时没有服务端，这里的「登录」是本地演示口令；
 * 一旦配置了 VITE_GUESTBOOK_API，登录请求会打到后端，由服务端签发令牌，
 * 后续删除操作携带 Authorization 头，才算真正受保护的写权限。
 */
import { ref, onMounted, computed } from 'vue'
import { RouterLink } from 'vue-router'
import AppIcon from '@/components/AppIcon.vue'
import { useAdminStore } from '@/stores/admin'
import { useGuestbookStore } from '@/stores/guestbook'
import { useToast } from '@/composables/useToast'

const admin = useAdminStore()
const board = useGuestbookStore()
const { push } = useToast()

const password = ref('')
const loginError = ref('')

onMounted(() => board.load())

const latest = computed(() => board.messages[0]?.time || '暂无')

async function login() {
  loginError.value = ''
  try {
    await admin.login(password.value)
    password.value = ''
    push('登录成功，现在可以管理留言了')
    await board.load()
  } catch (e) {
    loginError.value = e.message || '登录失败'
  }
}

async function removeMsg(id) {
  if (!window.confirm('确定删除这条留言？')) return
  const ok = await board.remove(id, admin.token)
  push(ok ? '留言已删除' : board.error || '删除失败')
}

async function clearAll() {
  if (!window.confirm('确定清空全部留言？此操作不可撤销。')) return
  const ok = await board.clearAll(admin.token)
  push(ok ? '留言已清空' : board.error || '清空失败')
}
</script>

<template>
  <div class="page">
    <div class="page-hero">
      <div class="container">
        <div class="crumb">ADMIN</div>
        <h1>留言管理端</h1>
        <p>查看访客留言，支持删除与导出备份。</p>
      </div>
    </div>

    <div class="section">
      <div class="container">
        <!-- 登录卡片 -->
        <div v-if="!admin.isAuthed" class="admin-shell">
          <div class="about-card">
            <h3 style="margin-bottom: 14px"><AppIcon name="user" :size="18" /> 管理员登录</h3>
            <p style="color: var(--muted); font-size: 14px; margin-bottom: 18px">
              {{ board.isCloud
                ? '已连接云端留言服务，请输入服务端配置的管理口令。'
                : '当前为本地存储模式，口令用于演示登录流程；接入后端后由服务端签发令牌。' }}
            </p>
            <div class="field">
              <label for="adminPwd">管理口令</label>
              <input
                id="adminPwd"
                v-model="password"
                type="password"
                placeholder="请输入口令"
                @keydown.enter="login"
              />
            </div>
            <p v-if="loginError" class="board-reply" style="margin-bottom: 10px">{{ loginError }}</p>
            <button class="btn btn-primary" style="width: 100%" :disabled="admin.logging" @click="login">
              {{ admin.logging ? '登录中…' : '登录' }}
            </button>
            <RouterLink class="btn btn-line" style="width: 100%; margin-top: 10px" to="/contact">
              返回留言板
            </RouterLink>
          </div>
        </div>

        <!-- 管理面板 -->
        <template v-else>
          <div class="admin-stat-row">
            <div class="admin-stat">
              <div class="n">{{ board.total }}</div>
              <div class="l">留言总数</div>
            </div>
            <div class="admin-stat">
              <div class="n">{{ board.messages.filter((m) => m.replyTo).length }}</div>
              <div class="l">回复条数</div>
            </div>
            <div class="admin-stat">
              <div class="n" style="font-size: 18px">{{ latest }}</div>
              <div class="l">最新留言时间</div>
            </div>
          </div>

          <div class="tool-actions" style="margin-bottom: 18px">
            <button class="btn btn-line" type="button" @click="board.exportJson()">
              <AppIcon name="download" :size="16" />导出 JSON 备份
            </button>
            <button class="btn btn-line" type="button" @click="admin.logout()">退出登录</button>
            <button class="btn btn-line danger" type="button" @click="clearAll">清空全部</button>
          </div>

          <div class="admin-table-wrap">
            <table class="admin-table">
              <thead>
                <tr>
                  <th>昵称</th>
                  <th>内容</th>
                  <th>时间</th>
                  <th>操作</th>
                </tr>
              </thead>
              <tbody>
                <tr v-if="!board.total">
                  <td colspan="4" style="color: var(--muted)">暂无留言。</td>
                </tr>
                <tr v-for="m in board.messages" :key="m.id">
                  <td style="white-space: nowrap">{{ m.name }}</td>
                  <td>
                    <span v-if="m.replyTo" class="board-reply">回复 @{{ m.replyTo }}：</span>
                    {{ m.text }}
                  </td>
                  <td style="white-space: nowrap; color: var(--muted)">{{ m.time }}</td>
                  <td>
                    <button class="board-btn danger" type="button" @click="removeMsg(m.id)">
                      <AppIcon name="trash" :size="14" />删除
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>
