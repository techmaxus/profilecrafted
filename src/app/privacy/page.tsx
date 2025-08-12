import Link from 'next/link';

export default function PrivacyPolicy() {
  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #9ca3af 0%, #6b7280 25%, #10b981 75%, #059669 100%)',
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
          padding: '32px 24px',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
          backdropFilter: 'blur(10px)'
        }}>
          <h1 style={{
            fontSize: '48px',
            fontWeight: '700',
            background: 'linear-gradient(135deg, #6b7280 0%, #10b981 50%, #059669 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            marginBottom: '24px',
            textAlign: 'center'
          }}>Privacy Policy</h1>
          
          <div style={{ maxWidth: 'none' }}>
            <p style={{
              fontSize: '14px',
              color: '#6b7280',
              marginBottom: '24px',
              textAlign: 'center',
              fontStyle: 'italic'
            }}>
              <strong>Last updated:</strong> {new Date().toLocaleDateString()}
            </p>

            <section style={{ marginBottom: '32px' }}>
              <h2 style={{
                fontSize: '28px',
                fontWeight: '600',
                color: '#1f2937',
                marginBottom: '16px',
                borderBottom: '2px solid #667eea',
                paddingBottom: '8px'
              }}>1. Information We Collect</h2>
              <p style={{
                color: '#4b5563',
                fontSize: '18px',
                lineHeight: '1.7',
                marginBottom: '16px'
              }}>
                ProfileCrafted collects and processes the following information:
              </p>
              <ul style={{
                listStyleType: 'disc',
                paddingLeft: '24px',
                color: '#4b5563',
                fontSize: '16px',
                lineHeight: '1.6'
              }}>
                <li style={{ marginBottom: '8px' }}><strong>Resume Files:</strong> PDF and DOCX files you upload for analysis</li>
                <li style={{ marginBottom: '8px' }}><strong>Extracted Text:</strong> Text content extracted from your resume files</li>
                <li style={{ marginBottom: '8px' }}><strong>Usage Data:</strong> Basic analytics about how you use our service</li>
                <li style={{ marginBottom: '8px' }}><strong>Technical Data:</strong> IP address, browser type, and device information</li>
              </ul>
            </section>

            <section style={{ marginBottom: '32px' }}>
              <h2 style={{
                fontSize: '28px',
                fontWeight: '600',
                color: '#1f2937',
                marginBottom: '16px',
                borderBottom: '2px solid #667eea',
                paddingBottom: '8px'
              }}>2. How We Use Your Information</h2>
              <ul style={{
                listStyleType: 'disc',
                paddingLeft: '24px',
                color: '#4b5563',
                fontSize: '16px',
                lineHeight: '1.6'
              }}>
                <li style={{ marginBottom: '8px' }}><strong>Resume Analysis:</strong> We send your resume text to OpenAI's API for AI-powered analysis and scoring</li>
                <li style={{ marginBottom: '8px' }}><strong>File Storage:</strong> Resume files are stored securely on Cloudflare R2 cloud storage for processing and temporary retention</li>
                <li style={{ marginBottom: '8px' }}><strong>Service Improvement:</strong> We analyze usage patterns to improve our service</li>
                <li style={{ marginBottom: '8px' }}><strong>Security:</strong> We monitor for abuse and ensure service reliability</li>
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

            <section style={{ marginBottom: '32px' }}>
              <h2 style={{
                fontSize: '28px',
                fontWeight: '600',
                color: '#1f2937',
                marginBottom: '16px',
                borderBottom: '2px solid #667eea',
                paddingBottom: '8px'
              }}>4. Data Security</h2>
              <ul style={{
                listStyleType: 'disc',
                paddingLeft: '24px',
                color: '#4b5563',
                fontSize: '16px',
                lineHeight: '1.6'
              }}>
                <li style={{ marginBottom: '8px' }}>All data transmission is encrypted using HTTPS/TLS</li>
                <li style={{ marginBottom: '8px' }}>Resume files are stored securely in Cloudflare R2 with enterprise-grade encryption</li>
                <li style={{ marginBottom: '8px' }}>We implement rate limiting and security monitoring</li>
                <li style={{ marginBottom: '8px' }}>Access to your data is restricted to essential processing only</li>
              </ul>
            </section>

            <section style={{ marginBottom: '32px' }}>
              <h2 style={{
                fontSize: '28px',
                fontWeight: '600',
                color: '#1f2937',
                marginBottom: '16px',
                borderBottom: '2px solid #667eea',
                paddingBottom: '8px'
              }}>5. Data Retention</h2>
              <ul style={{
                listStyleType: 'disc',
                paddingLeft: '24px',
                color: '#4b5563',
                fontSize: '16px',
                lineHeight: '1.6'
              }}>
                <li style={{ marginBottom: '8px' }}><strong>Resume Files:</strong> Stored securely on Cloudflare R2 for up to 30 days to enable re-analysis and service functionality, then automatically deleted</li>
                <li style={{ marginBottom: '8px' }}><strong>Extracted Text:</strong> Processed and stored temporarily during your session for analysis purposes</li>
                <li style={{ marginBottom: '8px' }}><strong>Analysis Results:</strong> May be cached temporarily to improve service performance</li>
                <li style={{ marginBottom: '8px' }}><strong>Usage Analytics:</strong> Aggregated and anonymized data may be retained for service improvement</li>
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
