import Link from 'next/link';

export default function Contact() {
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
          }}>Contact & Support</h1>
          
          <div className="prose prose-gray max-w-none">
            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Get in Touch</h2>
              <p className="text-gray-700 mb-6">
                We're here to help you make the most of ProfileCrafted. Whether you have questions, 
                feedback, or need technical support, we'd love to hear from you.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Support Channels</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-blue-50 p-6 rounded-lg">
                  <h3 className="font-semibold text-blue-900 mb-3 flex items-center">
                    📧 Email Support
                  </h3>
                  <p className="text-blue-800 text-sm mb-3">
                    For general questions, technical issues, or feedback
                  </p>
                  <a 
                    href="mailto:support@profilecrafted.com" 
                    className="text-blue-600 hover:text-blue-700 font-medium"
                  >
                    support@profilecrafted.com
                  </a>
                  <p className="text-blue-700 text-xs mt-2">
                    Response time: Within 24 hours
                  </p>
                </div>

                <div className="bg-green-50 p-6 rounded-lg">
                  <h3 className="font-semibold text-green-900 mb-3 flex items-center">
                    🔒 Privacy & Security
                  </h3>
                  <p className="text-green-800 text-sm mb-3">
                    For privacy concerns or data-related questions
                  </p>
                  <a 
                    href="mailto:privacy@profilecrafted.com" 
                    className="text-green-600 hover:text-green-700 font-medium"
                  >
                    privacy@profilecrafted.com
                  </a>
                  <p className="text-green-700 text-xs mt-2">
                    Response time: Within 48 hours
                  </p>
                </div>

                <div className="bg-purple-50 p-6 rounded-lg">
                  <h3 className="font-semibold text-purple-900 mb-3 flex items-center">
                    ⚖️ Legal & Business
                  </h3>
                  <p className="text-purple-800 text-sm mb-3">
                    For legal matters, partnerships, or business inquiries
                  </p>
                  <a 
                    href="mailto:legal@profilecrafted.com" 
                    className="text-purple-600 hover:text-purple-700 font-medium"
                  >
                    legal@profilecrafted.com
                  </a>
                  <p className="text-purple-700 text-xs mt-2">
                    Response time: Within 72 hours
                  </p>
                </div>

                <div className="bg-orange-50 p-6 rounded-lg">
                  <h3 className="font-semibold text-orange-900 mb-3 flex items-center">
                    💡 Feature Requests
                  </h3>
                  <p className="text-orange-800 text-sm mb-3">
                    Ideas for new features or improvements
                  </p>
                  <a 
                    href="mailto:feedback@profilecrafted.com" 
                    className="text-orange-600 hover:text-orange-700 font-medium"
                  >
                    feedback@profilecrafted.com
                  </a>
                  <p className="text-orange-700 text-xs mt-2">
                    We read every suggestion!
                  </p>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Frequently Asked Questions</h2>
              <div className="space-y-6">
                <div className="border-l-4 border-blue-500 pl-4">
                  <h3 className="font-semibold text-gray-900 mb-2">
                    What file formats are supported?
                  </h3>
                  <p className="text-gray-700 text-sm">
                    ProfileCrafted supports PDF and DOCX (Microsoft Word) files up to 10MB in size. 
                    We recommend using PDF format for best text extraction results.
                  </p>
                </div>

                <div className="border-l-4 border-green-500 pl-4">
                  <h3 className="font-semibold text-gray-900 mb-2">
                    Is my resume data secure?
                  </h3>
                  <p className="text-gray-700 text-sm">
                    Yes! Your resume files are processed securely and stored on Cloudflare R2 with enterprise-grade encryption for up to 30 days to enable re-analysis, then automatically deleted. 
                    We don't store your resume content permanently. See our{' '}
                    <Link href="/privacy" className="text-blue-600 hover:underline">Privacy Policy</Link>{' '}
                    for full details.
                  </p>
                </div>

                <div className="border-l-4 border-purple-500 pl-4">
                  <h3 className="font-semibold text-gray-900 mb-2">
                    How accurate is the AI analysis?
                  </h3>
                  <p className="text-gray-700 text-sm">
                    Our AI is trained specifically for APM role evaluation and provides valuable insights. 
                    However, it should supplement, not replace, professional career advice. Results may vary 
                    based on resume format and content clarity.
                  </p>
                </div>

                <div className="border-l-4 border-orange-500 pl-4">
                  <h3 className="font-semibold text-gray-900 mb-2">
                    Can I use this for roles other than APM?
                  </h3>
                  <p className="text-gray-700 text-sm">
                    ProfileCrafted is specifically optimized for Associate Product Manager roles. While some 
                    insights may be relevant to other positions, the scoring and feedback are tailored for APM competencies.
                  </p>
                </div>

                <div className="border-l-4 border-red-500 pl-4">
                  <h3 className="font-semibold text-gray-900 mb-2">
                    What if my resume upload fails?
                  </h3>
                  <p className="text-gray-700 text-sm">
                    Try these troubleshooting steps: 1) Ensure your file is PDF or DOCX format, 2) Check file size is under 10MB, 
                    3) Verify the file isn't password-protected, 4) Try refreshing the page. If issues persist, contact support.
                  </p>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Technical Support</h2>
              <div className="bg-gray-50 p-6 rounded-lg">
                <p className="text-gray-700 mb-4">
                  When contacting technical support, please include:
                </p>
                <ul className="list-disc pl-6 text-gray-700 space-y-1 text-sm">
                  <li>Description of the issue you're experiencing</li>
                  <li>Your browser type and version</li>
                  <li>File format and approximate size of your resume</li>
                  <li>Any error messages you received</li>
                  <li>Steps you've already tried to resolve the issue</li>
                </ul>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Feedback & Suggestions</h2>
              <p className="text-gray-700 mb-4">
                We're constantly working to improve ProfileCrafted based on user feedback. Your input helps us:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>Enhance AI analysis accuracy and relevance</li>
                <li>Add new features and capabilities</li>
                <li>Improve user experience and interface design</li>
                <li>Expand support for different resume formats</li>
                <li>Better serve the PM community's needs</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Community</h2>
              <p className="text-gray-700 mb-4">
                Connect with other aspiring and current product managers:
              </p>
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-blue-800 text-sm">
                  🚀 <strong>Coming Soon:</strong> Community features, discussion forums, and PM career resources. 
                  Stay tuned for updates!
                </p>
              </div>
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
