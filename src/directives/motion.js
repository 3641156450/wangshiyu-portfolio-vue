/**
 * 自定义指令：把「滚动到可见时才播动画」这类 DOM 级行为从业务逻辑里剥离。
 *
 *  - v-count-up：数字从 0 滚动到目标值，进入视口才启动，只播一次
 *  - v-bar：进度条宽度动画到目标百分比，同样只播一次
 *
 * 都遵守 prefers-reduced-motion：用户要求减少动效时直接显示终值。
 */
function reduced() {
  if (typeof window === 'undefined' || !window.matchMedia) return false
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

/** 观察一次 → 触发 → 取消观察 */
function observeOnce(el, threshold, cb) {
  if (typeof IntersectionObserver === 'undefined') {
    cb()
    return null
  }
  const io = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue
        io.unobserve(el)
        cb()
      }
    },
    { threshold },
  )
  io.observe(el)
  return io
}

/** requestAnimationFrame 通用缓动；返回停止函数 */
function tween(duration, onFrame) {
  let start = null
  let raf = 0
  const easeOutCubic = (p) => 1 - Math.pow(1 - p, 3)
  function step(ts) {
    if (start === null) start = ts
    const p = Math.min((ts - start) / duration, 1)
    onFrame(easeOutCubic(p), p)
    if (p < 1) raf = requestAnimationFrame(step)
  }
  raf = requestAnimationFrame(step)
  return () => cancelAnimationFrame(raf)
}

export const vCountUp = {
  mounted(el, binding) {
    const target = Number(el.dataset.count ?? binding.value) || 0
    if (reduced()) {
      el.textContent = target.toLocaleString()
      return
    }
    const io = observeOnce(el, 0.4, () => {
      el._stopTween = tween(900, (eased) => {
        el.textContent = Math.round(target * eased).toLocaleString()
      })
    })
    el._io = io
  },
  unmounted(el) {
    el._io?.disconnect?.()
    el._stopTween?.()
  },
}

export const vBar = {
  mounted(el, binding) {
    const target = Number(binding.value) || 0
    if (reduced()) {
      el.style.width = `${target}%`
      return
    }
    const io = observeOnce(el, 0.3, () => {
      el.style.transition = 'width .9s cubic-bezier(.22,.61,.36,1)'
      // 先确保起始宽度为 0，下一帧再赋值才能触发过渡
      el.style.width = '0%'
      requestAnimationFrame(() => {
        el.style.width = `${target}%`
      })
    })
    el._io = io
  },
  unmounted(el) {
    el._io?.disconnect?.()
  },
}

/** 注册到 app，模板里直接用 v-count-up / v-bar */
export function registerMotionDirectives(app) {
  app.directive('count-up', vCountUp)
  app.directive('bar', vBar)
}
