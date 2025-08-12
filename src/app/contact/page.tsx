import Link from 'next/link';

export default function Contact() {
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
          padding: '0 16px',
          flexWrap: 'wrap',
          gap: '16px',
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
          <nav style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
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
        padding: '32px 16px'
      }}>
        <div style={{
          background: 'rgba(255, 255, 255, 0.95)',
          borderRadius: '20px',
          padding: '40px 32px',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
          backdropFilter: 'blur(10px)'
        }}>
          <h1 style={{
            fontSize: '48px',
            fontWeight: '700',
            background: 'linear-gradient(135deg, #6b7280 0%, #10b981 50%, #059669 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            marginBottom: '40px',
            textAlign: 'center'
          }}>Contact & Support</h1>
          
          <div className="prose prose-gray max-w-none">
            <section style={{ marginBottom: '48px' }}>
              <h2 style={{
                fontSize: '28px',
                fontWeight: '600',
                color: '#1f2937',
                marginBottom: '24px',
                textAlign: 'center'
              }}>Get in Touch</h2>
              <p style={{
                color: '#4b5563',
                fontSize: '16px',
                lineHeight: '1.7',
                marginBottom: '32px',
                textAlign: 'center',
                maxWidth: '600px',
                margin: '0 auto 32px auto'
              }}>
                We're here to help you make the most of ProfileCrafted. Whether you have questions, 
                feedback, or need technical support, we'd love to hear from you.
              </p>
            </section>

            <section className="mb-8">
              <h2 style={{
                fontSize: '28px',
                fontWeight: '600',
                color: '#1f2937',
                marginBottom: '32px',
                textAlign: 'center'
              }}>Support Channels</h2>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                gap: '24px',
                marginBottom: '32px'
              }}>
                <div className="bg-blue-50 p-6 rounded-lg">
                  <h3 className="font-semibold text-blue-900 mb-3 flex items-center">
                    📧 Email Support
                  </h3>
                  <p className="text-blue-800 text-sm mb-3">
                    For general questions, technical issues, or feedback
                  </p>
                  <a 
                    href="mailto:profilecrafted@gmail.com" 
                    className="text-blue-600 hover:text-blue-700 font-medium"
                  >
                    profilecrafted@gmail.com
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
                    href="mailto:profilecrafted@gmail.com" 
                    className="text-green-600 hover:text-green-700 font-medium"
                  >
                    profilecrafted@gmail.com
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
                    href="mailto:profilecrafted@gmail.com" 
                    className="text-purple-600 hover:text-purple-700 font-medium"
                  >
                    profilecrafted@gmail.com
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
                    href="mailto:profilecrafted@gmail.com" 
                    className="text-orange-600 hover:text-orange-700 font-medium"
                  >
                    profilecrafted@gmail.com
                  </a>
                  <p className="text-orange-700 text-xs mt-2">
                    We read every suggestion!
                  </p>
                </div>
              </div>
            </section>

            <section style={{ marginBottom: '48px' }}>
              <h2 style={{
                fontSize: '28px',
                fontWeight: '600',
                color: '#1f2937',
                marginBottom: '24px',
                textAlign: 'center'
              }}>Additional Information</h2>
              <div style={{
                background: '#f3f4f6',
                padding: '24px',
                borderRadius: '12px',
                textAlign: 'center'
              }}>
                <p style={{
                  color: '#4b5563',
                  fontSize: '16px',
                  lineHeight: '1.6',
                  marginBottom: '16px'
                }}>For frequently asked questions, please visit our <a href="/faq" style={{ color: '#059669', textDecoration: 'underline' }}>FAQ page</a>.</p>
                <p style={{
                  color: '#6b7280',
                  fontSize: '14px',
                  lineHeight: '1.5'
                }}>We're here to help you make the most of ProfileCrafted. Don't hesitate to reach out!</p>
              </div>
            </section>

            <section style={{ marginBottom: '48px' }}>
              <h2 style={{
                fontSize: '28px',
                fontWeight: '600',
                color: '#1f2937',
                marginBottom: '24px',
                textAlign: 'center'
              }}>Technical Support</h2>
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

            <section style={{ marginBottom: '48px' }}>
              <h2 style={{
                fontSize: '28px',
                fontWeight: '600',
                color: '#1f2937',
                marginBottom: '24px',
                textAlign: 'center'
              }}>Feedback & Suggestions</h2>
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
