import type { Metadata, Viewport } from "next";
import { Inter, Vazirmatn } from "next/font/google";
import { QueryProvider } from "@/providers/QueryProvider";
import { AppProvider } from "@/context/AppContext";
import "@/app/globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });
const vazirmatn = Vazirmatn({ subsets: ["arabic"], variable: "--font-fa" });

export const metadata: Metadata = {
  title: "FreelanceOS - Workspace",
  description: "A keyboard-first production-grade freelance operations system.",
  robots: "index, follow",
};

export const viewport: Viewport = {
  themeColor: "#0a0a0a",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${vazirmatn.variable}`}>
      <body className="bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 antialiased">
        <QueryProvider>
          <AppProvider>{children}</AppProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
