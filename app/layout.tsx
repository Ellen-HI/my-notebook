import type { Metadata, Viewport } from "next";
import { Caveat } from "next/font/google";
import "./globals.css";

import ThemeProvider from "@/components/ThemeProvider";
import { Toaster } from "react-hot-toast";

const caveat = Caveat({
  weight: "400",
  subsets: ["cyrillic", "latin"],
});

export const metadata: Metadata = {
  title: "My Notebook",
  description: "A simple digital notebook for organizing daily notes.",
  authors: [{ name: "Ellen" }],
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#f7f1e3",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="uk" suppressHydrationWarning data-scroll-behavior="smooth">
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  const settings = localStorage.getItem('notebook-settings');
                  let theme = 'light';
                  let language = 'uk';
                  if (settings) {
                    const parsed = JSON.parse(settings);
                    if (parsed.state) {
                      theme = parsed.state.theme || 'light';
                      language = parsed.state.language || 'uk';
                    }
                  }
                  document.documentElement.className = theme;
                  document.documentElement.lang = language;
                } catch (e) {
                  document.documentElement.className = 'light';
                  document.documentElement.lang = 'uk';
                }
              })();
            `,
          }}
        />
      </head>
      <body className={caveat.className}>
        <ThemeProvider>
          {children}
          <Toaster
            position="top-center"
            toastOptions={{
              duration: 3000,
              style: {
                border: "1px solid #c8c2b5",
                borderRadius: "255px 15px 225px 15px / 15px 225px 15px 255px",
                padding: "16px",
                background: "#c8c2b5",
                color: "#2c2316",
              },
              success: {
                icon: "🥰",
              },
              error: {
                icon: "🫩",
              },
            }}
          />
        </ThemeProvider>
      </body>
    </html>
  );
}
