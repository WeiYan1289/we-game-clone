export type Feature = {
  id: string;
  label: string;
  eyebrow: string;
  title: string;
  description: string;
  bg: string;
  role: { src: string; width: number; height: number };
  inner: { src: string; width: number; height: number };
  badge?: string;
};

export const FEATURES: Feature[] = [
  {
    id: "guide",
    label: "点位教学",
    eyebrow: "无畏契约助手",
    title: "点位教学",
    description: "精选地图道具点位，跟着视频一步步学会投掷，开局即占优势。",
    bg: "/images/feature-bg-1.png",
    role: { src: "/images/feature-role-1.png", width: 1166, height: 1000 },
    inner: { src: "/images/feature-inner-1.png", width: 1341, height: 822 },
  },
  {
    id: "runes",
    label: "符文与装备推荐",
    eyebrow: "英雄联盟助手",
    title: "符文与装备推荐",
    description: "根据对局阵容实时推荐符文与出装，一键导入，告别手忙脚乱。",
    bg: "/images/feature-bg-2.png",
    role: { src: "/images/feature-role-2.png", width: 1524, height: 1045 },
    inner: { src: "/images/feature-inner-2.png", width: 980, height: 1960 },
  },
  {
    id: "ai",
    label: "AI 游戏助手",
    eyebrow: "三角洲行动助手",
    title: "AI 游戏助手",
    description: "改枪方案、战局复盘、攻略问答，AI 助手随叫随到。",
    bg: "/images/feature-bg-3.png",
    role: { src: "/images/feature-role-3.png", width: 1166, height: 1000 },
    inner: { src: "/images/feature-inner-3.png", width: 603, height: 693 },
    badge: "/images/feature-ai-avatar.png",
  },
];

export const PERFORMANCE_STATS = [
  { label: "界面表现", value: "更丝滑" },
  { label: "游戏体验", value: "零影响" },
  { label: "后台稳定", value: "不掉帧" },
];
