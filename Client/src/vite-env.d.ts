// Client/src/vite-env.d.ts

/// <reference types="vite/client" />
// 告诉TS：所有以 .vue结尾的文件都是 Vue 组件
declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component:DefineCOmponent<{}, {}, any>
  export default component
}