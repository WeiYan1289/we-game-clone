import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Logo } from "@/components/ui/Logo";
import { LINK_SLUGS, ORIGINAL_LINKS } from "@/data/links";
import { isLocale, localePath } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { OriginalLinkActions } from "./OriginalLinkActions";
import styles from "./go.module.css";

/** One static page per link (× each locale from the parent layout). */
export function generateStaticParams() {
  return LINK_SLUGS.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps<"/[lang]/go/[slug]">): Promise<Metadata> {
  const { lang, slug } = await params;
  const link = ORIGINAL_LINKS[slug];
  if (!isLocale(lang) || !link) return {};
  const dict = getDictionary(lang);
  return { title: `${link.label(dict)} · ${dict.redirect.title}`, robots: { index: false } };
}

/**
 * Interstitial for buttons that lead to pages this mockup doesn't recreate:
 * names the destination, shows the original URL and opens it in a new tab.
 */
export default async function GoPage({ params }: PageProps<"/[lang]/go/[slug]">) {
  const { lang, slug } = await params;
  const link = ORIGINAL_LINKS[slug];
  if (!isLocale(lang) || !link) notFound();
  const dict = getDictionary(lang);
  const t = dict.redirect;

  return (
    <main className={styles.page}>
      <div className={styles.card}>
        <a href={localePath(lang)} className={styles.logo} aria-label={dict.header.homeLabel}>
          <Logo height={34} />
        </a>
        <p className={styles.eyebrow}>{t.eyebrow}</p>
        <h1 className={styles.title}>{t.title}</h1>
        <p className={styles.body}>{t.body}</p>

        <dl className={styles.destination}>
          <dt>{t.destination}</dt>
          <dd className={styles.label}>{link.label(dict)}</dd>
        </dl>

        <OriginalLinkActions
          url={link.url}
          isSearch={slug === "search"}
          labels={{ open: t.open, newTab: t.newTab, copy: t.copy, copied: t.copied }}
        />

        <a href={localePath(lang)} className={styles.back}>
          ← {t.back}
        </a>
      </div>
      <p className={styles.disclaimer}>{dict.footer.disclaimer}</p>
    </main>
  );
}
