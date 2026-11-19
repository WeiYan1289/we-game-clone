/**
 * Official WeGame installers, as published in WeGame's own public site config
 * (`wegame_home_configs.js` → `new_downloads`, read 2026-11-19). Linking to the
 * vendor's CDN means the button downloads exactly what the original site does.
 */
export const DOWNLOADS = {
  windows: "https://dldir1.qq.com/tgc/wegame/miniloader/WeGameMiniLoader.std.7.06.27.1446.exe",
  macIntel: "https://down.qq.com/wg/wegamemac/distribution/1.0.7/2fe0241428e4c37134c471a3c9583844/WeGame-1.0.7-x64.dmg",
  macArm: "https://down.qq.com/wg/wegamemac/distribution/1.0.7/arm64/d2bb8a721f8e3d630d4c3e498613c71b/WeGame-1.0.7-arm64.dmg",
} as const;
