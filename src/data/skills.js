/**
 * 技能数据：首页「核心技能能力」区块。
 * bars 中的 value 用于进度条，配合 useCountUp / useRevealBars 在滚动进入视口时才启动动画。
 */
export const skillGroups = [
  {
    key: 'front',
    title: '前端开发',
    desc: 'HTML5 · CSS3 · jQuery · Vue 3 · 响应式布局',
    ico: 'front',
    bars: [
      { name: 'HTML5', value: 90 },
      { name: 'CSS3 / 响应式', value: 85 },
      { name: 'Vue 3', value: 78 },
    ],
  },
  {
    key: 'code',
    title: '程序设计',
    desc: 'Python · Java · C 语言 · 自动化脚本',
    ico: 'back',
    bars: [
      { name: 'Python', value: 80 },
      { name: 'Java', value: 76 },
      { name: 'C 语言', value: 68 },
    ],
  },
  {
    key: 'qa',
    title: '数据库与测试',
    desc: 'MySQL · Postman · JMeter · 测试用例',
    ico: 'db',
    bars: [
      { name: 'MySQL', value: 82 },
      { name: '接口测试', value: 74 },
      { name: '用例设计', value: 72 },
    ],
  },
  {
    key: 'design',
    title: '办公设计',
    desc: 'WPS · PPT 设计 · Photoshop · 证件照工具',
    ico: 'tool',
    bars: [
      { name: 'WPS / PPT', value: 95 },
      { name: 'PPT 设计', value: 90 },
      { name: 'Photoshop', value: 72 },
    ],
  },
]

/** 简历页技能清单 */
export const resumeSkills = [
  'WPS（精通）· PPT 设计（3 年）',
  'HTML5 / CSS3 / jQuery / Vue 3',
  'Python / Java / C 语言',
  'MySQL / SQL 查询',
  'Postman / JMeter / JIRA',
  'Photoshop / 平面设计',
  'Git / VSCode / Vite',
]
