/**
 * 留言板仓储工厂。
 *
 * 采用「仓储（Repository）模式」把数据来源抽象掉：
 * - 没配 VITE_GUESTBOOK_API  -> 走 localRepository（localStorage，静态托管即可用）
 * - 配了 VITE_GUESTBOOK_API  -> 走 httpRepository（真实服务端持久化）
 *
 * 上层 store 只依赖这套接口，切换数据源不需要改动任何业务代码，
 * 这也是本项目能在 GitHub Pages 纯静态部署、又能升级成云端版的原因。
 */
import { localRepository } from './localRepository'
import { httpRepository } from './httpRepository'

const API = import.meta.env.VITE_GUESTBOOK_API

export const repository = API ? httpRepository : localRepository

/** 当前数据来源，用于界面上给用户一个明确提示 */
export const storageMode = repository.mode

export { localRepository, httpRepository }
