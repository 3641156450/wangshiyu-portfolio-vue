/**
 * 证件照工具的交互逻辑。
 *
 * 职责划分：
 *  - utils/idPhoto.js 负责全部数学换算（纯函数）
 *  - 本 composable 只负责：持有状态、绑定事件、驱动 Canvas 绘制
 *
 * 组件（ToolView）拿到的就是一组响应式状态 + 动作函数，模板里不需要出现任何计算。
 */
import { ref, shallowRef, computed, reactive, onBeforeUnmount } from 'vue'
import {
  SPECS,
  STAGE,
  SHEET,
  DEFAULT_SPEC,
  cropBox,
  fitState,
  zoomTo,
  zoomRange,
  clampOffset,
  sourceRect,
  sheetPositions,
} from '@/utils/idPhoto'

export function useIdPhoto(toast) {
  /** 原图对象不需要深度响应式，用 shallowRef 避免 Vue 代理整个 Image */
  const image = shallowRef(null)
  const fileName = ref('')

  const specKey = ref(DEFAULT_SPEC)
  const spec = computed(() => SPECS[specKey.value])
  const box = computed(() => cropBox(spec.value))

  /** 缩放 + 偏移：这三个值决定照片在取景框里的位置 */
  const viewport = reactive({ zoom: 1, offX: 0, offY: 0 })

  const hasImage = computed(() => Boolean(image.value))
  const zoomBounds = computed(() =>
    image.value ? zoomRange(image.value, box.value) : { min: 1, max: 1 },
  )

  const stageCanvas = shallowRef(null)
  const cropCanvas = shallowRef(null)
  const sheetCanvas = shallowRef(null)

  /** 屏幕拖动像素 → 画布逻辑像素的比例 */
  function dragScale() {
    const el = stageCanvas.value
    if (!el) return 1
    const rect = el.getBoundingClientRect()
    return rect.width ? el.width / rect.width : 1
  }

  function drawStage() {
    const el = stageCanvas.value
    const img = image.value
    if (!el || !img) return
    el.width = STAGE.w
    el.height = STAGE.h
    const ctx = el.getContext('2d')
    const { x, y, w: bw, h: bh } = box.value

    ctx.fillStyle = '#dfe5ea'
    ctx.fillRect(0, 0, STAGE.w, STAGE.h)

    ctx.save()
    ctx.beginPath()
    ctx.rect(0, 0, STAGE.w, STAGE.h)
    ctx.clip()
    const cx = STAGE.w / 2 + viewport.offX
    const cy = STAGE.h / 2 + viewport.offY
    ctx.drawImage(img, cx, cy, img.width * viewport.zoom, img.height * viewport.zoom)
    ctx.restore()

    // 取景框之外压暗，直观显示会被裁掉的部分
    ctx.fillStyle = 'rgba(8,18,28,.55)'
    ctx.fillRect(0, 0, STAGE.w, y)
    ctx.fillRect(0, y + bh, STAGE.w, STAGE.h - y - bh)
    ctx.fillRect(0, y, x, bh)
    ctx.fillRect(x + bw, y, STAGE.w - x - bw, bh)

    ctx.strokeStyle = '#fff'
    ctx.lineWidth = 2
    ctx.strokeRect(x, y, bw, bh)

    // 井字参考线，方便对齐五官
    ctx.strokeStyle = 'rgba(255,255,255,.3)'
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.moveTo(x + bw / 3, y)
    ctx.lineTo(x + bw / 3, y + bh)
    ctx.moveTo(x + (bw * 2) / 3, y)
    ctx.lineTo(x + (bw * 2) / 3, y + bh)
    ctx.moveTo(x, y + bh / 3)
    ctx.lineTo(x + bw, y + bh / 3)
    ctx.moveTo(x, y + (bh * 2) / 3)
    ctx.lineTo(x + bw, y + (bh * 2) / 3)
    ctx.stroke()
  }

  function render() {
    const img = image.value
    if (!img) return
    const s = spec.value
    const rect = sourceRect(viewport, box.value)

    // 1) 单张证件照：按源图坐标裁剪后缩放到 300DPI 尺寸
    const single = cropCanvas.value
    if (single) {
      single.width = s.w
      single.height = s.h
      const ctx = single.getContext('2d')
      ctx.clearRect(0, 0, s.w, s.h)
      ctx.drawImage(img, rect.sx, rect.sy, rect.sw, rect.sh, 0, 0, s.w, s.h)
    }

    // 2) 5 寸排版：把单张循环绘制到相纸画布
    const sheet = sheetCanvas.value
    if (sheet) {
      sheet.width = SHEET.w
      sheet.height = SHEET.h
      const ctx = sheet.getContext('2d')
      ctx.fillStyle = '#fff'
      ctx.fillRect(0, 0, SHEET.w, SHEET.h)
      if (single) {
        for (const pos of sheetPositions(s)) {
          ctx.drawImage(single, pos.x, pos.y, s.w, s.h)
        }
      }
    }

    drawStage()
  }

  function loadImage(file) {
    if (!file) return
    if (!/^image\//.test(file.type)) {
      toast?.('请选择图片文件')
      return
    }
    const reader = new FileReader()
    reader.onload = () => {
      const img = new Image()
      img.onload = () => {
        image.value = img
        fileName.value = file.name
        Object.assign(viewport, fitState(img, box.value))
        render()
      }
      img.onerror = () => toast?.('图片解析失败，换一张试试')
      img.src = reader.result
    }
    reader.onerror = () => toast?.('读取失败，请重新选择文件')
    reader.readAsDataURL(file)
  }

  function setSpec(key) {
    specKey.value = Number(key)
    if (image.value) {
      Object.assign(viewport, fitState(image.value, box.value))
      render()
    }
  }

  function setZoom(next) {
    if (!image.value) return
    Object.assign(viewport, zoomTo(viewport, image.value, box.value, next))
    render()
  }

  function reset() {
    image.value = null
    fileName.value = ''
    for (const el of [stageCanvas.value, cropCanvas.value, sheetCanvas.value]) {
      if (!el) continue
      const ctx = el.getContext('2d')
      ctx.clearRect(0, 0, el.width, el.height)
      el.width = 0
      el.height = 0
    }
  }

  function download(format = 'png') {
    const sheet = sheetCanvas.value
    if (!image.value || !sheet) {
      toast?.('请先上传照片')
      return
    }
    const isJpg = format === 'jpg'
    sheet.toBlob(
      (blob) => {
        if (!blob) {
          toast?.('导出失败，请重试')
          return
        }
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `证件照${spec.value.label}5寸排版.${isJpg ? 'jpg' : 'png'}`
        a.click()
        setTimeout(() => URL.revokeObjectURL(url), 3000)
        toast?.(`已生成 ${format.toUpperCase()} 排版图，请查收下载`)
      },
      isJpg ? 'image/jpeg' : 'image/png',
      isJpg ? 0.92 : undefined,
    )
  }

  // —— 拖拽 / 滚轮交互 ——
  const dragging = ref(false)
  let dragFrom = null

  function onPointerDown(e) {
    if (!image.value) return
    dragging.value = true
    dragFrom = { x: e.clientX, y: e.clientY }
  }

  function onPointerMove(e) {
    if (!dragging.value || !dragFrom || !image.value) return
    const k = dragScale()
    viewport.offX += (e.clientX - dragFrom.x) * k
    viewport.offY += (e.clientY - dragFrom.y) * k
    dragFrom = { x: e.clientX, y: e.clientY }
    Object.assign(viewport, clampOffset(viewport, image.value, box.value))
    render()
  }

  function onPointerUp() {
    dragging.value = false
    dragFrom = null
  }

  function onWheel(e) {
    if (!image.value) return
    e.preventDefault()
    const factor = e.deltaY < 0 ? 1.1 : 1 / 1.1
    setZoom(viewport.zoom * factor)
  }

  function onTouchStart(e) {
    if (!image.value) return
    dragFrom = { x: e.touches[0].clientX, y: e.touches[0].clientY }
  }

  function onTouchMove(e) {
    if (!dragFrom || !image.value) return
    e.preventDefault()
    const k = dragScale()
    viewport.offX += (e.touches[0].clientX - dragFrom.x) * k
    viewport.offY += (e.touches[0].clientY - dragFrom.y) * k
    dragFrom = { x: e.touches[0].clientX, y: e.touches[0].clientY }
    Object.assign(viewport, clampOffset(viewport, image.value, box.value))
    render()
  }

  function onTouchEnd() {
    dragFrom = null
  }

  // 鼠标在窗口任意位置释放都要结束拖拽，避免「粘住」
  if (typeof window !== 'undefined') {
    window.addEventListener('mouseup', onPointerUp)
    window.addEventListener('mousemove', onPointerMove)
  }
  onBeforeUnmount(() => {
    if (typeof window === 'undefined') return
    window.removeEventListener('mouseup', onPointerUp)
    window.removeEventListener('mousemove', onPointerMove)
  })

  return {
    image,
    fileName,
    specKey,
    spec,
    box,
    viewport,
    zoomBounds,
    hasImage,
    stageCanvas,
    cropCanvas,
    sheetCanvas,
    dragging,
    loadImage,
    setSpec,
    setZoom,
    reset,
    download,
    onPointerDown,
    onWheel,
    onTouchStart,
    onTouchMove,
    onTouchEnd,
  }
}
