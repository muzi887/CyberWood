// Client/src/composables/api.ts

const API_URL = "http://localhost:5076/api/Stats";

export const api = {
  // 1. 获取数据（GET）
  async getStats(){
    try {
      const response = await fetch(API_URL);
      if(!response.ok){
        throw new Error("网络请求失败");
      }
      return await response.json();
    }catch(error){
      console.error("获取数据失败：",error);
      return null;
    }
  },

  // 2. 更新数据（POST）
  async updateStats(data: any){
    try {
      // 构造符合后端 UserStats 模型的数据
      // 后端不需要 ID (或者默认为 1)，我们只传数据
      const payload = {
        merit: data.merit || 0,
        luck: data.luck || 0,
        wisdom: data.wisdom || 0
      };

      await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
    }catch(error){
      console.error("上传数据失败：",error);
    }
  }
};