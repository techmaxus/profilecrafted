import Link from 'next/link';

export default function About() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-6">
        <div className="bg-white rounded-lg shadow-sm p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">About ProfileCrafted</h1>
          
          <div className="prose prose-gray max-w-none">
            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">What is ProfileCrafted?</h2>
              <p className="text-gray-700 mb-4">
                ProfileCrafted is an AI-powered resume analysis tool specifically designed for 
                Associate Product Manager (APM) roles at top tech companies. Our platform helps 
                aspiring product managers understand how their resumes align with industry expectations 
                and provides actionable feedback for improvement.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">How It Works</h2>
              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div className="bg-blue-50 p-6 rounded-lg">
                  <h3 className="font-semibold text-blue-900 mb-2">📄 Upload Your Resume</h3>
                  <p className="text-blue-800 text-sm">
                    Support for PDF and DOCX files with secure processing and automatic text extraction.
                  </p>
                </div>
                <div className="bg-green-50 p-6 rounded-lg">
                  <h3 className="font-semibold text-green-900 mb-2">🤖 AI Analysis</h3>
                  <p className="text-green-800 text-sm">
                    Advanced AI evaluates your resume across 5 key APM competencies with detailed scoring.
                  </p>
                </div>
                <div className="bg-purple-50 p-6 rounded-lg">
                  <h3 className="font-semibold text-purple-900 mb-2">📊 Detailed Feedback</h3>
                  <p className="text-purple-800 text-sm">
                    Receive comprehensive scores, strengths analysis, and specific improvement recommendations.
                  </p>
                </div>
                <div className="bg-orange-50 p-6 rounded-lg">
                  <h3 className="font-semibold text-orange-900 mb-2">🚀 Export & Share</h3>
                  <p className="text-orange-800 text-sm">
                    Download your analysis results and track your progress over time.
                  </p>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">APM Evaluation Framework</h2>
              <p className="text-gray-700 mb-4">
                Our AI analyzes your resume across five critical competencies for APM success:
              </p>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm font-medium mr-3 mt-0.5">
                    Technical Fluency
                  </span>
                  <span className="text-gray-700">Programming skills, data analysis, and technical aptitude</span>
                </li>
                <li className="flex items-start">
                  <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm font-medium mr-3 mt-0.5">
                    Product Thinking
                  </span>
                  <span className="text-gray-700">User focus, market understanding, and product strategy</span>
                </li>
                <li className="flex items-start">
                  <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded text-sm font-medium mr-3 mt-0.5">
                    Curiosity & Creativity
                  </span>
                  <span className="text-gray-700">Innovation, problem-solving, and learning mindset</span>
                </li>
                <li className="flex items-start">
                  <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded text-sm font-medium mr-3 mt-0.5">
                    Communication
                  </span>
                  <span className="text-gray-700">Written/verbal skills and stakeholder management</span>
                </li>
                <li className="flex items-start">
                  <span className="bg-pink-100 text-pink-800 px-2 py-1 rounded text-sm font-medium mr-3 mt-0.5">
                    Leadership
                  </span>
                  <span className="text-gray-700">Team leadership, project management, and influence</span>
                </li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Technology Stack</h2>
              <p className="text-gray-700 mb-4">
                ProfileCrafted is built with modern, secure technologies:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li><strong>Frontend:</strong> Next.js 15, React, TypeScript, Tailwind CSS</li>
                <li><strong>AI Analysis:</strong> OpenAI GPT-4 with specialized APM prompting</li>
                <li><strong>File Processing:</strong> Advanced PDF/DOCX parsing with multiple fallback strategies</li>
                <li><strong>Storage:</strong> Cloudflare R2 for secure, temporary file storage</li>
                <li><strong>Security:</strong> Rate limiting, CORS protection, and data encryption</li>
                <li><strong>Hosting:</strong> Vercel with global CDN and automatic scaling</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Privacy & Security</h2>
              <div className="bg-gray-50 p-6 rounded-lg">
                <ul className="text-gray-700 space-y-2">
                  <li>✅ <strong>Secure Processing:</strong> All files are processed securely and deleted after analysis</li>
                  <li>✅ <strong>No Data Storage:</strong> We don't permanently store your resume content</li>
                  <li>✅ <strong>HTTPS Encryption:</strong> All data transmission is encrypted</li>
                  <li>✅ <strong>Rate Limiting:</strong> Protection against abuse and overuse</li>
                  <li>✅ <strong>Transparent:</strong> Clear privacy policy and terms of service</li>
                </ul>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Who Should Use ProfileCrafted?</h2>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li><strong>Aspiring APMs:</strong> Students and professionals targeting APM roles</li>
                <li><strong>Career Changers:</strong> Those transitioning into product management</li>
                <li><strong>Recent Graduates:</strong> New grads preparing for APM applications</li>
                <li><strong>Current PMs:</strong> Product managers looking to optimize their resumes</li>
                <li><strong>Career Coaches:</strong> Professionals helping others with PM career guidance</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Limitations & Disclaimers</h2>
              <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
                <p className="text-yellow-800 text-sm mb-2">
                  <strong>Important:</strong> ProfileCrafted is an educational tool designed to provide insights and feedback.
                </p>
                <ul className="text-yellow-700 text-sm space-y-1">
                  <li>• AI analysis may contain biases or errors</li>
                  <li>• Results should supplement, not replace, professional career advice</li>
                  <li>• Success in APM roles depends on many factors beyond resume content</li>
                  <li>• Different companies may have varying evaluation criteria</li>
                </ul>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Support & Contact</h2>
              <p className="text-gray-700 mb-4">
                Questions, feedback, or need help? We're here to assist:
              </p>
              <ul className="text-gray-700 space-y-2">
                <li>📧 <strong>General Support:</strong> <a href="mailto:support@profilecrafted.com" className="text-blue-600 hover:underline">support@profilecrafted.com</a></li>
                <li>🔒 <strong>Privacy Questions:</strong> <a href="mailto:privacy@profilecrafted.com" className="text-blue-600 hover:underline">privacy@profilecrafted.com</a></li>
                <li>⚖️ <strong>Legal Matters:</strong> <a href="mailto:legal@profilecrafted.com" className="text-blue-600 hover:underline">legal@profilecrafted.com</a></li>
              </ul>
            </section>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-200 flex justify-between items-center">
            <Link 
              href="/" 
              className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium"
            >
              ← Back to ProfileCrafted
            </Link>
            <div className="text-sm text-gray-500">
              Built with ❤️ for the PM community
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
