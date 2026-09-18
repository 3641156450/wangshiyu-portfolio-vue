<script setup>
/**
 * 证件照自动裁剪与 5 寸排版工具。
 *
 * 迁移要点：原版这一页是一整段 IIFE，里面既有数学换算、又有事件监听、
 * 还有 Canvas 绘制，全都堆在一起。现在职责分成三层：
 *   - utils/idPhoto.js            纯数学换算（可独立验证）
 *   - composables/useIdPhoto.js   状态持有 + Canvas 驱动
 *   - 本组件                      只负责把状态和 DOM 事件接起来
 * 模板里再也看不到任何计算过程。
 */
import { ref } from 'vue'
import { useToast } from '@/composables/useToast'
import { useIdPhoto } from '@/composables/useIdPhoto'
import { SPECS, cm2px, SHEET } from '@/utils/idPhoto'

const { push } = useToast()

// 顶层解构后，ref 在模板里会自动解包，读写无需 .value
const {
  fileName,
  specKey,
  spec,
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
} = useIdPhoto(push)

const specList = Object.values(SPECS)
const fileInput = ref(null)
const dragOver = ref(false)

function pickFile() {
  fileInput.value?.click()
}

function onChange(e) {
  const file = e.target.files?.[0]
  if (file) loadImage(file)
  // 清空 value，允许重复选择同一个文件时仍然触发 change
  e.target.value = ''
}

function onDrop(e) {
  dragOver.value = false
  const file = e.dataTransfer?.files?.[0]
  if (file) loadImage(file)
}

/** 工具页底部展示的实现源码，与实际代码保持同步 */
const snippets = [
  {
    file: 'ToolView.vue · 模板只负责接线和渲染',
    html:
      '<span class="tk-c">&lt;!-- 交互画布：照片 + 遮罩 + 取景框全部由 composable 驱动 --&gt;</span>\n' +
      '<span class="tk-t">&lt;canvas</span>\n' +
      '  ref=<span class="tk-s">"stageCanvas"</span>\n' +
      '  <span class="tk-t">@mousedown</span>=<span class="tk-s">"onPointerDown"</span>\n' +
      '  <span class="tk-t">@wheel.prevent</span>=<span class="tk-s">"onWheel"</span>\n' +
      '  <span class="tk-t">@touchmove.prevent</span>=<span class="tk-s">"onTouchMove"</span>\n' +
      '<span class="tk-t">&gt;&lt;/canvas&gt;</span>\n' +
      '<span class="tk-t">&lt;input</span> type=<span class="tk-s">"range"</span>\n' +
      '  :min=<span class="tk-s">"zoomBounds.min"</span> :max=<span class="tk-s">"zoomBounds.max"</span>\n' +
      '  :value=<span class="tk-s">"viewport.zoom"</span>\n' +
      '  <span class="tk-t">@input</span>=<span class="tk-s">"setZoom(+$event.target.value)"</span><span class="tk-t">&gt;</span>',
  },
  {
    file: 'composables/useIdPhoto.js · 状态与 Canvas 驱动',
    html:
      '<span class="tk-c">// 原图不需要响应式代理，用 shallowRef 持有，避免 Vue 递归观察 Image 对象</span>\n' +
      '<span class="tk-k">const</span> image = <span class="tk-t">shallowRef</span>(<span class="tk-n">null</span>);\n' +
      '<span class="tk-k">const</span> viewport = <span class="tk-t">reactive</span>({ zoom: <span class="tk-n">1</span>, offX: <span class="tk-n">0</span>, offY: <span class="tk-n">0</span> });\n' +
      '\n' +
      '<span class="tk-c">// 取景框 → 照片原图坐标 → 单张证件照 → 5 寸排版</span>\n' +
      '<span class="tk-k">function</span> <span class="tk-t">render</span>(){\n' +
      '  <span class="tk-k">const</span> rect = <span class="tk-t">sourceRect</span>(viewport, box.value);\n' +
      '  ctx.<span class="tk-t">drawImage</span>(img, rect.sx, rect.sy, rect.sw, rect.sh,\n' +
      '                  <span class="tk-n">0</span>, <span class="tk-n">0</span>, spec.w, spec.h); <span class="tk-c">// 300DPI 单张</span>\n' +
      '  <span class="tk-k">for</span> (<span class="tk-k">const</span> pos <span class="tk-k">of</span> <span class="tk-t">sheetPositions</span>(spec))\n' +
      '    ctx.<span class="tk-t">drawImage</span>(single, pos.x, pos.y, spec.w, spec.h); <span class="tk-c">// 排版</span>\n' +
      '}',
  },
  {
    file: 'utils/idPhoto.js · 纯换算函数',
    html:
      '<span class="tk-c">// 300DPI：1 厘米 = 118.11 像素，全站尺寸由这一个常量推导</span>\n' +
      '<span class="tk-k">export const</span> DPI = <span class="tk-n">118.11</span>;\n' +
      '<span class="tk-k">export const</span> cm2px = (cm) =&gt; Math.round(cm * DPI);\n' +
      '\n' +
      '<span class="tk-c">// cover 约束：取宽高比的较大值，保证照片完全盖住取景框</span>\n' +
      '<span class="tk-k">export function</span> <span class="tk-t">coverScale</span>(img, box){\n' +
      '  <span class="tk-k">return</span> Math.max(box.w / img.width, box.h / img.height);\n' +
      '}\n' +
      '\n' +
      '<span class="tk-c">// 缩放围绕照片中心：先补偿偏移量，再夹紧边界</span>\n' +
      '<span class="tk-k">export function</span> <span class="tk-t">zoomTo</span>(st, img, box, next){\n' +
      '  <span class="tk-k">const</span> zoom = Math.min(Math.max(next, min), max);\n' +
      '  <span class="tk-k">const</span> offX = st.offX + img.width * (st.zoom - zoom) / <span class="tk-n">2</span>;\n' +
      '  <span class="tk-k">return</span> { zoom, ...<span class="tk-t">clampOffset</span>({ zoom, offX, offY }, img, box) };\n' +
      '}',
  },
]
</script>

