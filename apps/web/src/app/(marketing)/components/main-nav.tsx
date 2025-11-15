"use client";

import { useState } from "react";
import Link from "next/link";

export function MainNav() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-neutral-800 bg-gray-950/80 backdrop-blur-sm">
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2">
          <div className="text-2xl font-bold">TourBrain</div>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-8">
          <Link
            href="/#product"
            className="text-neutral-300 hover:text-white transition-colors"
          >
            Product
          </Link>

          {/* Solutions Dropdown - TODO: Add proper dropdown */}
          <div className="relative group">
            <button className="text-neutral-300 hover:text-white transition-colors">
              Solutions
            </button>
            <div className="absolute top-full left-0 mt-1 w-48 rounded-md bg-gray-900 border border-neutral-800 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
              <Link
                href="/solutions/venues"
                className="block px-4 py-2 text-sm text-neutral-300 hover:text-white hover:bg-neutral-800"
              >
                Venues & Talent Buyers
              </Link>
              <Link
                href="/solutions/promoters"
                className="block px-4 py-2 text-sm text-neutral-300 hover:text-white hover:bg-neutral-800"
              >
                Promoters
              </Link>
              <Link
                href="/solutions/agencies"
                className="block px-4 py-2 text-sm text-neutral-300 hover:text-white hover:bg-neutral-800"
              >
                Agencies & Tour Managers
              </Link>
            </div>
          </div>

          <Link
            href="/why-tourbrain"
            className="text-neutral-300 hover:text-white transition-colors"
          >
            Why TourBrain
          </Link>

          <Link
            href="/faq"
            className="text-neutral-300 hover:text-white transition-colors"
          >
            FAQ
          </Link>
        </div>

        {/* CTA Button */}
        <div className="hidden md:block">
          <Link
            href="/#waitlist"
            className="inline-flex items-center justify-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
          >
            Get Early Access
          </Link>
        </div>

        {/* Mobile menu button */}
        <button className="md:hidden" onClick={() => setIsOpen(!isOpen)}>
          <svg
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
      </nav>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden border-t border-neutral-800 bg-gray-950">
          <div className="space-y-1 px-4 py-3">
            <Link
              href="/#product"
              className="block py-2 text-neutral-300 hover:text-white"
              onClick={() => setIsOpen(false)}
            >
              Product
            </Link>
            <Link
              href="/solutions/venues"
              className="block py-2 text-neutral-300 hover:text-white"
              onClick={() => setIsOpen(false)}
            >
              Solutions: Venues
            </Link>
            <Link
              href="/solutions/promoters"
              className="block py-2 text-neutral-300 hover:text-white"
              onClick={() => setIsOpen(false)}
            >
              Solutions: Promoters
            </Link>
            <Link
              href="/solutions/agencies"
              className="block py-2 text-neutral-300 hover:text-white"
              onClick={() => setIsOpen(false)}
            >
              Solutions: Agencies
            </Link>
            <Link
              href="/why-tourbrain"
              className="block py-2 text-neutral-300 hover:text-white"
              onClick={() => setIsOpen(false)}
            >
              Why TourBrain
            </Link>
            <Link
              href="/faq"
              className="block py-2 text-neutral-300 hover:text-white"
              onClick={() => setIsOpen(false)}
            >
              FAQ
            </Link>
            <Link
              href="/#waitlist"
              className="block mt-4 rounded-md bg-blue-600 px-4 py-2 text-center text-sm font-medium text-white hover:bg-blue-700"
              onClick={() => setIsOpen(false)}
            >
              Get Early Access
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
