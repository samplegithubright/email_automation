"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="navbar">
      <div className="container nav-container">
        <Link href="/" className="logo">
          <span className="logo-dot"></span>
          Email Automation
        </Link>
        <div className="nav-links">
          <Link href="/" className={`nav-link ${pathname === '/' ? 'active' : ''}`}>
            Capture Form
          </Link>
          <Link href="/dashboard" className={`nav-link ${pathname === '/dashboard' ? 'active' : ''}`}>
            Analytics Dashboard
          </Link>
        </div>
      </div>
    </nav>
  );
}
