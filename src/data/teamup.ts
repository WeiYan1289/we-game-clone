export type TeamRole = { id: string; role: string; avatar: string; hero: string };

export const TEAM_ROLES: TeamRole[] = [
  { id: "adc", role: "射手位", avatar: "/images/teamup-avatar-01.png", hero: "/images/teamup-hero-01.png" },
  { id: "mid", role: "中路", avatar: "/images/teamup-avatar-02.png", hero: "/images/teamup-hero-02.png" },
  { id: "lead", role: "队长 · 发起开黑", avatar: "/images/teamup-avatar-03.png", hero: "/images/teamup-hero-03.png" },
  { id: "support", role: "辅助", avatar: "/images/teamup-avatar-04.png", hero: "/images/teamup-hero-04.png" },
  { id: "jungle", role: "打野", avatar: "/images/teamup-avatar-05.png", hero: "/images/teamup-hero-05.png" },
];

export const COLLEGE_FEATURES = [
  { title: "快捷认证", text: "学信认证一键通过，福利即刻到账", icon: "⚡" },
  { title: "大佬聚集", text: "轻松找到本校高手，组队不再难", icon: "🏛" },
  { title: "同校竞技", text: "解锁校园专属排行榜，为母校而战", icon: "🏆" },
];

export const CHAT_MESSAGES = [
  "蛋蛋君已完成高校认证",
  "三角洲求大佬带飞",
  "让我看看本校榜一是谁",
  "这周的福利到手啦",
  "找个校友一起开黑",
  "下次一定要打赢隔壁",
];
