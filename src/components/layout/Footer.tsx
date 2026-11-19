import Image from "next/image";
import { goPath } from "@/data/links";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import { DownloadButton } from "../download/DownloadButton";
import { Logo } from "../ui/Logo";
import styles from "./Footer.module.css";

type Props = { locale: Locale; dict: Dictionary["footer"]; downloadDict: Dictionary["download"] };

/**
 * Last paging step ("section-more" on the live site): the WEGAME MORE banner
 * over a slowly scrolling wall of game art, then link columns. On arrival the
 * wordmark rises and the columns fade up. QR popovers are CSS-only.
 */
export function Footer({ locale, dict, downloadDict }: Props) {
  const socials = [
    { label: dict.social.wechat, qr: "/images/qrcode-wechat.jpg", hint: dict.followWechat },
    { label: dict.social.video, qr: "/images/qrcode-wechat-video.jpg", hint: dict.followVideo },
    { label: dict.social.weibo, href: goPath(locale, "weibo") },
    { label: dict.social.bilibili, href: goPath(locale, "bilibili") },
  ];

  return (
    <footer className={styles.footer} data-panel="">
      <div className={styles.banner}>
        {/* Wall of game art, scrolling sideways on a 30s loop (two copies → seamless) */}
        <div className={styles.wall} aria-hidden="true" />
        <Image src="/images/logo.svg" alt={dict.bannerAlt} width={1680} height={162} className={styles.wordmark} />
      </div>

      <div className={styles.body}>
        <div className={styles.columns}>
          <section aria-labelledby="ft-download">
            <h2 id="ft-download" className={styles.heading}>
              {dict.download}
            </h2>
            <ul className={styles.list}>
              <li>
                <DownloadButton variant="link" platform="windows" labels={{ pc: dict.windows, mac: dict.windows }} dict={downloadDict} />
              </li>
              <li>
                <DownloadButton variant="link" platform="mac" labels={{ pc: dict.mac, mac: dict.mac }} dict={downloadDict} />
              </li>
            </ul>
          </section>

          <section aria-labelledby="ft-social">
            <h2 id="ft-social" className={styles.heading}>
              {dict.channels}
            </h2>
            <ul className={styles.list}>
              {socials.map((s) => (
                <li key={s.label} className={styles.social}>
                  {s.href ? (
                    <a href={s.href} className={styles.link}>
                      {s.label}
                    </a>
                  ) : (
                    // WeChat channels have no web page — the QR code is the destination.
                    <button type="button" className={styles.link}>
                      {s.label}
                    </button>
                  )}
                  {s.qr && (
                    <div className={styles.qr} role="tooltip">
                      <Image src={s.qr} alt={s.label} width={112} height={112} />
                      <span>{dict.scanQr}</span>
                      <span>{s.hint}</span>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </section>

          <section aria-labelledby="ft-friends">
            <h2 id="ft-friends" className={styles.heading}>
              {dict.friends}
            </h2>
            <ul className={`${styles.list} ${styles.grid}`}>
              {dict.friendLinks.map((label, i) => (
                <li key={label}>
                  <a href={goPath(locale, `friend-${i}`)} className={styles.link}>
                    {label}
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
            {dict.legal.map((label, i) => (
              <li key={label}>
                <a href={goPath(locale, `legal-${i}`)}>{label}</a>
              </li>
            ))}
          </ul>
          <p>{dict.copyright}</p>
          <p className={styles.disclaimer}>{dict.disclaimer}</p>
        </div>
      </div>
    </footer>
  );
}
