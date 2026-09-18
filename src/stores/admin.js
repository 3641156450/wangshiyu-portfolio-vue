/**
 * 管理端会话 store。
 *
 * 说明：本站静态部署时没有真实后端，本地模式下的口令仅为演示交互；
 * 一旦接入云端后端（VITE_GUESTBOOK_API），令牌由服务端签发，删除操作需携带 Authorization。
 */
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { repository } from '@/services/guestbook'

const KEY = 'wsy_admin_token'

export const useAdminStore = defineStore('admin', () => {
  const token = ref((typeof sessionStorage !== 'undefined' && sessionStorage.getItem(KEY)) || '')
  const logging = ref(false)

  const isAuthed = computed(() => Boolean(token.value))

  async function login(password) {
    logging.value = true
    try {
      const res = await repository.login(password)
      token.value = res.token
      if (typeof sessionStorage !== 'undefined') {
        sessionStorage.setItem(KEY, res.token)
      }
      return true
    } catch (e) {
      token.value = ''
      throw e
    } finally {
      logging.value = false
    }
  }

  function logout() {
    token.value = ''
    if (typeof sessionStorage !== 'undefined') sessionStorage.removeItem(KEY)
  }

  return { token, logging, isAuthed, login, logout }
})
