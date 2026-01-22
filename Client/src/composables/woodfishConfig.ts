// Client/src/composables/woodfishConfig.ts

import { STORAGE_KEYS } from './storage';

export const WOODFISH_STATS = [
    {
      key: "merit",
      label: "功德",
      text: "功德+1",
      typeClass: "merit-merit",
      storageKey: STORAGE_KEYS.MERIT,
      timbre: { type: "sine", overtoneType: "triangle", overtoneGain: 0.05, detune: 2 },
    },
    {
      key: "luck",
      label: "好运",
      text: "好运+1",
      typeClass: "merit-luck",
      storageKey: STORAGE_KEYS.LUCK,
      timbre: { type: "sine", overtoneType: "sine", overtoneGain: 0.03, detune: -1 },
    },
    {
      key: "wisdom",
      label: "智慧",
      text: "智慧+1",
      typeClass: "merit-wisdom",
      storageKey: STORAGE_KEYS.WISDOM,
      timbre: { type: "sine", overtoneType: "triangle", overtoneGain: 0.04, detune: 4 },
    },
  ];