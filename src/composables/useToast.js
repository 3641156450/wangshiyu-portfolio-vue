/**
 * 轻量 Toast 队列（模块级单例）。
 *
 * 原来由 #toastWrap 容器 + DOM 拼接触发，任何组件想提示都得先找到那个容器。
 * 改成导出的 reactive 队列后，「触发提示」只需要 useToast().push('...')，
 * 渲染位置由 <ToastHost /> 统一负责，调用方完全不用关心 DOM。
 */
import { ref } from 'vue'

const items = ref([])
let seed = 0

export function useToast() {
  function push(message, duration = 2600) {
    const id = ++seed
    items.value.push({ id, message, visible: false })
    // 下一帧再加 show，保证过渡动画能触发
    requestAnimationFrame(() => {
      const target = items.value.find((it) => it.id === id)
      if (target) target.visible = true
      setTimeout(() => dismiss(id), duration)
    })
    return id
  }

  function dismiss(id) {
    const target = items.value.find((it) => it.id === id)
    if (!target) return
    target.visible = false
    // 等淡出动画结束再移除，避免突然消失
    setTimeout(() => {
      items.value = items.value.filter((it) => it.id !== id)
    }, 320)
  }

  return { items, push, dismiss }
}
