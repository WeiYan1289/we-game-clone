import Image from "next/image";
import type { Dictionary } from "@/i18n/dictionaries";
import { DownloadButton } from "../download/DownloadButton";
import { Logo } from "../ui/Logo";
import styles from "./Footer.module.css";

type Props = { dict: Dictionary["footer"]; downloadDict: Dictionary["download"] };

/**
 * Last paging step ("section-more" on the live site): the WEGAME MORE banner
 * over a wall of game art, then link columns. QR popovers are CSS-only.
 */
export function Footer({ dict, downloadDict }: Props) {
  const socials = [
    { label: dict.social.wechat, qr: "/images/qrcode-wechat.jpg", hint: dict.followWechat },
    { label: dict.social.video, qr: "/images/qrcode-wechat-video.jpg", hint: dict.followVideo },
    { label: dict.social.weibo },
    { label: dict.social.bilibili },
  ];

  return (
    <footer className={styles.footer} data-panel="">
      <div className={styles.banner}>
        <Image src="/images/games.avif" alt="" fill sizes="100vw" className={styles.bannerImg} />
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
                  <a href="#" className={styles.link}>
                    {s.label}
                  </a>
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
              {dict.friendLinks.map((label) => (
                <li key={label}>
                  <a href="#" className={styles.link}>
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
            {dict.legal.map((label) => (
              <li key={label}>
                <a href="#">{label}</a>
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
