import type { Metadata } from "next";
import "./globals.css";
import Navbar from "./components/Navbar";

export const metadata: Metadata = {
  title: "Automated Lead Management & Email Tracking System",
  description: "Capture leads, send automated emails, and track opens and link clicks in real-time.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        {children}
        <footer className="footer">
          <div className="container">
            <p>&copy; 2026 Email Automation System. Built with Next.js, MongoDB & Nodemailer.</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
