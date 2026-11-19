import Image from "next/image";
import { FOOTER_COLUMNS } from "@/data/navigation";
import { Icon } from "../ui/Icon";
import { Logo } from "../ui/Logo";
import styles from "./Footer.module.css";

const SOCIALS = [
  { label: "微信", qr: "/images/qrcode-wechat.jpg", hint: "关注微信公众号" },
  { label: "视频号", qr: "/images/qrcode-wechat-video.jpg", hint: "关注微信视频号" },
  { label: "微博" },
  { label: "bilibili" },
];

/** Server component: purely static content, QR popovers are CSS-only (:hover / :focus-within). */
export function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.banner}>
        <Image src="/images/games.avif" alt="" fill sizes="100vw" className={styles.bannerImg} />
        <p className={styles.slogan} aria-label="WeGame More">
          WEGAME&nbsp;MO<span className={styles.chevron}>&gt;</span>RE
        </p>
      </div>

      <div className={styles.body}>
        <div className={styles.columns}>
          <section aria-labelledby="ft-download">
            <h2 id="ft-download" className={styles.heading}>
              下载客户端
            </h2>
            <ul className={styles.list}>
              {FOOTER_COLUMNS.download.map((l, i) => (
                <li key={l.label}>
                  <a href={l.href} className={styles.link}>
                    <Icon name={i === 0 ? "windows" : "apple"} size={14} />
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </section>

          <section aria-labelledby="ft-social">
            <h2 id="ft-social" className={styles.heading}>
              官方渠道
            </h2>
            <ul className={styles.list}>
              {SOCIALS.map((s) => (
                <li key={s.label} className={styles.social}>
                  <a href="#" className={styles.link}>
                    {s.label}
                  </a>
                  {s.qr && (
                    <div className={styles.qr} role="tooltip">
                      <Image src={s.qr} alt={`${s.label}二维码`} width={112} height={112} />
                      <span>扫描二维码</span>
                      <span>{s.hint}</span>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </section>

          <section aria-labelledby="ft-friends">
            <h2 id="ft-friends" className={styles.heading}>
              友情链接
            </h2>
            <ul className={`${styles.list} ${styles.grid}`}>
              {FOOTER_COLUMNS.friends.map((l) => (
                <li key={l.label}>
                  <a href={l.href} className={styles.link}>
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </section>

          <div className={styles.brand}>
            <Logo height={40} />
          </div>
        </div>

        <div className={styles.legal}>
          <ul className={styles.legalLinks}>
            {FOOTER_COLUMNS.legal.map((label) => (
              <li key={label}>
                <a href="#">{label}</a>
              </li>
            ))}
          </ul>
          <p>COPYRIGHT © 2017 – 2026 TENCENT. ALL RIGHTS RESERVED. 腾讯公司 版权所有</p>
          <p className={styles.disclaimer}>
            Assessment mockup · not affiliated with Tencent or WeGame. Built for a frontend engineering challenge;
            all trademarks and game artwork belong to their respective owners.
          </p>
        </div>
      </div>
    </footer>
  );
}
