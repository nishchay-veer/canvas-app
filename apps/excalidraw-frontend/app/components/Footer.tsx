import { Github, Twitter, Heart } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="col-span-1">
            <div className="flex items-center space-x-2 mb-4">
              <svg
                width="32"
                height="32"
                viewBox="0 0 32 32"
                fill="none"
                className="text-blue-500"
              >
                <path
                  d="M5 8 L8 5 L15 12 L28 3 L30 5 L15 20 Z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  fill="none"
                />
                <rect
                  x="3"
                  y="10"
                  width="20"
                  height="18"
                  rx="2"
                  stroke="currentColor"
                  strokeWidth="2"
                  fill="none"
                />
              </svg>
              <span className="text-xl font-bold text-white">Excalidraw</span>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed">
              Virtual whiteboard for sketching hand-drawn like diagrams. Free
              and open source.
            </p>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Product</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#features" className="hover:text-white transition">
                  Features
                </a>
              </li>
              <li>
                <a href="#pricing" className="hover:text-white transition">
                  Pricing
                </a>
              </li>
              <li>
                <a href="#integrations" className="hover:text-white transition">
                  Integrations
                </a>
              </li>
              <li>
                <a href="#changelog" className="hover:text-white transition">
                  Changelog
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Resources</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#docs" className="hover:text-white transition">
                  Documentation
                </a>
              </li>
              <li>
                <a href="#community" className="hover:text-white transition">
                  Community
                </a>
              </li>
              <li>
                <a href="#blog" className="hover:text-white transition">
                  Blog
                </a>
              </li>
              <li>
                <a href="#support" className="hover:text-white transition">
                  Support
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Company</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#about" className="hover:text-white transition">
                  About
                </a>
              </li>
              <li>
                <a href="#privacy" className="hover:text-white transition">
                  Privacy
                </a>
              </li>
              <li>
                <a href="#terms" className="hover:text-white transition">
                  Terms
                </a>
              </li>
              <li>
                <a href="#contact" className="hover:text-white transition">
                  Contact
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-gray-800">
          <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
            <div className="flex items-center space-x-1 text-sm">
              <span>Made with</span>
              <Heart className="w-4 h-4 text-red-500 fill-current" />
              <span>by the Excalidraw team</span>
            </div>

            <div className="flex items-center space-x-6">
              <a
                href="#github"
                className="hover:text-white transition"
                aria-label="GitHub"
              >
                <Github className="w-5 h-5" />
              </a>
              <a
                href="#twitter"
                className="hover:text-white transition"
                aria-label="Twitter"
              >
                <Twitter className="w-5 h-5" />
              </a>
            </div>
          </div>

          <div className="mt-4 text-center text-sm text-gray-500">
            © 2024 Excalidraw. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
}
