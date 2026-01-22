<!-- Client/src/App.vue -->
<template>
  <div class="app-shell" :style="{ backgroundColor: bgColor}">
    <div class="stats">
      <div
        v-for="item in WOODFISH_STATS"
        :key="item.key"
        class="stat"
        :class="item.typeClass"
        @click="handleManualKnock(item.key)"
      >
        {{ item.label }}：{{ counts[item.key] }}
      </div>
    </div>
    <button class="auto-toggle" :class="{ on: isAuto }" @click="toggleAuto">
      自动积攒：{{ isAuto ? "开" : "关" }}
    </button>
    <div class="control-panel">
      <div class="speed-group">
        <span class="speed-label">自动档位</span>
        <button
          v-for="option in speedOptions"
          :key="option.value"
          class="speed-btn"
          :class="{ active: autoInterval === option.value }"
          @click="setAutoInterval(option.value)"
        >
          {{ option.label }}
        </button>
      </div>
      <div class="volume-group">
        <label class="volume-label">
          手动音量
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            v-model.number="manualVolume"
            @input="onManualVolumeChange"
          />
          <span class="volume-value">{{ manualVolume.toFixed(2) }}</span>
        </label>
        <label class="volume-label">
          自动音量
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            v-model.number="autoVolume"
            @input="onAutoVolumeChange"
          />
          <span class="volume-value">{{ autoVolume.toFixed(2) }}</span>
        </label>
      </div>
      <button class="reset-btn" @click="resetCounts">清零/自定义重置</button>
    </div>
    <div class="stage">
      <button class="woodfish" :class="{ 'is-active': isActive }" @click="handleManualKnock()">
        <svg
          width="240"
          height="240"
          viewBox="0 0 240 240"
          xmlns="http://www.w3.org/2000/svg"
          aria-label="木鱼"
        >
          <ellipse cx="120" cy="120" rx="92" ry="70" fill="rgb(184,107,50)" stroke="rgb(120,70,35)" stroke-width="8" />
          <ellipse cx="120" cy="120" rx="58" ry="42" fill="rgb(208,135,74)" opacity="0.7" />
          <circle cx="160" cy="90" r="11" fill="rgb(120,70,35)" />
          <path d="M60 140 C90 170 150 170 180 140" fill="none" stroke="rgb(120,70,35)" stroke-width="6" stroke-linecap="round" />
          <rect x="106" y="24" width="28" height="42" rx="10" fill="rgb(140,80,40)" />
        </svg>
      </button>

      <span v-for="ripple in ripples" :key="ripple" class="ripple"></span>
      
      <div class="merit-layer">
        <span
          v-for="item in merits"
          :key="item.id"
          class="merit"
          :class="item.typeClass"
          :style="{ left: `calc(50% + ${item.offset}px)` }"
        >
          {{ item.text }}
        </span>
      </div>
    </div>
  </div>
 </template>

<script setup>
import { useWoodfish } from "./composables/useWoodfish";
import { WOODFISH_STATS } from "./composables/woodfishConfig";

// 纯静态配置
const speedOptions = [
  { label: "0.5s", value: 500 },
  { label: "1s", value: 1000 },
  { label: "2s", value: 2000 },
];

// 一键解构所有逻辑
const {
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
  resetCounts,
  handleManualKnock,
  onManualVolumeChange,
  onAutoVolumeChange
} = useWoodfish();
</script>

