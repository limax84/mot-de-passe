import type { Metadata, Viewport } from "next";
import { Anton, Outfit } from "next/font/google";
import "./globals.css";
import ServiceWorker from "@/components/ServiceWorker";

const anton = Anton({
  variable: "--font-anton",
  weight: "400",
  subsets: ["latin"],
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Mot de passe — le jeu",
  description:
    "Faites deviner des mots à votre partenaire, comme dans le jeu télévisé. Duels chronométrés, finale à 3 000 €, trois niveaux de difficulté.",
  applicationName: "Mot de passe",
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Mot de passe",
  },
  icons: {
    icon: "/icons/icon-192.png",
    apple: "/icons/icon-192.png",
  },
};

export const viewport: Viewport = {
  themeColor: "#0a1638",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className={`${anton.variable} ${outfit.variable} h-full antialiased`}>
      <body className="stage min-h-dvh flex flex-col">
        <div className="relative z-10 flex min-h-dvh flex-col">{children}</div>
        <ServiceWorker />
      </body>
    </html>
  );
}
