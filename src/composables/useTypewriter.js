/**
 * 终端打字机效果。
 *
 * 把「逐行输出」这件事从 DOM 操作改写成响应式状态：
 * visible 是一个不断增长的数组，模板用 v-for 渲染即可，
 * 组件卸载时自动清理定时器（原版 permTimer 只在重复进入首页时才 clearInterval）。
 */
import { ref, onMounted, onBeforeUnmount } from 'vue'

/** 系统是否开启了「减少动态效果」 */
export function prefersReducedMotion() {
  if (typeof window === 'undefined' || !window.matchMedia) return false
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

export function useTypewriter(lines, interval = 260) {
  const visible = ref([])
  const done = ref(false)
  let timer = null

  function stop() {
    if (timer) {
      clearInterval(timer)
      timer = null
    }
  }

  function start() {
    stop()
    visible.value = []
    done.value = false
    // 无障碍：用户要求减少动效时直接给出完整内容
    if (prefersReducedMotion()) {
      visible.value = [...lines]
      done.value = true
      return
    }
    let i = 0
    timer = setInterval(() => {
      if (i < lines.length) {
        visible.value = [...visible.value, lines[i]]
        i += 1
      } else {
        stop()
        done.value = true
      }
    }, interval)
  }

  onMounted(start)
  onBeforeUnmount(stop)

  return { visible, done, start, stop }
}
