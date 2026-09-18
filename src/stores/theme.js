/**
 * 主题 store：深色模式。
 *
 * 之所以放进 Pinia 而不是单个组件里，是因为「切换主题」这件事同时被：
 *   顶栏按钮、管理端、以及可能新增的其他入口触发，
 * 而真正生效的地方却是 <html data-theme>，二者是跨组件的。
 */
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

const STORAGE_KEY = 'wsy_theme'

function readInitialTheme() {
  if (typeof localStorage === 'undefined') return 'light'
  const saved = localStorage.getItem(STORAGE_KEY)
  if (saved === 'light' || saved === 'dark') return saved
  // 未手动选择过：跟随系统偏好
  if (typeof window !== 'undefined' && window.matchMedia) {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  }
  return 'light'
}

export const useThemeStore = defineStore('theme', () => {
  const theme = ref(readInitialTheme())
  const isDark = computed(() => theme.value === 'dark')

  function apply() {
    if (typeof document === 'undefined') return
    document.documentElement.setAttribute('data-theme', theme.value)
  }

  function setTheme(next) {
    theme.value = next === 'dark' ? 'dark' : 'light'
    apply()
    try {
      localStorage.setItem(STORAGE_KEY, theme.value)
    } catch {
      // 隐私模式下写入失败不影响使用
    }
  }

  function toggle() {
    setTheme(isDark.value ? 'light' : 'dark')
  }

  // 首次进入立即落一次，避免刷新时的白闪
  apply()

  return { theme, isDark, toggle, setTheme }
})
