export type Game = { id: string; name: string; poster: string };

const p = (id: string, name: string): Game => ({ id, name, poster: `/images/posters/${id}.png` });

export const GAMES: Game[] = [
  p("lol", "英雄联盟"),
  p("df", "三角洲行动"),
  p("val", "无畏契约"),
  p("mingchao", "鸣潮"),
  p("cf", "穿越火线"),
  p("dnf", "地下城与勇士"),
  p("heishenhua", "黑神话：悟空"),
  p("poe", "流放之路"),
  p("heping", "和平精英"),
  p("nba", "NBA2K Online 2"),
  p("ca", "暗区突围：无限"),
  p("sanguosha", "三国杀"),
  p("bt", "生死狙击2"),
  p("rainbow", "彩虹岛"),
  p("cala", "卡拉彼丘"),
];

/** Rotating call-to-action in the topic section. */
export const TOPIC_PILLS = ["尝新鲜的", "搜想玩的", "看热门的"];

export const VIDEO_CDN = "https://wegame.gtimg.com/g.55555-r.c4663/wegame-home";
