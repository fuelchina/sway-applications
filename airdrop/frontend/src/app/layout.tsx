import type { Metadata } from "next";
import "./globals.css";
import { Inter as FontSans } from "next/font/google"
import { cn } from "@/lib/utils"
import Provider from "@/components/Provider";
import Header from "@/components/Header";


const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
})

export const metadata: Metadata = {
  title: "Fuel Airdrop Example",
  description: "Fuel Airdrop example",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={
          cn(
            "min-h-screen bg-background font-sans antialiased",
            fontSans.variable
          )}
      >
        <Provider>
          <div className="max-w-7xl mx-auto px-8">
            <Header />
            {children}
          </div>
        </Provider>
      </body>
    </html>
  );
}
