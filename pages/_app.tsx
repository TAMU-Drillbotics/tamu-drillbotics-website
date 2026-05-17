import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { useEffect } from "react";
import { useRouter } from "next/router";
import { Chakra_Petch, Barlow, JetBrains_Mono, Outfit, Space_Grotesk, DM_Sans } from "next/font/google";
import SmoothScroll from "@/components/SmoothScroll";

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
    const onRouteChange = () => window.scrollTo(0, 0);
    router.events.on('routeChangeComplete', onRouteChange);
    return () => router.events.off('routeChangeComplete', onRouteChange);
  }, [router.events]);

  return (
    <div className={`${chakraPetch.variable} ${barlow.variable} ${jetbrainsMono.variable} ${outfit.variable} ${spaceGrotesk.variable} ${dmSans.variable} font-body`}>
      <SmoothScroll>
        <Component {...pageProps} />
      </SmoothScroll>
    </div>
  );
}
