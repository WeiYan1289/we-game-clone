import type { Dictionary } from "@/i18n/dictionaries";

export type GameId = keyof Dictionary["games"];

export const VIDEO_CDN = "https://wegame.gtimg.com/g.55555-r.c4663/wegame-home";

export const posterSrc = (id: GameId) => `/images/posters/${id}.png`;

/**
 * "大作云集" poster stream, modelled on the original: every poster starts
 * small behind the title and flies out towards an edge, growing and fading,
 * on an 18s loop; posters are staggered so the stream never empties.
 * `from` is the start offset from the frame centre and `to` the flight
 * vector, both in design units on the 1440×900 frame.
 */
export const POSTER_STREAM: { id: GameId; from: [number, number]; to: [number, number] }[] = [
  { id: "sanguosha", from: [-90, -40], to: [-560, -300] },
  { id: "cala", from: [80, -50], to: [520, -310] },
  { id: "bt", from: [-70, 60], to: [-520, 300] },
  { id: "rainbow", from: [90, 50], to: [560, 290] },
  { id: "mingchao", from: [40, -70], to: [640, -120] },
  { id: "heishenhua", from: [-40, 70], to: [-640, 110] },
  { id: "poe", from: [60, 70], to: [300, 360] },
  { id: "heping", from: [-60, -70], to: [-300, -360] },
  { id: "df", from: [100, -10], to: [620, 40] },
  { id: "lol", from: [-100, 10], to: [-620, -40] },
  { id: "val", from: [20, 80], to: [-120, 380] },
  { id: "cf", from: [-20, -80], to: [140, -380] },
  { id: "dnf", from: [110, 30], to: [480, 200] },
  { id: "nba", from: [-110, -30], to: [-480, -200] },
  { id: "ca", from: [-80, 40], to: [-420, 260] },
];

/** One full flight (the original's --animation-duration). */
export const POSTER_LOOP_S = 18;

type Art = { src: string; width: number; height: number };

/** A game assistant: character art beside a screenshot of the in-client tool. */
export type GameFeatureArt = { kind: "game"; layout: "val" | "lol"; bg: string; texture: string; role: Art; inner: Art };

/** The AI assistant: a recap panel whose text types itself out, guarded by the sphere mascot. */
export type AiFeatureArt = {
  kind: "ai";
  bg: string;
  texture: string;
  panel: { hd: Art; bd: string; text: string };
  avatar: string;
  lights: string;
  /** One icon per `dict.feature.aiPoints` entry. */
  icons: string[];
};

/** Art for the three assistant panels, in the same order as `dict.feature.items`. */
export const FEATURE_ART: (GameFeatureArt | AiFeatureArt)[] = [
  {
    kind: "game",
    layout: "val",
    bg: "/images/feature-bg-1.png",
    texture: "/images/feature-texture-1.png",
    role: { src: "/images/feature-role-1.png", width: 1166, height: 1000 },
    inner: { src: "/images/feature-inner-1.png", width: 1341, height: 822 },
  },
  {
    kind: "game",
    layout: "lol",
    bg: "/images/feature-bg-2.png",
    texture: "/images/feature-texture-2.png",
    role: { src: "/images/feature-role-2.png", width: 1524, height: 1045 },
    inner: { src: "/images/feature-inner-2.png", width: 980, height: 1960 },
  },
  {
    kind: "ai",
    bg: "/images/feature-bg-4.png",
    texture: "/images/feature-texture-4.png",
    panel: {
      hd: { src: "/images/feature-inner-4-hd.png", width: 351, height: 176 },
      bd: "/images/feature-inner-4-bd.png",
      text: "/images/feature-inner-4-bd-text.png",
    },
    avatar: "/images/feature-ai-avatar.png",
    lights: "/images/feature-ai-lights.png",
    icons: [1, 2, 3].map((n) => `/images/feature-ai-icon-${n}.svg`),
  },
];

/** Squad picker art, in the same order as `dict.teamup.roles`. */
export const TEAM_ART = [1, 2, 3, 4, 5].map((n) => ({
  avatar: `/images/teamup-avatar-0${n}.png`,
  hero: `/images/teamup-hero-0${n}.png`,
}));
