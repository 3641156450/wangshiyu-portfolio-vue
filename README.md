# 王诗宇 · 前端作品集（Vue 3 版）

> 2026 届计算机应用技术应届生的求职作品集，面向 **网页设计 / 前端开发** 岗位。
> 本项目是对我此前那版「单文件 HTML + 原生 JS」作品集的完整重写，技术栈为 **Vue 3 + Vite**。

**在线地址**：`https://3641156450.github.io/wangshiyu-portfolio-vue/`

---

## 一、为什么要重写

原版是一个 99KB 的单文件 `index.html`：HTML、29KB CSS、24KB JS 全部塞在一起，
页面切换靠 `location.hash` 手动切换 `<div>` 的显隐，交互逻辑是一整段 570 行的 IIFE。

它跑得动，但**看不出一个前端应届生应有的工程能力**：没有组件概念、数据写死在标签里、
改一处要在三个位置同步、功能越多越难维护。所以我用 Vue 3 把它整个重写了一遍，
并把这次重写本身作为一份公开的「工程能力证明」。

---

## 二、技术栈

| 类别 | 选型 | 说明 |
| --- | --- | --- |
| 框架 | **Vue 3.5**（Composition API + `<script setup>`） | 全部组件使用组合式 API 编写 |
| 构建 | **Vite 6** | 冷启动 <1s，按需编译 + 路由级代码分割 |
| 路由 | **vue-router 4**（HTML5 History 模式） | 含动态路由 `/projects/:key` |
| 状态 | **Pinia 2** | theme / projects / guestbook / admin 四个 store |
| 自定义能力 | 组合式函数 + 自定义指令 | `useTypewriter`、`useIdPhoto`、`v-count-up`、`v-bar` |
| 持久化 | 可插拔仓储层（Repository） | localStorage ⇄ REST 后端，一套接口两种实现 |
| 部署 | GitHub Pages + 自研 Vite 插件 | 自动产出 `404.html` 解决 SPA 深链 |

---

## 三、迁移前后对比

| 能力 | 原版做法 | Vue 版做法 |
| --- | --- | --- |
| 页面路由 | `location.hash` + JS 遍历节点改 `display` | vue-router 管理，前进/后退/分享链接全部可用 |
| 项目详情 | 一个弹层，内容由 JS 拼字符串塞进 DOM | 动态路由独立页面，**每个作品都有可分享的独立链接** |
| 证件照工具 | 300 多行 IIFE，数学换算与 DOM 操作混写 | 纯函数层 `idPhoto.js` + composable `useIdPhoto.js` + 视图层三层分离 |
| 技能进度条 | `IntersectionObserver` + 手动改 `style.width` | 自定义指令 `v-bar`，业务代码零感知 |
| 数字滚动 | `requestAnimationFrame` 内联实现 | 自定义指令 `v-count-up`，与业务解耦 |
| 留言板 | `innerHTML` 重绘整列表 | Pinia store 驱动响应式渲染，Repository 层支持切换本地/云端 |
| Toast | 各组件各自 `createElement` 并 appendChild | 单例队列 + `<ToastHost />` 统一渲染 |
| SVG 图标 | 30 多处内联重复粘贴 | `AppIcon.vue` 统一管理，按名字取用 |
| 主题 | 无 | Pinia store + CSS 变量实现深色模式，跟随系统偏好并记忆选择 |
| 静态资源路径 | 相对路径，深层路由会 404 | `asset()` 工具统一加 `BASE_URL` 前缀 |

### 迁移过程中修掉的原版缺陷

1. **`.page { display: none }` 会导致所有视图不可见** —— 这是手动切换视图留下的规则，
   Vue 版改由路由渲染，必须覆盖掉。
2. **`.board { background: var(--card) }` 引用了从未定义的 `--card` 变量**，留言板背景是无效的。
3. **作品详情对象里 `p2/p3/p4` 都是 `null`**，点这些卡片会弹出空层。
4. **「自动化」筛选结果为空** —— 第三个作品没有 `data-cat` 属性，导致分类漏配。
5. **直接使用 `{ }` 插值会导致 XSS 风险** —— 原版多处用 `innerHTML` 拼接用户输入，
   Vue 版改用 `v-text` / 文本插值自动转义（代码高亮片段为静态可信内容，才用 `v-html`）。

---

## 四、目录结构

