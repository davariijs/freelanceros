import type { Metadata, Viewport } from "next";
import { Inter, Vazirmatn } from "next/font/google";
import { QueryProvider } from "@/providers/QueryProvider";
import { AppProvider } from "@/context/AppContext";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { cookies } from "next/headers";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });
const vazirmatn = Vazirmatn({ subsets: ["arabic"], variable: "--font-fa" });

export const metadata: Metadata = {
  title: "FreelanceOS - Workspace",
  description: "A keyboard-first production-grade freelance operations system.",
  robots: "index, follow",
  alternates: {
    canonical: "https://freelanceos.ai",
  },
};

export const viewport: Viewport = {
  themeColor: "#0a0a0a",
  width: "device-width",
  initialScale: 1,
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const locale = (cookieStore.get("locale")?.value || "en") as "en" | "fa";
  const theme = (cookieStore.get("theme")?.value || "dark") as
    "light" | "dark" | "system";
  const dir = locale === "fa" ? "rtl" : "ltr";

  return (
    <html lang={locale} dir={dir} className={theme === "dark" ? "dark" : ""}>
      <body className="bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 antialiased">
        <QueryProvider>
          <GoogleOAuthProvider
            clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!}
            locale={locale}
          >
            <AppProvider initialLocale={locale} initialTheme={theme}>
              {children}
            </AppProvider>
          </GoogleOAuthProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
