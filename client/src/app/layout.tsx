import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AIChatbotWidget from "@/components/AIChatbotWidget";
import CartDrawer from "@/components/CartDrawer";
import ToastContainer from "@/components/ToastContainer";

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "ArogyaCare+ Health Platform",
  description:
    "Complete Healthcare, Delivered & Booked Instantly. Order authentic medicines & certified medical hardware, consult verified multi-specialty doctors across 7 days, and chat with your AI health companion.",
  keywords:
    "ArogyaCare+, healthcare, medicines, doctor consultation, pharmacy, health devices, appointments, telehealth",
  icons: {
    icon: "https://lh3.googleusercontent.com/aida/AEtjO1UgD4QbDGJ9GDNhQ66TmcODNXT67vwE3ybZ5XSzV_wJoDx888v7lKZrjNVAxeY8kcOmBRnjxZF3o8VohzUkSSiaObAlESIPW4va6Emu5chdon5Yq4XypT_hy-etFYGrm55C4uEjXp4KgvY3W7NcoCw2b2JkaENp9uEZFo02OUKXTbvKdPek7co8yIJkYSowlQpSGhfH4mkY7ebl-o89ElverE83TVmqzA5iT64Ok4LioQaOECNSjdYqvQ",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200"
        />
      </head>
      <body className="bg-background font-body-md text-body-md text-on-surface antialiased min-h-screen flex flex-col">
        <Navbar />
        <main className="w-full bg-background min-h-screen pt-20 flex-1">
          {children}
        </main>
        <Footer />
        <CartDrawer />
        <ToastContainer />
        <AIChatbotWidget />
      </body>
    </html>
  );
}
