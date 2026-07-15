import type { Metadata } from "next";
import { Yellowtail, Playfair_Display, Jost } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/lib/cart-context";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";

const yellowtail = Yellowtail({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-script",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
  variable: "--font-display",
});

const jost = Jost({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-body",
});

export const metadata: Metadata = {
  title: "The Sugarland | A mouthful treat for everyone",
  description:
    "Home-based bakery in Karachi serving custom and premade cakes, cupcakes, and pastries. Order online, pay on delivery.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body
        className={`${yellowtail.variable} ${playfair.variable} ${jost.variable} font-body bg-cream text-ink antialiased`}
      >
        <CartProvider>
          <SiteHeader />
          <main>{children}</main>
          <SiteFooter />
        </CartProvider>
      </body>
    </html>
  );
}
