import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
import { OfflineBanner } from "@/components/pwa/OfflineBanner";
import { ServiceWorkerRegister } from "@/components/pwa/ServiceWorkerRegister";
import { isLocale, LOCALES, localePath } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import "../globals.css";

/**
 * Pre-render every locale at build time. Unknown locales 404 via the
 * isLocale() guard below (`dynamicParams` isn't allowed with cacheComponents).
 */
export function generateStaticParams() {
  return LOCALES.map((lang) => ({ lang }));
}

export async function generateMetadata({ params }: LayoutProps<"/[lang]">): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const { meta } = getDictionary(lang);
  return {
    title: meta.title,
    description: meta.description,
    applicationName: "WeGame Portal Mockup",
    alternates: {
      canonical: localePath(lang),
      languages: Object.fromEntries(LOCALES.map((l) => [l, localePath(l)])),
    },
    appleWebApp: { capable: true, title: "WeGame", statusBarStyle: "black-translucent" },
    icons: {
      icon: [
        { url: "/icons/favicon-32.png", sizes: "32x32", type: "image/png" },
        { url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      ],
      apple: [{ url: "/icons/apple-touch-icon.png", sizes: "180x180" }],
    },
    formatDetection: { telephone: false },
  };
}

export const viewport: Viewport = {
  themeColor: "#0b0b0d",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default async function RootLayout({ children, params }: LayoutProps<"/[lang]">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const dict = getDictionary(lang);

  return (
    <html lang={lang}>
      <body>
        {children}
        <OfflineBanner text={dict.pwa.offline} />
        <ServiceWorkerRegister />
      </body>
    </html>
  );
}
