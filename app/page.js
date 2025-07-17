"use client";
import { MainComponent } from "@/component/main";
import Head from "next/head";
export default function Home() {
  return (
    <>
      <Head>
        <title>Skills2Evolve - Learn, Evolve and Secure Your Future</title>
        <meta
          name="description"
          content="Discover insights, guides and best practices to enhance your skills and secure your future with Skills2Evolve."
        />
        <meta
          name="keywords"
          content="skills development, professional growth, learning, career evolution"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />

        {/* Open Graph / Social Media Meta Tags */}
        <meta
          property="og:title"
          content="Skills2Evolve - Learn, Evolve and Secure Your Future"
        />
        <meta
          property="og:description"
          content="Discover insights, guides and best practices to enhance your skills and secure your future."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://skills2evolve.com" />
        <meta
          property="og:image"
          content="https://skills2evolve.com/og-image.jpg"
        />

        {/* Twitter Meta Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content="Skills2Evolve - Learn, Evolve and Secure Your Future"
        />
        <meta
          name="twitter:description"
          content="Discover insights, guides and best practices to enhance your skills and secure your future."
        />
        <meta
          name="twitter:image"
          content="https://skills2evolve.com/twitter-image.jpg"
        />
      </Head>
      <MainComponent />
    </>
  );
}
