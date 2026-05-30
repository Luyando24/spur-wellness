import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ChatWidget from "@/components/ChatWidget";
import { CartProvider } from "@/components/CartContext";
import CartDrawer from "@/components/CartDrawer";
import { AuthProvider } from "@/components/AuthContext";
import { CurrencyProvider } from "@/components/CurrencyContext";
import { StoreSettingsProvider } from "@/components/StoreSettingsContext";
import NewsletterPopup from "@/components/NewsletterPopup";
import BottomNav from "@/components/BottomNav";

export const metadata: Metadata = {
  title: "Spur Wellness | Premium Fitness Equipment & Turf",
  description: "Modern, minimalistic fitness equipment and artificial turf designed for high performance. Explore our collection of premium kettlebells, resistance bands, mats, balls, and turf.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="light" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Oswald:wght@300;400;500;600;700&family=Inter:wght@300;400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body
        suppressHydrationWarning
        className={`antialiased font-sans min-h-screen flex flex-col bg-white text-black`}
      >
        <StoreSettingsProvider>
          <AuthProvider>
            <CurrencyProvider>
              <CartProvider>
                <Navbar />
                <main className="flex-grow pb-16 md:pb-0">
                  {children}
                </main>
                <Footer />
                <BottomNav />
                <ChatWidget />
                <CartDrawer />
                <NewsletterPopup />
              </CartProvider>
            </CurrencyProvider>
          </AuthProvider>
        </StoreSettingsProvider>
      </body>
    </html>
  );
}
