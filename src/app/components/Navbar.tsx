"use client";

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="navbar">
      <div className="container nav-container">
        <Link href="/" className="logo" onClick={() => setIsMenuOpen(false)}>
          <span className="logo-dot"></span>
          Email Automation
        </Link>
        
        <button 
          className="hamburger" 
          onClick={() => setIsMenuOpen(!isMenuOpen)} 
          aria-label="Toggle menu"
          aria-expanded={isMenuOpen}
        >
          {isMenuOpen ? '✕' : '☰'}
        </button>

        <div className={`nav-links ${isMenuOpen ? 'open' : ''}`}>
          <Link 
            href="/" 
            className={`nav-link ${pathname === '/' ? 'active' : ''}`}
            onClick={() => setIsMenuOpen(false)}
          >
            Capture Form
          </Link>
          <Link 
            href="/dashboard" 
            className={`nav-link ${pathname === '/dashboard' ? 'active' : ''}`}
            onClick={() => setIsMenuOpen(false)}
          >
            Analytics Dashboard
          </Link>
        </div>
      </div>
    </nav>
  );
}
