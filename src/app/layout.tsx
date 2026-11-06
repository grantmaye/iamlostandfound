import type { Metadata } from "next";
import { Header, Social } from "@/components/header";
import "./globals.css";
import "./editorial.css";
export const metadata: Metadata = {
  icons: { icon: "/favicon.jpg" },
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  ),
  title: {
    default: "Home - I am Lost and Found",
    template: "%s - I am Lost and Found",
  },
  description:
    "I am Lost and Found is a website that inspires travel. Discover hidden hotels, restaurants and where in the world to go on your next adventure.",
};
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Header />
        {children}
        <footer className="site-footer">
          <div className="shell">
            <Social />
            <p>
              © I am Lost and Found, 2023&nbsp;
              <span className="footer-separator">
                /{" "}
                <span className="footer-credit">
                  Created with ♥ by{" "}
                  <a href="https://gitpixels.com">GITPIXELS</a>
                </span>
              </span>
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