<template>
  <div class="page">
    <div class="container">
      <div class="page-head" style="padding-top: calc(var(--header-h) + 30px)">
        <div class="crumb">ID PHOTO TOOL</div>
        <h1 style="font-size: 34px">证件照自动裁剪与 5 寸排版工具</h1>
        <p>上传照片后拖动、缩放自由选择裁剪部位，自动生成一寸或二寸证件照；再按 5 寸照片（8.9 × 12.7cm）画布排版——一寸 9 张、二寸 4 张，带适宜空隙，可直接下载冲印。</p>
      </div>

      <div class="tool-grid">
        <div class="tool-card">
          <h3><i class="tool-num">1</i>上传照片</h3>
          <div
            class="upload-box"
            :class="{ 'has-img': hasImage, 'drag-over': dragOver }"
            @click="pickFile"
            @dragover.prevent="dragOver = true"
            @dragleave="dragOver = false"
            @drop.prevent="onDrop"
          >
            <template v-if="hasImage">
              已选择照片，可点击更换<br />
              <small style="color: var(--muted)">{{ fileName }}</small>
            </template>
            <template v-else>
              点击选择或拖入照片<br />
              <small style="color: var(--muted)">支持 jpg / png，建议正面免冠照</small>
            </template>
          </div>
          <input ref="fileInput" type="file" accept="image/*" hidden @change="onChange" />
        </div>

        <div class="tool-card">
          <h3><i class="tool-num">2</i>选择证件照规格</h3>
          <div class="spec-btns">
            <button
              v-for="s in specList"
              :key="s.key"
              class="spec-btn"
              :class="{ active: specKey === s.key }"
              type="button"
              @click="setSpec(s.key)"
            >
              {{ s.label }} {{ s.cm[0] }} × {{ s.cm[1] }} cm
              <small>5 寸画布排 {{ s.cols * s.rows }} 张（{{ s.cols }} 列 × {{ s.rows }} 行）</small>
            </button>
          </div>
        </div>

        <div class="tool-card">
          <h3><i class="tool-num">3</i>拖动与缩放 · 选择裁剪部位</h3>
          <div class="canvas-box crop-stage">
            <canvas
              ref="stageCanvas"
              :class="{ dragging }"
              @mousedown="onPointerDown"
              @wheel.prevent="onWheel"
              @dblclick="setZoom(zoomBounds.min)"
              @touchstart="onTouchStart"
              @touchmove.prevent="onTouchMove"
              @touchend="onTouchEnd"
            ></canvas>
          </div>
          <div class="crop-controls">
            <input
              type="range"
              :min="zoomBounds.min"
              :max="zoomBounds.max"
              :step="(zoomBounds.max - zoomBounds.min) / 200"
              :value="viewport.zoom"
              :disabled="!hasImage"
              @input="setZoom(+$event.target.value)"
            />
            <div class="crop-hint">拖动照片调整位置 · 滚轮 / 滑块缩放 · 双击重置</div>
          </div>
        </div>

        <div class="tool-card">
          <h3><i class="tool-num">4</i>裁剪结果 · 5 寸排版自动更新</h3>
          <div class="canvas-box"><canvas ref="cropCanvas"></canvas></div>
          <div class="mini-label">单张证件照（{{ spec.w }} × {{ spec.h }} px）</div>
          <div class="canvas-box"><canvas ref="sheetCanvas"></canvas></div>
          <div class="mini-label">5 寸画布排版 · 随裁剪实时更新</div>
          <div class="tool-actions">
            <button class="btn btn-dark" type="button" @click="download('png')">下载 PNG</button>
            <button class="btn btn-dark" type="button" @click="download('jpg')">下载 JPG</button>
            <button class="btn btn-line" type="button" @click="reset()">重新选择照片</button>
          </div>
        </div>
      </div>

      <div class="tool-tip">
        排版规范：基于 300DPI 输出（一寸 {{ spec.w }} × {{ spec.h }}px、二寸 {{ cm2px(3.5) }} ×
        {{ cm2px(5.3) }}px，5 寸画布 {{ SHEET.w }} × {{ SHEET.h }}px），空隙由程序按行列数自动均分，无需手动调整；支持 PNG / JPG 两种格式下载：PNG 无损清晰、JPG 体积更小，均可直接发送冲印店。全过程在本地浏览器完成，图片不会上传到任何服务器。
      </div>

      <div class="page-head" style="padding-top: 10px">
        <div class="crumb">SOURCE CODE</div>
        <h2 style="font-size: 26px">实现源码（带注释）</h2>
        <p>以下为工具的核心代码，完整实现即在当前页面。绿色为注释，橙色为关键字，黄色为字符串。</p>
      </div>

      <div v-for="s in snippets" :key="s.file" class="code-block">
        <div class="code-head">
          <i class="cd r"></i><i class="cd y"></i><i class="cd g"></i><span>{{ s.file }}</span>
        </div>
        <pre class="code" v-html="s.html"></pre>
      </div>
    </div>
  </div>
</template>

<style scoped>
.upload-box.drag-over {
  border-color: var(--amber);
  background: var(--accent-soft);
}
.upload-box.has-img {
  color: var(--accent-strong);
}
</style>
