"use client";

import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="w-full bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo / Title */}
          <div className="flex items-center space-x-2">
            <span className="text-xl font-bold text-[var(--color-accent)]">
              GT TFT
            </span>
            <span className="text-sm text-gray-500 dark:text-gray-400 font-medium tracking-wide">
              Snapshots
            </span>
          </div>

          {/* Navigation Links */}
          <div className="flex space-x-6 text-sm font-medium text-[var(--color-foreground)]">
            <Link
              href="/"
              className="hover:text-[var(--color-accent)] transition-colors"
            >
              Home
            </Link>
            <Link
              href="/player_distribution"
              className="hover:text-[var(--color-accent)] transition-colors"
            >
              Player Distribution
            </Link>
            <Link
              href="/user_stats"
              className="hover:text-[var(--color-accent)] transition-colors"
            >
              User Stats
            </Link>
            <Link
              href="/history"
              className="hover:text-[var(--color-accent)] transition-colors"
            >
              Snapshot History
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
