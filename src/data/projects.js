/**
 * 作品数据源。
 *
 * 迁移前的做法：卡片信息写死在 HTML 里，项目详情则散落在一段 IIFE 中的 PROJ 对象里，
 * 两边一旦不同步就会出现「卡片有、详情没有」的空弹层（原版 p2/p3/p4 就是 null）。
 * 迁移后统一放到这里：卡片列表、详情页、筛选、首页精选全部由同一份数据驱动。
 *
 * 字段说明：
 *  - category: front（Web 前端）/ auto（自动化与脚本），用于作品页筛选
 *  - featured: 是否出现在首页「精选作品」
 *  - kind: internal（站内路由）/ tool（站内工具页）/ external（外链）
 */
export const projects = [
  {
    id: 'p1',
    slug: 'bilingual-cuisine',
    title: '英语学习双语对照静态网页',
    cover: 'assets/cuisine-home.jpg',
    coverAlt: '八大菜系双语对照静态网页截图',
    category: 'front',
    featured: true,
    kind: 'internal',
    tags: [
      { text: 'Web 前端', type: 'tech' },
      { text: '小组作业', type: 'tech' },
    ],
    summary: '八大菜系双语学习网站：英文悬停显示中文对照，图片地图导航，全站响应式。',
    overlay: '查看项目详情',
    year: '2023.10',
    role: '小组主力开发',
    stack: ['HTML5', 'CSS3', 'jQuery', 'Git', 'GitHub Pages'],
    metrics: [
      ['9 页', '完整网站'],
      ['响应式', '全端适配'],
      ['双语', '悬停对照'],
    ],
    description:
      '小组作业项目：以八大菜系为主题的双语学习网站，英文正文悬停即显示中文对照，图片地图导航 + 热区自适应，重构后优化了代码结构与响应式布局。',
    points: [
      '独立完成核心开发：图片地图导航主页 + 8 个菜系双语介绍页，点击热区跳转对应页面',
      '英文正文段落悬停弹出中文译文，形成沉浸式双语对照学习体验',
      '重构优化代码：统一样式与响应式布局、去除冗余脚本，热区坐标随图片缩放自动适配',
      '全程使用 Git 版本管理并上传 GitHub，提供可访问的在线 Demo 链接',
    ],
    links: {
      demo: 'assets/cuisine/index.html',
      repo: 'https://github.com/3641156450/wangshiyu-portfolio/tree/main/assets/cuisine',
    },
    preview: 'assets/cuisine/index.html',
    snippets: [
      {
        file: 'index.html · 主页图片地图导航',
        html:
          '<span class="tk-c">&lt;!-- 八大菜系主页：一张分布图 + 图片热区，点击进入对应菜系 --&gt;</span>\n' +
          '<span class="tk-t">&lt;img</span> id=<span class="tk-s">"mapImg"</span> src=<span class="tk-s">"image/caixi.jpg"</span> usemap=<span class="tk-s">"#caixi"</span><span class="tk-t">&gt;</span>\n' +
          '<span class="tk-t">&lt;map</span> name=<span class="tk-s">"caixi"</span><span class="tk-t">&gt;</span>\n' +
          '  <span class="tk-c">&lt;!-- data-c 保存原图坐标，JS 按显示比例换算，缩放后点击不偏移 --&gt;</span>\n' +
          '  <span class="tk-t">&lt;area</span> data-c=<span class="tk-s">"400,162,75"</span> shape=<span class="tk-s">"circle"</span> alt=<span class="tk-s">"川菜"</span> href=<span class="tk-s">"chuancai.html"</span><span class="tk-t">&gt;</span>\n' +
          '  <span class="tk-t">&lt;area</span> data-c=<span class="tk-s">"562,162,75"</span> shape=<span class="tk-s">"circle"</span> alt=<span class="tk-s">"粤菜"</span> href=<span class="tk-s">"yuecai.html"</span><span class="tk-t">&gt;</span>\n' +
          '  <span class="tk-c">&lt;!-- ……共 8 个菜系热区（徽/鲁/浙/湘/闽/苏）…… --&gt;</span>\n' +
          '<span class="tk-t">&lt;/map&gt;</span>',
      },
      {
        file: 'cuisine.css · 双语悬停对照 + 响应式',
        html:
          '<span class="tk-c">/* 双语对照块：英文为正文，鼠标悬停弹出中文翻译 */</span>\n' +
          '.text-container{ position:relative; background:<span class="tk-n">#fff</span>;\n' +
          '  border-left:4px solid <span class="tk-n">#c8912e</span>; border-radius:8px; }\n' +
          '.text-container span{ display:none; position:absolute;\n' +
          '  background:<span class="tk-n">#2b2118</span>; color:<span class="tk-n">#f6ead6</span>; z-index:100; }\n' +
          '.text-container:hover span{ display:block; } <span class="tk-c">/* 悬停显示中文 */</span>\n' +
          '\n' +
          '<span class="tk-c">/* 左右分栏：左侧双语正文，右侧菜品图；窄屏自动堆叠为单列 */</span>\n' +
          '.layout{ display:grid; grid-template-columns:1fr 320px; gap:30px; }\n' +
          '@media(max-width:760px){ .layout{ grid-template-columns:1fr; } }\n' +
          '.layout img{ width:100%; height:auto; border-radius:10px; }',
      },
      {
        file: 'cuisine.js · 热区坐标自适应',
        html:
          '<span class="tk-c">// 图片随屏幕缩放后，按比例重算热区坐标，保证点击位置准确</span>\n' +
          '<span class="tk-k">var</span> s = img.clientWidth / img.naturalWidth; <span class="tk-c">// 显示宽 ÷ 原图宽 = 缩放比</span>\n' +
          'areas.forEach(<span class="tk-k">function</span>(a){\n' +
          '  <span class="tk-k">var</span> c = a.getAttribute(<span class="tk-s">"data-c"</span>).split(<span class="tk-s">","</span>).map(Number);\n' +
          '  a.coords = c.map(<span class="tk-k">function</span>(v){ <span class="tk-k">return</span> Math.round(v * s); }).join(<span class="tk-s">","</span>);\n' +
          '});\n' +
          'window.addEventListener(<span class="tk-s">"resize"</span>, fitMap); <span class="tk-c">// 窗口变化时重算</span>',
      },
    ],
  },
  {
    id: 'p2',
    slug: 'id-photo-tool',
    title: '证件照自动裁剪与 5 寸排版工具',
    cover: 'assets/tool-home.jpg',
    coverAlt: '证件照自动裁剪与 5 寸排版工具截图',
    category: 'front',
    featured: true,
    kind: 'tool',
    to: '/tool',
    tags: [
      { text: '图像处理', type: '' },
      { text: '前端工具', type: 'green' },
    ],
    summary:
      '上传照片拖动缩放选好构图，自动生成一寸 / 二寸证件照，5 寸画布实时排版（一寸 9 张 / 二寸 4 张）并下载。',
    overlay: '打开证件照工具',
    year: '2024.05',
    role: '独立开发',
    stack: ['JavaScript', 'Canvas API', 'FileReader', 'Blob'],
    metrics: [
      ['300 DPI', '冲印级输出'],
      ['9 张 / 4 张', '自动排版'],
      ['PNG / JPG', '双格式导出'],
    ],
    description:
      '纯前端实现的证件照处理工具：在浏览器内完成上传、拖动取景、无级缩放、按比例裁剪到 300DPI 规格，并把单张证件照自动排版到 5 寸相纸上，全程不上传服务器，离线也能用。',
    points: [
      '设计 300DPI 像素换算模型：以 1cm = 118.11px 为基准，统一驱动一寸 / 二寸规格与 5 寸画布尺寸',
      '实现 cover 约束：保证照片始终完全盖住裁剪框，拖动到边界自动夹取偏移，不会出现白边',
      '通过 Canvas 坐标逆映射把屏幕裁剪框换算回原图坐标，避免二次采样导致的画质损失',
      '排版空隙由行列数自动均分，支持 PNG 无损 / JPG 压缩两种导出，文件名自动带上规格',
    ],
    links: {
      demo: '/tool',
      repo: 'https://github.com/3641156450/wangshiyu-portfolio-vue',
    },
    snippets: [
      {
        file: 'idPhoto.js · 像素换算与 cover 约束（纯函数）',
        html:
          '<span class="tk-c">// 300DPI：1 厘米 = 118.11 像素；所有尺寸由这一个常量推导</span>\n' +
          '<span class="tk-k">export const</span> DPI = <span class="tk-n">118.11</span>;\n' +
          '<span class="tk-k">export const</span> cm2px = (cm) =&gt; Math.round(cm * DPI);\n' +
          '\n' +
          '<span class="tk-c">// 缩放必须让照片完全盖住裁剪框：取宽高比的较大值</span>\n' +
          '<span class="tk-k">export function</span> <span class="tk-t">coverScale</span>(img, box){\n' +
          '  <span class="tk-k">return</span> Math.max(box.w / img.width, box.h / img.height);\n' +
          '}\n' +
          '\n' +
          '<span class="tk-c">// 边界夹取：照片边缘不允许进入裁剪框内部（否则会露白边）</span>\n' +
          '<span class="tk-k">export function</span> <span class="tk-t">clampOffset</span>(st, img, box, stage){\n' +
          '  <span class="tk-k">const</span> dw = img.width * st.zoom, dh = img.height * st.zoom;\n' +
          '  <span class="tk-k">const</span> minX = box.x + box.w - dw, maxX = box.x;\n' +
          '  <span class="tk-k">const</span> minY = box.y + box.h - dh, maxY = box.y;\n' +
          '  <span class="tk-k">return</span> {\n' +
          '    offX: st.offX += Math.min(Math.max(stage.w / <span class="tk-n">2</span> + st.offX, minX), maxX) - (stage.w / <span class="tk-n">2</span> + st.offX),\n' +
          '    offY: st.offY += Math.min(Math.max(stage.h / <span class="tk-n">2</span> + st.offY, minY), maxY) - (stage.h / <span class="tk-n">2</span> + st.offY),\n' +
          '  };\n' +
          '}',
      },
      {
        file: 'idPhoto.js · 5 寸排版（行列空隙自动均分）',
        html:
          '<span class="tk-c">// 把单张证件照循环绘制到 5 寸画布，空隙按行列数自动均分</span>\n' +
          '<span class="tk-k">export function</span> <span class="tk-t">layoutSheet</span>(ctx, photo, spec, sheet){\n' +
          '  ctx.fillStyle = <span class="tk-s">"#fff"</span>;\n' +
          '  ctx.fillRect(<span class="tk-n">0</span>, <span class="tk-n">0</span>, sheet.w, sheet.h);\n' +
          '  <span class="tk-k">const</span> px = (sheet.w - spec.w * spec.cols) / (spec.cols + <span class="tk-n">1</span>);\n' +
          '  <span class="tk-k">const</span> py = (sheet.h - spec.h * spec.rows) / (spec.rows + <span class="tk-n">1</span>);\n' +
          '  <span class="tk-k">for</span> (<span class="tk-k">let</span> r = <span class="tk-n">0</span>; r &lt; spec.rows; r++)\n' +
          '    <span class="tk-k">for</span> (<span class="tk-k">let</span> c = <span class="tk-n">0</span>; c &lt; spec.cols; c++)\n' +
          '      ctx.drawImage(photo, px + c * (spec.w + px), py + r * (spec.h + py), spec.w, spec.h);\n' +
          '}',
      },
    ],
  },
  {
    id: 'p3',
    slug: 'mygo-fnaf-game',
    title: 'MyGO-FNAF 独立同人游戏',
    cover: 'assets/mygo-home.jpg',
    coverAlt: 'MyGO-FNAF 独立同人游戏封面',
    category: 'auto',
    featured: true,
    kind: 'external',
    tags: [
      { text: 'Python 游戏开发', type: '' },
      { text: '独立同人', type: 'green' },
    ],
    summary:
      '独立制作的同人游戏：点击进入网页版直接游玩，也可下载 Windows 游戏包离线游玩。',
    overlay: '打开网页版游戏',
    year: '2024.11',
    role: '独立开发',
    stack: ['Python', 'Pygame', 'PyWebView', 'PyInstaller'],
    metrics: [
      ['双端', '网页 + Windows'],
      ['打包', 'PyInstaller'],
      ['独立', '一人完成'],
    ],
    description:
      '基于 Python 独立制作的同人向恐怖解谜小游戏。除游戏逻辑外，还完成了 Web 版本移植与 Windows 可执行包打包，让不装 Python 的用户也能直接体验。',
    points: [
      '独立完成玩法逻辑、场景切换与资源加载，使用 Pygame 处理精灵动画与碰撞检测',
      '通过 PyWebView 把桌面窗口改造成网页版，部署到 GitHub Pages 供直接试玩',
      '用 PyInstaller 打包 Windows 可执行包，处理依赖收拢与资源路径问题',
      '全部版本管理在 GitHub，Release 附件提供游戏包下载',
    ],
    links: {
      demo: 'https://3641156450.github.io/mygo-fnaf-game/',
      download: 'https://github.com/3641156450/wangshiyu-portfolio/releases/download/v1.0.0/MyGO-FNAF.zip',
    },
  },
]

/** 作品页筛选项 */
export const projectFilters = [
  { key: 'all', label: '全部' },
  { key: 'front', label: 'Web 前端' },
  { key: 'auto', label: '自动化' },
]

export const featuredProjects = projects.filter((p) => p.featured)

export const findProject = (key) =>
  projects.find((p) => p.id === key || p.slug === key) || null
