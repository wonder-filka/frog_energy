import type { Metadata } from "next";
import { ButtonHome } from "./components/button-home";
import { RitualSection } from "./components/description";
import { FAQ } from "./components/faq";
import { Features } from "./components/features";
import { Footer } from "./components/footer";
import { Hero } from "./components/hero";
import { VideoSection } from "./components/video";

export async function generateMetadata({ params }: PageProps<"/[lang]">): Promise<Metadata> {
  const { lang } = await params;
  const canonicalUrl = `https://frog-energy.com/${lang}`;

  return {
    title: "Frog Energy",
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: "Frog Energy | Manifest Your Dreams with Energy Boards",
      description: "Buy an energy slot and manifest your goals for money, love, and luck.",
      url: canonicalUrl,
      siteName: "Frog Energy",
      images: [
        {
          url: "https://frog-energy.com/og-image.jpg",
          width: 1200,
          height: 630,
        },
      ],
      locale: lang,
      type: "website",
    },
  };
}

export default function IndexPage() {
  return (
    <>
      <Hero />
      <Features />
      <RitualSection />
      <VideoSection />
      <ButtonHome />
      <FAQ />
      <Footer />
    </>
  );
}
