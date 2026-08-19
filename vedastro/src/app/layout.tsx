import type { Metadata } from "next";
import "./globals.css";
import HydrationProvider from "../components/common/HydrationProvider";
import { ThemeProvider } from "../context/ThemeContext";
import { SocketProvider } from "../context/SocketProvider";
import LayoutContent from "../app/LayoutContent";
import AuthModalProvider from "../components/auth/AuthModalProvider";

export const metadata: Metadata = {
  title: "VedAstro - Cosmic Alignments",
  description: "Connect with verified practitioners.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-slate-950 text-white antialiased">
        <ThemeProvider>
          <HydrationProvider>
            <SocketProvider>
              <LayoutContent>{children}</LayoutContent>
              <AuthModalProvider />
            </SocketProvider>
          </HydrationProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}