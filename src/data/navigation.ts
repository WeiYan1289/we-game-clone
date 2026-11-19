export type NavLink = { label: string; href: string };

/** Page sections, in order. Drives the side dots, mobile drawer and scroll-spy. */
export const SECTIONS = [
  { id: "kv", label: "首页" },
  { id: "topic", label: "大作" },
  { id: "frame", label: "性能" },
  { id: "feature", label: "助手" },
  { id: "teamup", label: "开黑" },
  { id: "college", label: "高校" },
] as const;

export type SectionId = (typeof SECTIONS)[number]["id"];

export const PRIMARY_NAV: NavLink[] = [
  { label: "首页", href: "#kv" },
  { label: "商店", href: "#topic" },
];

export const DEVELOPER_MENU: NavLink[] = [
  { label: "正式发行游戏", href: "#" },
  { label: "先锋测试游戏", href: "#" },
];

export const SEARCH_SUGGESTIONS = [
  "仙境传说起源",
  "怀旧版预创角开启",
  "三角洲行动",
  "无畏契约",
  "鸣潮",
];

export const FOOTER_COLUMNS = {
  download: [
    { label: "Windows版", href: "#" },
    { label: "Mac版（测试版）", href: "#" },
  ],
  friends: [
    { label: "INDIENOVA", href: "#" },
    { label: "腾讯GWB", href: "#" },
    { label: "腾讯动漫", href: "#" },
    { label: "腾讯视频", href: "#" },
  ],
  legal: [
    "关于腾讯",
    "服务条款",
    "软件许可及服务协议",
    "隐私保护指引",
    "儿童隐私保护指引",
    "网络游戏行业防沉迷自律公约",
    "侵权通知",
    "广告服务",
    "腾讯招聘",
    "客服中心",
    "联系我们",
  ],
};
