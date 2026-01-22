// Client/src/composables/storage.ts

// 定义常量(Single Source of Truth)
// 使用 as const 确保类型安全
export const STORAGE_KEYS = {
    MERIT: "cyber-woodfish-total",
    LUCK: "cyber-woodfish-luck",
    WISDOM: "cyber-woodfish-wisdom",
    MANUAL_VOLUME: "cyber-woodfish-manual-volume",
    AUTO_VOLUME: "cyber-woodfish-auto-volume",
} as const; 

export const useStorage = () => {
  const storage = localStorage;

  // 基础字符串的读写
  const getItem = (key: string):string | null => {
    return storage.getItem(key);
  };
  const setItem = (key: string, value: string) => {
    storage.setItem(key, value);
  };

  // --- 数值专用封装（针对木鱼技术/音量场景）---
  /**
   * 读取数值，如果不存在或非数字，返回默认值
   */
  const getNumber = (key:string, defalutValue: number = 0): number =>{
    // 从 localStorage 读取数值
    const value = storage.getItem(key);
    // 如果为空，返回默认值 0
    if (value === null ) return defalutValue;
    // 把string转换为number
    const parsed = Number.parseFloat(value);
    // 防呆设计
    return Number.isNaN(parsed)? defalutValue : parsed;
  };

  /**
   * 存储数值
   */
  const setNumber = (key:string,value:number) => {
    storage.setItem(key, String(value));
  };

  const removeItem = (key: string) => {
    storage.removeItem(key);
  };
  return { getItem, setItem, getNumber, setNumber, removeItem };
};
