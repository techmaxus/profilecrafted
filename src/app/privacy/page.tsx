import Link from 'next/link';

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-6">
        <div className="bg-white rounded-lg shadow-sm p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Privacy Policy</h1>
          
          <div className="prose prose-gray max-w-none">
            <p className="text-sm text-gray-600 mb-6">
              <strong>Last updated:</strong> {new Date().toLocaleDateString()}
            </p>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">1. Information We Collect</h2>
              <p className="text-gray-700 mb-4">
                ProfileCrafted collects and processes the following information:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li><strong>Resume Files:</strong> PDF and DOCX files you upload for analysis</li>
                <li><strong>Extracted Text:</strong> Text content extracted from your resume files</li>
                <li><strong>Usage Data:</strong> Basic analytics about how you use our service</li>
                <li><strong>Technical Data:</strong> IP address, browser type, and device information</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">2. How We Use Your Information</h2>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li><strong>Resume Analysis:</strong> We send your resume text to OpenAI's API for AI-powered analysis and scoring</li>
                <li><strong>File Storage:</strong> Resume files are temporarily stored on Cloudflare R2 for processing</li>
                <li><strong>Service Improvement:</strong> We analyze usage patterns to improve our service</li>
                <li><strong>Security:</strong> We monitor for abuse and ensure service reliability</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">3. Third-Party Services</h2>
              <p className="text-gray-700 mb-4">
                ProfileCrafted integrates with the following third-party services:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li><strong>OpenAI:</strong> For AI-powered resume analysis and scoring. See <a href="https://openai.com/privacy" className="text-blue-600 hover:underline">OpenAI's Privacy Policy</a></li>
                <li><strong>Cloudflare R2:</strong> For secure file storage. See <a href="https://www.cloudflare.com/privacy" className="text-blue-600 hover:underline">Cloudflare's Privacy Policy</a></li>
                <li><strong>Vercel:</strong> For hosting and analytics. See <a href="https://vercel.com/legal/privacy-policy" className="text-blue-600 hover:underline">Vercel's Privacy Policy</a></li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">4. Data Security</h2>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>All data transmission is encrypted using HTTPS/TLS</li>
                <li>Resume files are automatically deleted after processing</li>
                <li>We implement rate limiting and security monitoring</li>
                <li>Access to your data is restricted to essential processing only</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">5. Data Retention</h2>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li><strong>Resume Files:</strong> Deleted immediately after text extraction</li>
                <li><strong>Analysis Results:</strong> Stored temporarily in your browser session only</li>
                <li><strong>Usage Analytics:</strong> Aggregated and anonymized data may be retained for service improvement</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">6. Your Rights</h2>
              <p className="text-gray-700 mb-4">You have the right to:</p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>Request information about data we process</li>
                <li>Request deletion of your data</li>
                <li>Opt out of analytics tracking</li>
                <li>Contact us with privacy concerns</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">7. Contact Information</h2>
              <p className="text-gray-700">
                For privacy-related questions or concerns, please contact us at:{' '}
                <a href="mailto:privacy@profilecrafted.com" className="text-blue-600 hover:underline">
                  privacy@profilecrafted.com
                </a>
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">8. Changes to This Policy</h2>
              <p className="text-gray-700">
                We may update this privacy policy from time to time. We will notify users of any material changes 
                by updating the "Last updated" date at the top of this policy.
              </p>
            </section>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-200">
            <Link 
              href="/" 
              className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium"
            >
              ← Back to ProfileCrafted
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
