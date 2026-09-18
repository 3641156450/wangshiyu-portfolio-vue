/**
 * 留言板 store。
 *
 * 所有读写都经由 services/guestbook 提供的 repository 完成，
 * store 本身不关心数据到底存在 localStorage 还是远端数据库。
 * 这样「本地版」和「云端版」共用同一套状态逻辑。
 */
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { repository, storageMode } from '@/services/guestbook'

export const useGuestbookStore = defineStore('guestbook', () => {
  const messages = ref([])
  const loading = ref(false)
  const submitting = ref(false)
  const error = ref('')
  const mode = ref(storageMode)

  const total = computed(() => messages.value.length)
  const isCloud = computed(() => mode.value === 'cloud')

  async function load() {
    loading.value = true
    error.value = ''
    try {
      messages.value = await repository.list()
    } catch (e) {
      error.value = e.message || '留言加载失败'
      messages.value = []
    } finally {
      loading.value = false
    }
  }

  async function add({ name, text }, token = '') {
    submitting.value = true
    try {
      // 兼容用户手动输入「回复 @某人：」的写法
      const m = text.match(/^回复 @([^：:]+)[：:]\s*/)
      const replyTo = m ? m[1] : null
      const cleanText = m ? text.slice(m[0].length) : text
      const created = await repository.create(
        { name, text: cleanText, replyTo },
        token,
      )
      messages.value = [created, ...messages.value]
      return true
    } catch (e) {
      error.value = e.message || '留言发布失败'
      return false
    } finally {
      submitting.value = false
    }
  }

  async function remove(id, token = '') {
    try {
      await repository.remove(id, token)
      messages.value = messages.value.filter((m) => m.id !== id)
      return true
    } catch (e) {
      error.value = e.message || '删除失败'
      return false
    }
  }

  async function clearAll(token = '') {
    try {
      await repository.clear(token)
      messages.value = []
      return true
    } catch (e) {
      error.value = e.message || '清空失败'
      return false
    }
  }

  function savedName() {
    return repository.savedName()
  }

  /** 导出为 JSON 文件，方便备份迁移 */
  function exportJson() {
    const blob = new Blob([JSON.stringify(messages.value, null, 2)], {
      type: 'application/json',
    })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `guestbook-${Date.now()}.json`
    a.click()
    setTimeout(() => URL.revokeObjectURL(url), 3000)
  }

  return {
    messages,
    loading,
    submitting,
    error,
    mode,
    isCloud,
    total,
    load,
    add,
    remove,
    clearAll,
    savedName,
    exportJson,
  }
})
