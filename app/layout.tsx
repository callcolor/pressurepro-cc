import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { UserProvider } from "@/context/UserContext";
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import Link from "next/link";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Tech Conference Explorer",
  description: "Discover and manage upcoming tech conferences",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const messages = await getMessages();

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <NextIntlClientProvider messages={messages}>
          <UserProvider>
            {/* Navigation */}
            <nav className="bg-white shadow-md">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                  <Link href="/" className="flex items-center">
                    <span className="text-2xl font-bold text-blue-600">Tech Conference Explorer</span>
                  </Link>
                  <div className="flex gap-4 items-center">
                    <Link
                      href="/"
                      className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                    >
                      Conferences
                    </Link>
                    <Link
                      href="/dashboard"
                      className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                    >
                      Dashboard
                    </Link>
                    <Link
                      href="/admin"
                      className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                    >
                      Admin
                    </Link>
                    <LanguageSwitcher />
                  </div>
                </div>
              </div>
            </nav>

            {/* Main Content */}
            <main className="min-h-[calc(100vh-4rem)]">
              {children}
            </main>

            {/* Footer */}
            <footer className="bg-gray-800 text-white py-8 mt-12">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <p>&copy; 2024 Tech Conference Explorer. All rights reserved.</p>
              </div>
            </footer>
          </UserProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
