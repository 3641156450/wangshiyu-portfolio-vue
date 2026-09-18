/**
 * 个人资料：全站共用的一份数据源。
 * 迁移时从 HTML 中提取，避免同一份信息在多个页面重复维护。
 */
export const profile = {
  name: '王诗宇',
  enName: 'Wang Shiyu',
  initial: 'W.',
  title: '网页设计 / 前端开发 · 应届生',
  roleLine: '求职方向：网页设计 / 前端开发 · 兼有软件测试实习背景',
  intro:
    '专科三年，我做过软件测试实习、PPT 设计工作，也独立完成过双语网页项目。既能写页面，也能做测试与设计，习惯把模糊需求拆解成能落地的任务。',
  basics: [
    { icon: 'user', text: '女 · 23 岁 · 2026 届应届生' },
    { icon: 'mail', text: '3641156450@qq.com' },
    { icon: 'phone', text: '17663015760' },
    { icon: 'pin', text: '期望城市：淄博 · 期望薪资 4-5K' },
  ],
  email: '3641156450@qq.com',
  phone: '17663015760',
  city: '淄博',
  salary: '4-5K',
  github: 'https://github.com/3641156450',
  graduation: '2026 届 · 计算机应用技术 · 求职中',
}

/** 首页统计卡片的目标数字 */
export const heroStats = [
  { num: 3, label: '完整项目作品' },
  { num: 5, label: '核心技能方向' },
  { num: 4, label: '专业证书' },
  { num: 2, label: '段实践经历' },
]

/** 特质卡片 */
export const traits = [
  {
    icon: 'bulb',
    title: '需求落地',
    desc: '能把模糊需求拆解为具体技术任务，按敏捷迭代确保按期上线',
  },
  {
    icon: 'debug',
    title: '调试排错',
    desc: '系统性排查代码隐患，能为页面加载慢、接口延迟提出低成本优化',
  },
  {
    icon: 'target',
    title: '独立攻坚',
    desc: '小组开发中主动承担核心模块，用技术文档减少团队沟通成本',
  },
  {
    icon: 'users',
    title: '快速上手',
    desc: '通过官方文档与开源项目快速掌握 Vue3、Spring Boot 等新技术',
  },
]

/** 证书 */
export const certificates = [
  { icon: 'award', name: '计算机二级', org: '全国计算机等级考试' },
  { icon: 'book', name: '工业与信息技术职业技能证书', org: '职业技能等级认证' },
  { icon: 'file', name: '普通话二级乙等', org: '国家语言文字工作委员会' },
  { icon: 'clock', name: '驾驶证 C2', org: '小型自动挡汽车' },
]

/** 联系页联系方式 */
export const contactItems = [
  { icon: 'mail', label: '邮箱', value: '3641156450@qq.com' },
  { icon: 'phone', label: '电话', value: '17663015760' },
  { icon: 'pin', label: '期望城市', value: '淄博 · 期望薪资 4-5K' },
  { icon: 'clock', label: '回复时间', value: '工作日 9:00 - 21:00，通常 2 小时内回复' },
]
