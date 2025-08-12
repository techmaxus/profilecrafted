import Link from 'next/link';

export default function TermsOfService() {
  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '0'
    }}>
      {/* Header */}
      <header style={{
        background: 'rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.2)',
        padding: '20px 0'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0 32px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <Link 
            href="/" 
            style={{
              fontSize: '24px',
              fontWeight: '700',
              color: 'white',
              textDecoration: 'none'
            }}
          >
            ProfileCrafted
          </Link>
          <nav style={{ display: 'flex', gap: '24px' }}>
            <Link href="/" style={{ color: 'rgba(255, 255, 255, 0.9)', textDecoration: 'none', fontSize: '16px' }}>Home</Link>
            <Link href="/about" style={{ color: 'rgba(255, 255, 255, 0.9)', textDecoration: 'none', fontSize: '16px' }}>About</Link>
            <Link href="/faq" style={{ color: 'rgba(255, 255, 255, 0.9)', textDecoration: 'none', fontSize: '16px' }}>FAQ</Link>
            <Link href="/contact" style={{ color: 'rgba(255, 255, 255, 0.9)', textDecoration: 'none', fontSize: '16px' }}>Support</Link>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '48px 32px'
      }}>
        <div style={{
          background: 'rgba(255, 255, 255, 0.95)',
          borderRadius: '20px',
          padding: '48px',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
          backdropFilter: 'blur(10px)'
        }}>
          <h1 style={{
            fontSize: '48px',
            fontWeight: '700',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            marginBottom: '32px',
            textAlign: 'center'
          }}>Terms of Service</h1>
          
          <div className="prose prose-gray max-w-none">
            <p className="text-sm text-gray-600 mb-6">
              <strong>Last updated:</strong> {new Date().toLocaleDateString()}
            </p>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">1. Acceptance of Terms</h2>
              <p className="text-gray-700 mb-4">
                By accessing and using ProfileCrafted, you accept and agree to be bound by the terms and 
                provision of this agreement. If you do not agree to abide by the above, please do not use this service.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">2. Service Description</h2>
              <p className="text-gray-700 mb-4">
                ProfileCrafted is an AI-powered resume analysis tool that:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>Analyzes PDF and DOCX resume files</li>
                <li>Provides scoring and feedback for Associate Product Manager (APM) roles</li>
                <li>Generates AI-powered insights and recommendations</li>
                <li>Offers export and sharing capabilities</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">3. User Responsibilities</h2>
              <p className="text-gray-700 mb-4">You agree to:</p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>Provide accurate and truthful information</li>
                <li>Use the service only for legitimate resume analysis purposes</li>
                <li>Not upload malicious files or attempt to harm the service</li>
                <li>Respect rate limits and usage guidelines</li>
                <li>Not attempt to reverse engineer or exploit the service</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">4. Acceptable Use</h2>
              <p className="text-gray-700 mb-4">You may NOT use ProfileCrafted to:</p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>Upload files containing illegal, harmful, or inappropriate content</li>
                <li>Attempt to overwhelm our servers or bypass rate limiting</li>
                <li>Use the service for commercial purposes without permission</li>
                <li>Share or distribute analysis results without proper attribution</li>
                <li>Violate any applicable laws or regulations</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">5. Intellectual Property</h2>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>You retain ownership of your resume content</li>
                <li>ProfileCrafted retains ownership of the analysis algorithms and interface</li>
                <li>AI-generated analysis results are provided under fair use</li>
                <li>You may use analysis results for personal career development</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">6. Privacy and Data</h2>
              <p className="text-gray-700 mb-4">
                Your privacy is important to us. Please review our{' '}
                <Link href="/privacy" className="text-blue-600 hover:underline">
                  Privacy Policy
                </Link>{' '}
                to understand how we collect, use, and protect your information.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">7. Disclaimers</h2>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li><strong>Educational Purpose:</strong> ProfileCrafted is for educational and informational purposes only</li>
                <li><strong>No Guarantees:</strong> We do not guarantee job placement or interview success</li>
                <li><strong>AI Limitations:</strong> AI analysis may contain errors or biases</li>
                <li><strong>Professional Advice:</strong> Our service does not replace professional career counseling</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">8. Limitation of Liability</h2>
              <p className="text-gray-700 mb-4">
                ProfileCrafted and its creators shall not be liable for any direct, indirect, incidental, 
                special, consequential, or punitive damages resulting from your use of the service.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">9. Service Availability</h2>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>We strive for 99% uptime but cannot guarantee uninterrupted service</li>
                <li>Maintenance windows may temporarily affect availability</li>
                <li>We reserve the right to modify or discontinue features</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">10. Termination</h2>
              <p className="text-gray-700 mb-4">
                We reserve the right to terminate or suspend access to our service immediately, 
                without prior notice, for any reason including breach of these Terms.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">11. Changes to Terms</h2>
              <p className="text-gray-700 mb-4">
                We reserve the right to modify these terms at any time. Changes will be effective 
                immediately upon posting. Continued use constitutes acceptance of modified terms.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">12. Contact Information</h2>
              <p className="text-gray-700">
                For questions about these Terms of Service, please contact us at:{' '}
                <a href="mailto:legal@profilecrafted.com" className="text-blue-600 hover:underline">
                  legal@profilecrafted.com
                </a>
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
