import type { Metadata } from "next";
import { Heebo } from "next/font/google";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { FloatingWhatsApp } from "@/components/layout/SocialLinks";
import "./globals.css";

const heebo = Heebo({
  subsets: ["hebrew", "latin"],
  variable: "--font-heebo",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "המטבח של יפה - מתכונים ביתיים טעימים",
    template: "%s | המטבח של יפה",
  },
  description:
    "מתכונים ביתיים, טעימים ופשוטים להכנה. הצטרפו למטבח של יפה וגלו מתכונים מיוחדים.",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
  ),
};

async function ClerkWrapper({ children }: { children: React.ReactNode }) {
  if (!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY) {
    return <>{children}</>;
  }
  const { ClerkProvider } = await import("@clerk/nextjs");
  const { heIL } = await import("@clerk/localizations");
  return <ClerkProvider localization={heIL}>{children}</ClerkProvider>;
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkWrapper>
      <html lang="he" dir="rtl" className={heebo.variable}>
        <body className="font-sans min-h-screen flex flex-col">
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
          <FloatingWhatsApp />
        </body>
      </html>
    </ClerkWrapper>
  );
}
