import { Barlow, Barlow_Condensed } from "next/font/google";
import "./globals.css";

const barlow = Barlow({
  variable: "--font-body", // Assign each font to custom css property
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap", // Allows fallback text to display while the font loads
});

const barlowCondensed = Barlow_Condensed({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

export const metadata = {
  title: "Grit Fitness Studio",
  description: "Get the most out of your training with worldclass trainers, customized training plans and health tips.",
  manifest: "/site.webmanifest",
  icons: { // Replaces favicon links in index.html
    icon: [
      {
        url: "/icons/light/favicon.ico",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/icons/dark/favicon.ico",
        media: "(prefers-color-scheme: dark)",
      },
      {
        url: "/icons/light/favicon-16x16.png",
        sizes: "16x16",
        type: "image/png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/icons/dark/favicon-16x16.png",
        sizes: "16x16",
        type: "image/png",
        media: "(prefers-color-scheme: dark)",
      },
      {
        url: "/icons/light/favicon-32x32.png",
        sizes: "32x32",
        type: "image/png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/icons/dark/favicon-32x32.png",
        sizes: "32x32",
        type: "image/png",
        media: "(prefers-color-scheme: dark)",
      },
    ],
    apple: "/icons/apple-touch-icon.png",
  }
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${barlow.variable} ${barlowCondensed.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
