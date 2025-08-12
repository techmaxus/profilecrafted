import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 mt-16">
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1">
            <h3 className="font-bold text-gray-900 mb-3">ProfileCrafted</h3>
            <p className="text-gray-600 text-sm">
              AI-powered resume analysis for Associate Product Manager roles at top tech companies.
            </p>
          </div>

          {/* Product */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-3">Product</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/about" className="text-gray-600 hover:text-gray-900 transition-colors">
                  How It Works
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-gray-600 hover:text-gray-900 transition-colors">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-600 hover:text-gray-900 transition-colors">
                  Support
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-3">Legal</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/privacy" className="text-gray-600 hover:text-gray-900 transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-gray-600 hover:text-gray-900 transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <a href="mailto:legal@profilecrafted.com" className="text-gray-600 hover:text-gray-900 transition-colors">
                  Legal Inquiries
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-3">Contact</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="mailto:support@profilecrafted.com" className="text-gray-600 hover:text-gray-900 transition-colors">
                  General Support
                </a>
              </li>
              <li>
                <a href="mailto:privacy@profilecrafted.com" className="text-gray-600 hover:text-gray-900 transition-colors">
                  Privacy Questions
                </a>
              </li>
              <li>
                <a href="mailto:feedback@profilecrafted.com" className="text-gray-600 hover:text-gray-900 transition-colors">
                  Feature Requests
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-200 mt-8 pt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-500 text-sm">
            © {new Date().getFullYear()} ProfileCrafted. Built with ❤️ for the PM community.
          </p>
          <div className="flex items-center space-x-4 mt-4 md:mt-0">
            <span className="text-gray-400 text-xs">Powered by</span>
            <div className="flex items-center space-x-2 text-xs text-gray-500">
              <span>OpenAI</span>
              <span>•</span>
              <span>Vercel</span>
              <span>•</span>
              <span>Cloudflare</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
