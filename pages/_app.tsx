import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { useEffect } from "react";
import { useRouter } from "next/router";
import { Chakra_Petch, Barlow, JetBrains_Mono, Outfit, Space_Grotesk, DM_Sans } from "next/font/google";
import SmoothScroll from "@/components/SmoothScroll";
import { NAV_HEIGHT_PX } from "@/components/Nav";

const chakraPetch = Chakra_Petch({
  variable: "--font-chakra-petch",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const barlow = Barlow({
  variable: "--font-barlow",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();

  useEffect(() => {
    const onRouteChange = (url: string) => {
      // Preserve in-page hash targets (e.g. /apply#apply-form) — those need
      // to scroll to the element, not the top.
      if (url.includes('#')) return;
      // Lenis manages its own scroll state separate from window.scrollY.
      // Calling window.scrollTo doesn't sync Lenis's internal target/animated
      // values, so the page visually stays at the previous offset. Drive
      // Lenis directly when it's available; fall back to window otherwise.
      const lenis = window.__lenis;
      if (lenis) {
        lenis.scrollTo(0, { immediate: true, force: true });
      } else {
        window.scrollTo(0, 0);
      }
    };
    router.events.on('routeChangeComplete', onRouteChange);
    return () => router.events.off('routeChangeComplete', onRouteChange);
  }, [router.events]);

  // Expose nav height to CSS so calc() expressions in stylesheets stay in
  // sync with the JS constant. CSS provides a 57px fallback for first paint.
  useEffect(() => {
    document.documentElement.style.setProperty('--nav-height', `${NAV_HEIGHT_PX}px`);
  }, []);

  return (
    <div className={`${chakraPetch.variable} ${barlow.variable} ${jetbrainsMono.variable} ${outfit.variable} ${spaceGrotesk.variable} ${dmSans.variable} font-body`}>
      <SmoothScroll>
        <Component {...pageProps} />
      </SmoothScroll>
    </div>
  );
}
