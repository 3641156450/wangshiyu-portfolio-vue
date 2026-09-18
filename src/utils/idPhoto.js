/**
 * 证件照工具的核心算法（纯函数，不依赖 DOM）。
 *
 * 迁移时的重点：原版这些换算混在 300 多行 DOM 操作代码里，既不好读也没法单独验证。
 * 这里全部抽成「输入明确、输出明确」的纯函数，composable 只负责把它们接到 Canvas 上。
 */

/** 300DPI：1 厘米对应的像素数 */
export const DPI = 118.11

/** 厘米转像素 */
export const cm2px = (cm) => Math.round(cm * DPI)

/** 交互舞台（取景框所在画布）的逻辑尺寸 */
export const STAGE = { w: 360, h: 500 }

/** 取景框宽度，高度按证件照长宽比推导 */
export const BOX_W = 280

/** 5 寸相纸（8.9 × 12.7cm） */
export const SHEET = { w: cm2px(8.9), h: cm2px(12.7) }

/** 证件照规格表：cols / rows 为 5 寸画布上的排布方式 */
export const SPECS = {
  1: { key: 1, label: '一寸', cm: [2.5, 3.5], w: cm2px(2.5), h: cm2px(3.5), cols: 3, rows: 3 },
  2: { key: 2, label: '二寸', cm: [3.5, 5.3], w: cm2px(3.5), h: cm2px(5.3), cols: 2, rows: 2 },
}

export const DEFAULT_SPEC = 1

/** 取景框矩形：水平居中，高度按当前规格比例 */
export function cropBox(spec) {
  const bh = Math.round((BOX_W * spec.h) / spec.w)
  return { x: (STAGE.w - BOX_W) / 2, y: (STAGE.h - bh) / 2, w: BOX_W, h: bh }
}

/** cover 填充所需的最小缩放：取宽高比的较大值，保证不留白 */
export function coverScale(img, box) {
  return Math.max(box.w / img.width, box.h / img.height)
}

/** 缩放上下限：最小为 cover，最大为 cover 的 4 倍 */
export function zoomRange(img, box) {
  const min = coverScale(img, box)
  return { min, max: min * 4 }
}

/**
 * 边界夹取：照片边缘不允许进入取景框内部（否则会出现白边）。
 * 返回修正后的偏移量，不修改入参。
 */
export function clampOffset(state, img, box) {
  const dw = img.width * state.zoom
  const dh = img.height * state.zoom
  const cx = STAGE.w / 2 + state.offX
  const cy = STAGE.h / 2 + state.offY

  const minX = box.x + box.w - dw
  const maxX = box.x
  const minY = box.y + box.h - dh
  const maxY = box.y

  let offX = state.offX
  let offY = state.offY
  // 图片比取景框还小的时候无法夹紧，直接居中，避免抖动
  if (minX > maxX) offX = 0
  else offX = Math.min(Math.max(cx, minX), maxX) - STAGE.w / 2
  if (minY > maxY) offY = 0
  else offY = Math.min(Math.max(cy, minY), maxY) - STAGE.h / 2

  return { offX, offY }
}

/** 把取景框位置换算回照片原图坐标，用于无损输出 */
export function sourceRect(state, box) {
  return {
    sx: (box.x - STAGE.w / 2 - state.offX) / state.zoom,
    sy: (box.y - STAGE.h / 2 - state.offY) / state.zoom,
    sw: box.w / state.zoom,
    sh: box.h / state.zoom,
  }
}

/** 围绕照片中心缩放到目标倍率，并一次性完成边界夹紧 */
export function zoomTo(state, img, box, next) {
  const { min, max } = zoomRange(img, box)
  const zoom = Math.min(Math.max(next, min), max)
  const offX = state.offX + (img.width * (state.zoom - zoom)) / 2
  const offY = state.offY + (img.height * (state.zoom - zoom)) / 2
  return { zoom, ...clampOffset({ zoom, offX, offY }, img, box) }
}

/** 初始状态：按 cover 铺满取景框并居中 */
export function fitState(img, box) {
  return { zoom: coverScale(img, box), offX: 0, offY: 0 }
}

/** 5 寸排版的行列空隙：把剩余空间按「行列数 + 1」均分 */
export function sheetGaps(spec) {
  return {
    px: (SHEET.w - spec.w * spec.cols) / (spec.cols + 1),
    py: (SHEET.h - spec.h * spec.rows) / (spec.rows + 1),
  }
}

/** 每张照片在 5 寸画布上的左上角坐标 */
export function sheetPositions(spec) {
  const { px, py } = sheetGaps(spec)
  const list = []
  for (let r = 0; r < spec.rows; r++) {
    for (let c = 0; c < spec.cols; c++) {
      list.push({ x: px + c * (spec.w + px), y: py + r * (spec.h + py) })
    }
  }
  return list
}
