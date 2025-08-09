import { Providers } from './providers';
import "./globals.css";
import { Inter } from "next/font/google";
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata = {
  title: "Become a part of BlockDag Network",
  description: "Blockdag is a decentralized, scalable, and secure blockchain platform designed for high-performance applications.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" data-arp="">
      <body className={`${inter.variable} antialiased`} cz-shortcut-listen="true" 
      data-new-gr-c-s-check-loaded="14.1246.0"
      data-gr-ext-installed="">
        <Providers>
            {children}
        </Providers> 
      </body>
    </html>
  );
}
