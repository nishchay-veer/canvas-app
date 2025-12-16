import { Github, Twitter } from "lucide-react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="py-12 px-4 sm:px-6 lg:px-8 border-t border-gray-100">
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
          {/* Logo & tagline */}
          <div className="flex flex-col gap-3">
            <Link href="/" className="flex items-center gap-2">
              <svg
                width="24"
                height="24"
                viewBox="0 0 32 32"
                fill="none"
                className="text-gray-900"
              >
                <path
                  d="M6 8 L10 4 L18 12 L28 4 L28 8 L18 16 L28 24 L28 28 L18 20 L10 28 L6 24 L14 16 Z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  fill="none"
                />
              </svg>
              <span className="font-heading font-semibold text-gray-900">
                Excalidraw
              </span>
            </Link>
            <p className="text-sm text-gray-500 max-w-xs">
              Open-source whiteboard for sketching hand-drawn diagrams.
            </p>
          </div>

          {/* Links */}
          <div className="flex flex-wrap gap-8 text-sm">
            <div className="flex flex-col gap-2">
              <span className="font-medium text-gray-900">Product</span>
              <a
                href="#features"
                className="text-gray-500 hover:text-gray-900 transition-colors"
              >
                Features
              </a>
              <a
                href="#"
                className="text-gray-500 hover:text-gray-900 transition-colors"
              >
                Changelog
              </a>
            </div>
            <div className="flex flex-col gap-2">
              <span className="font-medium text-gray-900">Resources</span>
              <a
                href="#"
                className="text-gray-500 hover:text-gray-900 transition-colors"
              >
                Docs
              </a>
              <a
                href="#"
                className="text-gray-500 hover:text-gray-900 transition-colors"
              >
                Blog
              </a>
            </div>
            <div className="flex flex-col gap-2">
              <span className="font-medium text-gray-900">Legal</span>
              <a
                href="#"
                className="text-gray-500 hover:text-gray-900 transition-colors"
              >
                Privacy
              </a>
              <a
                href="#"
                className="text-gray-500 hover:text-gray-900 transition-colors"
              >
                Terms
              </a>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm text-gray-400">
            © {new Date().getFullYear()} Excalidraw. Open source under MIT.
          </p>
          <div className="flex items-center gap-4">
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="GitHub"
            >
              <Github className="w-5 h-5" />
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="Twitter"
            >
              <Twitter className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
