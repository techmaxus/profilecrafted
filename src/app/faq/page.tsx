import Link from 'next/link';

export default function FAQ() {
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
          }}>Frequently Asked Questions</h1>
          
          <div className="prose prose-gray max-w-none">
            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Getting Started</h2>
              
              <div className="space-y-6">
                <div className="border-l-4 border-blue-500 pl-6">
                  <h3 className="font-semibold text-gray-900 mb-2">
                    What file formats can I upload?
                  </h3>
                  <p className="text-gray-700">
                    ProfileCrafted supports PDF and DOCX (Microsoft Word) files up to 10MB in size. 
                    We recommend PDF format for the most accurate text extraction and analysis.
                  </p>
                </div>

                <div className="border-l-4 border-green-500 pl-6">
                  <h3 className="font-semibold text-gray-900 mb-2">
                    How long does the analysis take?
                  </h3>
                  <p className="text-gray-700">
                    Most resume analyses complete within 30-60 seconds. The process includes file upload, 
                    text extraction, AI analysis, and score calculation. Larger files may take slightly longer.
                  </p>
                </div>

                <div className="border-l-4 border-purple-500 pl-6">
                  <h3 className="font-semibold text-gray-900 mb-2">
                    Do I need to create an account?
                  </h3>
                  <p className="text-gray-700">
                    No account required! ProfileCrafted works instantly - just upload your resume and get 
                    immediate analysis. Your results are displayed in your browser session only.
                  </p>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Analysis & Scoring</h2>
              
              <div className="space-y-6">
                <div className="border-l-4 border-orange-500 pl-6">
                  <h3 className="font-semibold text-gray-900 mb-2">
                    What do the scores mean?
                  </h3>
                  <p className="text-gray-700 mb-2">
                    Scores range from 60-100 and represent your resume's alignment with APM role requirements:
                  </p>
                  <ul className="text-gray-700 text-sm space-y-1">
                    <li>• <strong>60-70:</strong> Entry-level candidate with basic qualifications</li>
                    <li>• <strong>70-80:</strong> Good candidate with relevant skills/experience</li>
                    <li>• <strong>80-90:</strong> Strong candidate with solid APM potential</li>
                    <li>• <strong>90-100:</strong> Exceptional candidate, ideal for top-tier APM roles</li>
                  </ul>
                </div>

                <div className="border-l-4 border-red-500 pl-6">
                  <h3 className="font-semibold text-gray-900 mb-2">
                    Why are my scores lower than expected?
                  </h3>
                  <p className="text-gray-700">
                    Several factors can affect scores: 1) Resume format and clarity, 2) Missing key APM competencies, 
                    3) Lack of quantified achievements, 4) Poor text extraction from complex layouts. 
                    Review the detailed feedback for specific improvement areas.
                  </p>
                </div>

                <div className="border-l-4 border-indigo-500 pl-6">
                  <h3 className="font-semibold text-gray-900 mb-2">
                    How accurate is the AI analysis?
                  </h3>
                  <p className="text-gray-700">
                    Our AI is specifically trained for APM role evaluation using industry best practices. 
                    While highly accurate for identifying key competencies, it should supplement professional 
                    career advice rather than replace it.
                  </p>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Privacy & Security</h2>
              
              <div className="space-y-6">
                <div className="border-l-4 border-green-600 pl-6">
                  <h3 className="font-semibold text-gray-900 mb-2">
                    Is my resume data secure?
                  </h3>
                  <p className="text-gray-700">
                    Absolutely! Your resume files are processed securely and automatically deleted after analysis. 
                    We use HTTPS encryption, don't store personal data permanently, and follow strict privacy practices. 
                    See our <Link href="/privacy" className="text-blue-600 hover:underline">Privacy Policy</Link> for details.
                  </p>
                </div>

                <div className="border-l-4 border-yellow-500 pl-6">
                  <h3 className="font-semibold text-gray-900 mb-2">
                    What happens to my resume after analysis?
                  </h3>
                  <p className="text-gray-700">
                    Your resume file is automatically deleted from our servers immediately after text extraction 
                    and analysis. Only the analysis results remain in your browser session temporarily.
                  </p>
                </div>

                <div className="border-l-4 border-pink-500 pl-6">
                  <h3 className="font-semibold text-gray-900 mb-2">
                    Do you share data with third parties?
                  </h3>
                  <p className="text-gray-700">
                    We only share resume text with OpenAI for AI analysis (as disclosed in our privacy policy). 
                    We never share, sell, or distribute your personal information or resume content to other parties.
                  </p>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Troubleshooting</h2>
              
              <div className="space-y-6">
                <div className="border-l-4 border-red-600 pl-6">
                  <h3 className="font-semibold text-gray-900 mb-2">
                    My file upload failed. What should I do?
                  </h3>
                  <p className="text-gray-700 mb-2">
                    Try these troubleshooting steps:
                  </p>
                  <ol className="text-gray-700 text-sm space-y-1 list-decimal list-inside">
                    <li>Ensure your file is PDF or DOCX format</li>
                    <li>Check file size is under 10MB</li>
                    <li>Verify the file isn't password-protected or corrupted</li>
                    <li>Try refreshing the page and uploading again</li>
                    <li>Try a different browser or device</li>
                  </ol>
                </div>

                <div className="border-l-4 border-orange-600 pl-6">
                  <h3 className="font-semibold text-gray-900 mb-2">
                    The analysis seems stuck or incomplete. Help!
                  </h3>
                  <p className="text-gray-700">
                    If analysis takes longer than 2 minutes: 1) Check your internet connection, 
                    2) Refresh the page and try again, 3) Try with a simpler resume format, 
                    4) Contact support if the issue persists.
                  </p>
                </div>

                <div className="border-l-4 border-blue-600 pl-6">
                  <h3 className="font-semibold text-gray-900 mb-2">
                    The extracted text looks garbled. Why?
                  </h3>
                  <p className="text-gray-700">
                    Complex resume layouts, images, or unusual fonts can affect text extraction. 
                    For best results: 1) Use simple, clean formatting, 2) Avoid complex graphics, 
                    3) Ensure text is selectable in your PDF, 4) Consider using DOCX format instead.
                  </p>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">APM-Specific Questions</h2>
              
              <div className="space-y-6">
                <div className="border-l-4 border-purple-600 pl-6">
                  <h3 className="font-semibold text-gray-900 mb-2">
                    Can I use this for other PM roles?
                  </h3>
                  <p className="text-gray-700">
                    ProfileCrafted is specifically optimized for Associate Product Manager (entry-level) roles. 
                    While some insights may apply to other PM positions, the scoring criteria are tailored for APM competencies.
                  </p>
                </div>

                <div className="border-l-4 border-teal-500 pl-6">
                  <h3 className="font-semibold text-gray-900 mb-2">
                    What if I don't have traditional PM experience?
                  </h3>
                  <p className="text-gray-700">
                    That's perfectly normal for APM candidates! The analysis looks for transferable skills, 
                    technical aptitude, leadership potential, and learning mindset - not just direct PM experience.
                  </p>
                </div>

                <div className="border-l-4 border-cyan-500 pl-6">
                  <h3 className="font-semibold text-gray-900 mb-2">
                    How can I improve my scores?
                  </h3>
                  <p className="text-gray-700">
                    Focus on the detailed feedback provided: 1) Highlight quantified achievements, 
                    2) Emphasize technical skills and data analysis, 3) Show leadership and teamwork examples, 
                    4) Demonstrate curiosity and learning mindset, 5) Improve communication clarity.
                  </p>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Still Have Questions?</h2>
              <div className="bg-blue-50 p-6 rounded-lg">
                <p className="text-blue-800 mb-4">
                  Can't find the answer you're looking for? We're here to help!
                </p>
                <div className="flex flex-wrap gap-4">
                  <Link 
                    href="/contact" 
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
                  >
                    Contact Support
                  </Link>
                  <a 
                    href="mailto:support@profilecrafted.com" 
                    className="bg-white text-blue-600 border border-blue-600 px-4 py-2 rounded hover:bg-blue-50 transition-colors"
                  >
                    Email Us Directly
                  </a>
                </div>
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