```
src/
├── main.js                     应用入口（挂载 / 注册 store·router·指令）
├── App.vue                     外壳：顶栏 + 路由视图 + 页脚 + 全局 Toast
├── router/index.js             路由表，含动态路由与滚动行为
├── views/                      9 个页面级组件（路由级懒加载，含 404 兜底）
├── components/                 复用组件：AppIcon / SiteHeader / ProjectCard …
├── composables/                useTypewriter、useIdPhoto、useToast
├── directives/motion.js        v-count-up / v-bar
├── stores/                     theme、projects、guestbook、admin
├── services/guestbook/         Repository 模式的数据层（local / http）
├── data/                       站点内容数据源（个人信息、技能、经历、作品）
├── utils/
│   ├── idPhoto.js              证件照工具的全部数学换算（纯函数）
│   └── asset.js                静态资源路径 + 外链处理
└── styles/                     tokens.css（设计令牌/深色主题） + main.css + app.css
```

---

## 五、本地运行

```bash
npm install
npm run dev        # 本地开发，默认 http://localhost:5173
npm run build      # 产出到 dist/
npm run preview    # 预览构建产物
npm run server     # 可选：启动留言板后端（见下节）
npm run smoke      # 渲染冒烟测试：在 Node 里把 12 条路由全部渲染一遍
```

> `npm run smoke` 会在 Node 里用 SSR 方式把每条路由真实渲染出来，
> 并监听 Vue 的告警——用来防止「模板里引用了不存在的变量 / 组件」这类问题被带到线上。

Node.js 18+ 即可，无其他前置依赖。

---

## 六、部署

默认已按 GitHub Pages 子路径配置好：

```js
// vite.config.js
const BASE = process.env.PAGES_BASE || '/wangshiyu-portfolio-vue/'
```

`vite.config.js` 里有一个自研的小插件 **`spa-404-fallback`**：构建结束后把 `index.html`
复制一份为 `404.html`。GitHub Pages 在找不到静态资源时会返回 `404.html`，
借此让 HTML5 History 模式的深链（如直接访问 `/projects/bilingual-cuisine`）也能正确渲染。

推送到 `main` 分支后，`.github/workflows/deploy.yml` 会自动完成
「安装依赖 → 跑 12 条路由的渲染冒烟测试 → 打包 → 部署到 GitHub Pages」，
无人工干预。首次推送后需在仓库 Settings → Pages 里把 Source 选为 **GitHub Actions**。

换仓库名时不需要改代码，构建时指定环境变量即可：

```bash
PAGES_BASE=/新的仓库名/ npm run build
```

---

## 七、留言板：从本地存储升级到云端持久化

前端默认跑在纯静态环境，留言存浏览器 `localStorage`，**打开链接即可留言，零成本**。
前端的数据访问抽象成了 Repository 接口：

```
GET    /api/messages          留言列表
POST   /api/messages          发布留言
DELETE /api/messages          清空全部（需 Authorization）
DELETE /api/messages/:id      删除单条（需 Authorization）
POST   /api/admin/login       登录换取 token
```

想要真正的跨设备持久化时：

```bash
# 1) 启动后端（零依赖，只用 Node 内置模块）
node server/index.js                 # 默认 3000 端口，口令可通过 ADMIN_PASSWORD 覆盖

# 2) 前端指向后端后重新构建
echo "VITE_GUESTBOOK_API=http://localhost:3000" > .env.local
npm run build
```

`services/guestbook/index.js` 会根据环境变量自动选择 `localRepository` 还是 `httpRepository`，
**业务代码（store / 组件）不需要任何改动**。管理端在 `/admin`，登录后可以删留言、导出 JSON 备份。

后端内置了基础防护：IP 维度限流（每分钟 10 条）、字段长度截断、32KB body 上限、令牌 2 小时过期。

---

## 八、无障碍与性能

- 全部图片带 `alt`，交互元素可键盘聚焦，Hero 数字区使用 `aria-live`
- 尊重 `prefers-reduced-motion`：打字机、数字滚动、进度条都会直接呈现终值
- 尊重 `prefers-color-scheme`：首次进入自动跟随系统明暗偏好，手动选择后记忆
- 路由级懒加载，首屏 JS 约 144KB（gzip 后约 57KB）
- 图片统一 `loading="lazy"`，Canvas 工具全流程在浏览器本地完成，不上传任何照片

---

## 九、联系方式

- 邮箱：3641156450@qq.com ｜ 电话：17663015760
- 期望城市：淄博 ｜ 期望薪资：4-5K
- GitHub：https://github.com/3641156450

© 2026 王诗宇
