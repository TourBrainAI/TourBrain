import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="border-t border-neutral-800 bg-gray-950">
      <div className="mx-auto max-w-6xl px-4 py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          {/* Logo and tagline */}
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center space-x-2">
              <div className="text-xl font-bold">TourBrain.ai</div>
            </Link>
            <p className="mt-2 text-sm text-neutral-400">
              AI Tour OS for live music.
            </p>
          </div>

          {/* Product */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-3">Product</h4>
            <ul className="space-y-2 text-sm text-neutral-400">
              <li>
                <Link
                  href="/#product"
                  className="hover:text-white transition-colors"
                >
                  Overview
                </Link>
              </li>
              <li>
                <Link
                  href="/#features"
                  className="hover:text-white transition-colors"
                >
                  Features
                </Link>
              </li>
              <li>
                <Link
                  href="/#how-it-works"
                  className="hover:text-white transition-colors"
                >
                  How it Works
                </Link>
              </li>
            </ul>
          </div>

          {/* Solutions */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-3">Solutions</h4>
            <ul className="space-y-2 text-sm text-neutral-400">
              <li>
                <Link
                  href="/solutions/venues"
                  className="hover:text-white transition-colors"
                >
                  Venues & Talent Buyers
                </Link>
              </li>
              <li>
                <Link
                  href="/solutions/promoters"
                  className="hover:text-white transition-colors"
                >
                  Promoters
                </Link>
              </li>
              <li>
                <Link
                  href="/solutions/agencies"
                  className="hover:text-white transition-colors"
                >
                  Agencies & Tour Managers
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-3">Company</h4>
            <ul className="space-y-2 text-sm text-neutral-400">
              <li>
                <Link
                  href="/why-tourbrain"
                  className="hover:text-white transition-colors"
                >
                  Why TourBrain
                </Link>
              </li>
              <li>
                <Link
                  href="/faq"
                  className="hover:text-white transition-colors"
                >
                  FAQ
                </Link>
              </li>
              <li>
                <a
                  href="mailto:hello@tourbrain.ai"
                  className="hover:text-white transition-colors"
                >
                  Contact
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom section */}
        <div className="mt-8 border-t border-neutral-800 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-neutral-400">
            © 2025 TourBrain. All rights reserved.
          </p>
          <div className="flex space-x-6 text-sm text-neutral-400 mt-4 md:mt-0">
            <Link href="/terms" className="hover:text-white transition-colors">
              Terms
            </Link>
            <Link
              href="/privacy"
              className="hover:text-white transition-colors"
            >
              Privacy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
