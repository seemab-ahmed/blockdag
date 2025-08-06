"use client";
import { Login } from "../component/login";
import Head from "next/head";
import { useAuthRedirect } from "../hooks/useAuthRedirect";

export default function Home() {
  useAuthRedirect();
  return (
    <>
      <Head>
        <title>BlockDag - Your Gateway to the Future</title>
        <meta
          name="description"
          content="BlockDag is your gateway to the future of blockchain technology. Explore, learn, and evolve with us."
        />
        <meta
          name="keywords"
          content="blockchain, technology, innovation, future"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />

        {/* Open Graph / Social Media Meta Tags */}
        <meta
          property="og:title"
          content="BlockDag - Your Gateway to the Future"
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
      <Login />
      {/* <ConnectOnly /> */}
    </>
  );
}
