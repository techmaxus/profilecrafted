import Link from 'next/link';

export default function Footer() {
  return (
    <footer style={{
      background: 'linear-gradient(135deg, #9ca3af 0%, #6b7280 25%, #10b981 75%, #059669 100%)',
      marginTop: '64px',
      color: 'white'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '48px 32px'
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '40px',
          marginBottom: '32px'
        }}>
          {/* Brand */}
          <div>
            <h3 style={{
              fontSize: '24px',
              fontWeight: '700',
              marginBottom: '16px',
              color: 'white'
            }}>
              ProfileCrafted
            </h3>
            <p style={{
              color: 'rgba(255, 255, 255, 0.9)',
              fontSize: '16px',
              lineHeight: '1.6',
              marginBottom: '20px'
            }}>
              AI-powered resume analysis for Associate Product Manager roles at top tech companies.
            </p>
            <div style={{
              display: 'flex',
              gap: '12px',
              alignItems: 'center'
            }}>
              <span style={{
                background: 'rgba(255, 255, 255, 0.2)',
                padding: '6px 12px',
                borderRadius: '20px',
                fontSize: '12px',
                fontWeight: '600'
              }}>
                ✨ AI-Powered
              </span>
              <span style={{
                background: 'rgba(255, 255, 255, 0.2)',
                padding: '6px 12px',
                borderRadius: '20px',
                fontSize: '12px',
                fontWeight: '600'
              }}>
                🎯 APM-Focused
              </span>
            </div>
          </div>

          {/* Product */}
          <div>
            <h4 style={{
              fontSize: '18px',
              fontWeight: '600',
              marginBottom: '20px',
              color: 'white'
            }}>
              Product
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              <li style={{ marginBottom: '12px' }}>
                <Link 
                  href="/about" 
                  style={{
                    color: 'rgba(255, 255, 255, 0.8)',
                    textDecoration: 'none',
                    fontSize: '15px',
                    transition: 'color 0.2s ease',
                    display: 'block',
                    padding: '4px 0'
                  }}
                  onMouseOver={(e) => (e.target as HTMLElement).style.color = 'white'}
                  onMouseOut={(e) => (e.target as HTMLElement).style.color = 'rgba(255, 255, 255, 0.8)'}
                >
                  How It Works
                </Link>
              </li>
              <li style={{ marginBottom: '12px' }}>
                <Link 
                  href="/faq" 
                  style={{
                    color: 'rgba(255, 255, 255, 0.8)',
                    textDecoration: 'none',
                    fontSize: '15px',
                    transition: 'color 0.2s ease',
                    display: 'block',
                    padding: '4px 0'
                  }}
                  onMouseOver={(e) => (e.target as HTMLElement).style.color = 'white'}
                  onMouseOut={(e) => (e.target as HTMLElement).style.color = 'rgba(255, 255, 255, 0.8)'}
                >
                  FAQ
                </Link>
              </li>
              <li style={{ marginBottom: '12px' }}>
                <Link 
                  href="/contact" 
                  style={{
                    color: 'rgba(255, 255, 255, 0.8)',
                    textDecoration: 'none',
                    fontSize: '15px',
                    transition: 'color 0.2s ease',
                    display: 'block',
                    padding: '4px 0'
                  }}
                  onMouseOver={(e) => (e.target as HTMLElement).style.color = 'white'}
                  onMouseOut={(e) => (e.target as HTMLElement).style.color = 'rgba(255, 255, 255, 0.8)'}
                >
                  Support
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 style={{
              fontSize: '18px',
              fontWeight: '600',
              marginBottom: '20px',
              color: 'white'
            }}>
              Legal
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              <li style={{ marginBottom: '12px' }}>
                <Link 
                  href="/privacy" 
                  style={{
                    color: 'rgba(255, 255, 255, 0.8)',
                    textDecoration: 'none',
                    fontSize: '15px',
                    transition: 'color 0.2s ease',
                    display: 'block',
                    padding: '4px 0'
                  }}
                  onMouseOver={(e) => (e.target as HTMLElement).style.color = 'white'}
                  onMouseOut={(e) => (e.target as HTMLElement).style.color = 'rgba(255, 255, 255, 0.8)'}
                >
                  Privacy Policy
                </Link>
              </li>
              <li style={{ marginBottom: '12px' }}>
                <Link 
                  href="/terms" 
                  style={{
                    color: 'rgba(255, 255, 255, 0.8)',
                    textDecoration: 'none',
                    fontSize: '15px',
                    transition: 'color 0.2s ease',
                    display: 'block',
                    padding: '4px 0'
                  }}
                  onMouseOver={(e) => (e.target as HTMLElement).style.color = 'white'}
                  onMouseOut={(e) => (e.target as HTMLElement).style.color = 'rgba(255, 255, 255, 0.8)'}
                >
                  Terms of Service
                </Link>
              </li>
              <li style={{ marginBottom: '12px' }}>
                <a 
                  href="mailto:lakshaykapoor.nsut@gmail.com?subject=Legal%20Inquiries%20-%20ProfileCrafted" 
                  style={{
                    color: 'rgba(255, 255, 255, 0.8)',
                    textDecoration: 'none',
                    fontSize: '15px',
                    transition: 'color 0.2s ease',
                    display: 'block',
                    padding: '4px 0'
                  }}
                  onMouseOver={(e) => (e.target as HTMLElement).style.color = 'white'}
                  onMouseOut={(e) => (e.target as HTMLElement).style.color = 'rgba(255, 255, 255, 0.8)'}
                >
                  Legal Inquiries
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 style={{
              fontSize: '18px',
              fontWeight: '600',
              marginBottom: '20px',
              color: 'white'
            }}>
              Contact
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              <li style={{ marginBottom: '12px' }}>
                <a 
                  href="mailto:lakshaykapoor.nsut@gmail.com?subject=General%20Support%20-%20ProfileCrafted" 
                  style={{
                    color: 'rgba(255, 255, 255, 0.8)',
                    textDecoration: 'none',
                    fontSize: '15px',
                    transition: 'color 0.2s ease',
                    display: 'block',
                    padding: '4px 0'
                  }}
                  onMouseOver={(e) => (e.target as HTMLElement).style.color = 'white'}
                  onMouseOut={(e) => (e.target as HTMLElement).style.color = 'rgba(255, 255, 255, 0.8)'}
                >
                  General Support
                </a>
              </li>
              <li style={{ marginBottom: '12px' }}>
                <a 
                  href="mailto:lakshaykapoor.nsut@gmail.com?subject=Privacy%20Questions%20-%20ProfileCrafted" 
                  style={{
                    color: 'rgba(255, 255, 255, 0.8)',
                    textDecoration: 'none',
                    fontSize: '15px',
                    transition: 'color 0.2s ease',
                    display: 'block',
                    padding: '4px 0'
                  }}
                  onMouseOver={(e) => (e.target as HTMLElement).style.color = 'white'}
                  onMouseOut={(e) => (e.target as HTMLElement).style.color = 'rgba(255, 255, 255, 0.8)'}
                >
                  Privacy Questions
                </a>
              </li>
              <li style={{ marginBottom: '12px' }}>
                <a 
                  href="mailto:lakshaykapoor.nsut@gmail.com?subject=Feature%20Requests%20-%20ProfileCrafted" 
                  style={{
                    color: 'rgba(255, 255, 255, 0.8)',
                    textDecoration: 'none',
                    fontSize: '15px',
                    transition: 'color 0.2s ease',
                    display: 'block',
                    padding: '4px 0'
                  }}
                  onMouseOver={(e) => (e.target as HTMLElement).style.color = 'white'}
                  onMouseOut={(e) => (e.target as HTMLElement).style.color = 'rgba(255, 255, 255, 0.8)'}
                >
                  Feature Requests
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div style={{
          borderTop: '1px solid rgba(255, 255, 255, 0.2)',
          paddingTop: '32px',
          marginTop: '32px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '16px'
        }}>
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '12px',
            textAlign: 'center'
          }}>
            <p style={{
              color: 'rgba(255, 255, 255, 0.9)',
              fontSize: '16px',
              fontWeight: '500',
              margin: 0
            }}>
              &copy; 2025 ProfileCrafted • Built with &hearts; for the PM community
            </p>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
              flexWrap: 'wrap',
              justifyContent: 'center'
            }}>
              <span style={{
                color: 'rgba(255, 255, 255, 0.7)',
                fontSize: '14px'
              }}>
                Powered by
              </span>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px'
              }}>
                <span style={{
                  background: 'rgba(255, 255, 255, 0.15)',
                  padding: '4px 8px',
                  borderRadius: '12px',
                  color: 'white',
                  fontSize: '12px',
                  fontWeight: '600'
                }}>
                  OpenAI
                </span>
                <span style={{
                  background: 'rgba(255, 255, 255, 0.15)',
                  padding: '4px 8px',
                  borderRadius: '12px',
                  color: 'white',
                  fontSize: '12px',
                  fontWeight: '600'
                }}>
                  Vercel
                </span>
                <span style={{
                  background: 'rgba(255, 255, 255, 0.15)',
                  padding: '4px 8px',
                  borderRadius: '12px',
                  color: 'white',
                  fontSize: '12px',
                  fontWeight: '600'
                }}>
                  Cloudflare
                </span>
              </div>
            </div>
            <p style={{
              color: 'rgba(255, 255, 255, 0.7)',
              fontSize: '14px',
              margin: 0
            }}>
              Vibe coded by{' '}
              <a 
                href="https://www.linkedin.com/in/techmaxus/" 
                target="_blank" 
                rel="noopener noreferrer"
                style={{
                  color: 'rgba(255, 255, 255, 0.9)',
                  textDecoration: 'none',
                  fontWeight: '600',
                  transition: 'color 0.2s ease'
                }}
                onMouseOver={(e) => (e.target as HTMLElement).style.color = 'white'}
                onMouseOut={(e) => (e.target as HTMLElement).style.color = 'rgba(255, 255, 255, 0.9)'}
              >
                Lakshay Kapoor
              </a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
