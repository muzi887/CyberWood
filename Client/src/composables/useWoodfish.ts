// Client/src/composables/useWoodfish.ts
import { ref, reactive, computed, onBeforeUnmount, onMounted} from 'vue';
import { WOODFISH_STATS } from './woodfishConfig';
import { STORAGE_KEYS, useStorage } from './storage';
import { api } from './api';

export function useWoodfish() {
    // 解构出数值专用的读写方法
    const { getNumber, setNumber } = useStorage();

    // --- 状态初始化 ---
    // 使用 reactive 对象存储所有计数值，Key 对应配置表中的 key
    const counts = reactive<Record<string, number>>({});
    
    // 组件加载时，从后端获取真实数据
    onMounted(async() => {
        const serverData = await api.getStats();
        if(serverData){
            // 把服务器的数据同步到前端界面
            // 注意：服务器返回的时小写字段
            counts['merit'] = serverData.merit;
            counts['luck'] = serverData.luck;
            counts['wisdom'] = serverData.wisdom;
        }
    });

    // // 遍历配置表，从 LocalStorage 读取初始值
    // WOODFISH_STATS.forEach((item) => {
    //     counts[item.key] = getNumber(item.storageKey, 0);
    // });

    // UI 动画相关状态
    const merits = ref<any[]>([]); // 浮动文字队列
    const ripples = ref<number[]>([]); // 水波纹队列
    const isActive = ref(false); // 木鱼缩放动画状态

    // --- 自动 / 音量状态 ---
    const isAuto = ref(false);
    const autoInterval = ref(1000); 
    // Timer 类型兼容 Node.js 和浏览器
    let autoTimer : number | null | undefined = null;   

    const manualVolume = ref(getNumber(STORAGE_KEYS.MANUAL_VOLUME, 0.9));
    const autoVolume = ref(getNumber(STORAGE_KEYS.AUTO_VOLUME, 0.6));

    // --- 内部变量 ---
    let nextId = 1;
    let nextRippleId = 1;
    let audioCtx : AudioContext | undefined;

    // 播放声音：直接接收配置表中的 timebre 对象
    const playSound = (timbre:any, volume = 1) => {
        if (!audioCtx) {
            //  懒加载 AudioContext，避免浏览器自动播放策略限制
            // window.webkitAudioContext 是私有属性，需断言为 any
            const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
            if (AudioContextClass)
                audioCtx = new AudioContextClass();
        }

        // 如果浏览器不支持 AudioContext, 直接返回避免报错
        if(!audioCtx) return;

        const now = audioCtx.currentTime;
        const baseFreq = 200 + Math.random() * 100;
        const endFreq = Math.max(200, baseFreq - 40);

        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
    
        // 主音色配置
        osc.type = timbre.type; // 根据类型切换音色
        osc.frequency.setValueAtTime(baseFreq, now); // 微型电子合成器：随机音调
        osc.frequency.exponentialRampToValueAtTime(endFreq, now + 0.12); // 200-300Hz 的指数衰减
        
        gain.gain.setValueAtTime(0.0001, now); // 初始增益
        gain.gain.exponentialRampToValueAtTime(0.45 * volume, now + 0.02); // 0.45 的指数衰减，音量控制
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.22); // 0.0001 的指数衰减
    
        osc.connect(gain).connect(audioCtx.destination);
        
        // 泛音配置
        let overtoneOsc;
        if (timbre.overtoneType) {
            overtoneOsc = audioCtx.createOscillator();
            overtoneOsc.type = timbre.overtoneType;
            overtoneOsc.frequency.setValueAtTime(baseFreq * 2, now);
            overtoneOsc.detune.setValueAtTime(timbre.detune, now);
            const overtoneGain = audioCtx.createGain();
            overtoneGain.gain.setValueAtTime(0.0001, now);
            overtoneGain.gain.exponentialRampToValueAtTime(0.45 * volume * timbre.overtoneGain, now + 0.02);
            overtoneGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.18);   
           
            overtoneOsc.connect(overtoneGain).connect(audioCtx.destination);
        }
        osc.start(now);
        osc.stop(now + 0.24);
        if (overtoneOsc) {
            overtoneOsc.start(now);
            overtoneOsc.stop(now + 0.22);
        }
    };
    
    // 计时器变量
    let saveTimer: ReturnType<typeof setTimeout> | null = null;

    // --- 核心敲击逻辑 （Data-Driven) --- 
    const knock = (options = { volume: 1 }) => {
        // 动画触发
        isActive.value = true;
        setTimeout(() => { isActive.value = false; }, 120);

        const id = nextId++;
        const offset = Math.round(Math.random() * 140 - 70);
        
        // 从配置表中随机选取
        const picked = WOODFISH_STATS[Math.floor(Math.random() * WOODFISH_STATS.length)];
        
        if(!picked) return;

        // 播放声音（传入配置的音色）
        playSound(picked.timbre, options.volume);

        // 乐观更新（Optimistic UI）
        // 不管服务器是否相应，屏幕上先 +1，让用户感觉不到延迟
        const newValue = (counts[picked.key] ?? 0) + 1;
        counts[picked.key] = newValue;

        // 当前所有的最新数值发送给后端保存
        // 防抖（Debounce)
        // 如果之前有待发送的任务，先取消
        if(saveTimer) clearTimeout(saveTimer);

        // 重新定一个 1s后的闹钟
        saveTimer = setTimeout(() => {
            console.log("用户停手了，正在保存数据到服务器...");
            api.updateStats(counts);
        }, 1000);

        // // 持久化存储 (直接用新算出来的值)
        // setNumber(picked.storageKey, newValue);

        // 处理水波纹
        const rippleId = nextRippleId++;
        ripples.value.push(rippleId);
        setTimeout(() => {
            ripples.value = ripples.value.filter((id) => id !== rippleId);
        }, 520);
        
        // 处理浮动文字（数据驱动视图
        merits.value.push({ id, offset, text: picked.text, typeClass: picked.typeClass }); // 添加浮字
        setTimeout(() => {
            merits.value = merits.value.filter((item) => item.id !== id); // 删除功德
        }, 1000);
    };

    // --- 背景色计算逻辑
    // 纯函数逻辑：完全依赖当前 counts 的瞬时状态
    const bgColor = computed(() => {
        // 解构时给默认值 0，防止 undefined 报错 (虽然 reactive 初始值通常没问题)
        const merit = counts['merit'] || 0;
        const luck = counts['luck'] || 0;
        const wisdom = counts['wisdom'] || 0;

        // 定义颜色生成的辅助函数
        // hue：色相（0-360）
        // level：当前是第几个100（1，2，3...)
        const getDynamicColor = (hue: number, level: number) => {
            // 初始亮度 90%（极浅），每升一级亮度降低 5%，最低降到 25% （深色）
            const lightness = Math.max(25, 90 - (level * 5));

            // 饱和度固定80%，保证颜色鲜艳
            return `hsl(${hue}, 80%, ${lightness}%)`;
        };

        // 1. 优先级最高：功德 (Merit) -> 黄色系 (Hue 45)
        // 判断条件：大于0 且 是100的倍数
        if (merit >= 100) {
            // 向下取整
            const level = Math.floor(merit / 100);
            return getDynamicColor(45, level);
        }

        // 2. 优先级第二：好运 (Luck) -> 蓝色系 (Hue 210)
        if (luck >= 100) {
            // 向下取整
            const level = Math.floor(luck / 100);
            return getDynamicColor(210, level);
        }

        // 3. 优先级第三：智慧 (Wisdom) -> 紫色系 (Hue 270)
        if (wisdom >= 100) {
            // 向下取整
            const level = Math.floor(wisdom / 100);
            return getDynamicColor(270, level);
        }

        // 默认背景：保持暗色
        return '#1a1a1a';
    });
    // --- 自动控制逻辑 ---
    const startAuto = () => {
        if (autoTimer) return;
        autoTimer = window.setInterval(() => {
            knock({ volume: autoVolume.value });
        }, autoInterval.value);
    };

    const stopAuto = () => {
        if (!autoTimer) return;
        window.clearInterval(autoTimer);
        autoTimer = null;
    };

    const toggleAuto = () => {
        isAuto.value = !isAuto.value;
        if (isAuto.value) {
            startAuto();
        } else {
            stopAuto();
        }
    };

    const setAutoInterval = (value: number) => {
        autoInterval.value = value;
        if (isAuto.value) {
            stopAuto();
            startAuto();
        }
    };

    // --- 手动交互与重叠 --- 
    const handleManualKnock = () => {
        knock({ volume: manualVolume.value });
        saveVolume();
    };

    const onManualVolumeChange = () => {
    saveVolume();
    };

    const onAutoVolumeChange = () => {
    saveVolume();
    // 如果正在自动播放，重启以应用新的音量（虽然setInterval里读取的是ref，但重启更稳妥）
    if (isAuto.value) {
        stopAuto();
        startAuto();
    }
    };

    // --- 辅助功能 ---
    const saveVolume = () => {
        setNumber(STORAGE_KEYS.MANUAL_VOLUME, manualVolume.value);
        setNumber(STORAGE_KEYS.AUTO_VOLUME, autoVolume.value);
    };

    // --- 重置逻辑 （Data-Driven）---
    const resetCounts = async () => {
        const input = window.prompt(
            "请输入要重置到的数字（留空或 0 为清零）",
            "0"
        );
        if (input === null) return;
        const nextValue = Number.parseInt(input, 10);
        
        if (Number.isNaN(nextValue) || nextValue < 0) {
            window.alert("请输入非负整数");
            return;
        }
        if (!window.confirm(`确认将所有数值重置为 ${nextValue} 吗？`)) {
            return;
        }

        // 遍历配置表重置所有状态
        WOODFISH_STATS.forEach(item => {
            counts[item.key] = nextValue;
            setNumber(item.storageKey, nextValue);
        })
        // 同步给后端
        await api.updateStats(counts);
   };

    // --- 生命周期清理 ---
    onBeforeUnmount(() => {
        stopAuto();
    });

    // 返回所有需要给组件使用的变量和方法
    return {
        counts,
        merits,
        ripples,
        isActive,
        isAuto,
        autoInterval,
        manualVolume,
        autoVolume,
        bgColor,
        toggleAuto,
        setAutoInterval,
        handleManualKnock,
        onManualVolumeChange,
        onAutoVolumeChange,
        resetCounts
    };
}