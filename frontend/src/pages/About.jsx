export default function About() {
  return (
    <div>
      {/* Hero Section */}
      <section style={{
        background: 'linear-gradient(135deg, #f7d6d0 0%, #faf5f3 50%, #e8cfc0 100%)',
        padding: '120px 0 100px',
        textAlign: 'center'
      }}>
        <div className="container">
          <h1 style={{
            fontFamily: 'Cormorant Garamond, serif',
            fontSize: '64px',
            background: 'linear-gradient(135deg, #d4538a 0%, #c9a96e 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            marginBottom: '24px',
            fontWeight: 700,
            letterSpacing: '-0.02em',
            filter: 'drop-shadow(0 4px 8px rgba(212, 83, 138, 0.2))'
          }}>
            About SHYNIA
          </h1>
          <div style={{ width: '60px', height: '2px', background: 'linear-gradient(90deg, transparent, #d4538a, transparent)', margin: '0 auto 24px' }} />
          <p style={{ fontSize: '19px', color: '#8b5e52', maxWidth: '650px', margin: '0 auto', lineHeight: 2, letterSpacing: '0.03em' }}>
            Luxury nail polish for the modern, confident woman
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section style={{ padding: '120px 0', background: 'linear-gradient(135deg, #fffaf8 0%, #faf5f3 100%)' }}>
        <div className="container">
          <div style={{ maxWidth: '850px', margin: '0 auto' }}>
            <h2 style={{
              fontFamily: 'Cormorant Garamond, serif',
              fontSize: '48px',
              color: '#3d2b27',
              marginBottom: '28px',
              fontWeight: 700,
              letterSpacing: '0.08em'
            }}>
              Our Mission
            </h2>
            <div style={{ width: '60px', height: '2px', background: 'linear-gradient(90deg, transparent, #d4538a, transparent)', marginBottom: '32px' }} />
            <p style={{
              fontSize: '17px',
              color: '#8b5e52',
              lineHeight: 2,
              marginBottom: '24px',
              letterSpacing: '0.04em'
            }}>
              At SHYNIA, we believe that beautiful nails are a form of self-expression. Our mission is to create premium nail polish collections that empower women to express their individuality with confidence and style.
            </p>
            <p style={{
              fontSize: '17px',
              color: '#8b5e52',
              lineHeight: 2,
              letterSpacing: '0.04em'
            }}>
              Every formula is carefully crafted using the finest ingredients to ensure long-lasting color, perfect shine, and a velvety finish that feels as beautiful as it looks.
            </p>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section style={{ padding: '120px 0', background: 'linear-gradient(135deg, #fff5f2 0%, #faf5f3 100%)' }}>
        <div className="container">
          <h2 style={{
            fontFamily: 'Cormorant Garamond, serif',
            fontSize: '48px',
            textAlign: 'center',
            color: '#3d2b27',
            marginBottom: '32px',
            fontWeight: 700,
            letterSpacing: '0.08em'
          }}>
            Why Choose SHYNIA?
          </h2>
          <div style={{ width: '60px', height: '2px', background: 'linear-gradient(90deg, transparent, #d4538a, transparent)', margin: '0 auto 56px' }} />

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '48px'
          }}>
            {[
              {
                icon: '💎',
                title: 'Premium Quality',
                desc: 'Only the finest ingredients and formulations for optimal results'
              },
              {
                icon: '🎨',
                title: 'Stunning Colors',
                desc: 'Carefully curated shades that suit every skin tone and mood'
              },
              {
                icon: '⏱️',
                title: 'Long-Lasting',
                desc: 'Gel, Matte, and Glossy finishes that last week after week'
              },
              {
                icon: '✨',
                title: 'Cruelty-Free',
                desc: 'Never tested on animals, always ethically produced'
              },
              {
                icon: '📦',
                title: 'Beautiful Packaging',
                desc: 'Luxury unboxing experience that looks gorgeous on your shelf'
              },
              {
                icon: '❤️',
                title: 'Customer Care',
                desc: 'Dedicated support team ready to help with any questions'
              }
            ].map((item, i) => (
              <div key={i} style={{
                background: 'rgba(255, 255, 255, 0.85)',
                backdropFilter: 'blur(12px)',
                border: '1.5px solid rgba(236, 221, 216, 0.7)',
                borderRadius: '16px',
                padding: '48px 36px',
                textAlign: 'center',
                transition: 'all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)',
                boxShadow: '0 8px 32px rgba(61, 43, 39, 0.08)'
              }}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = 'translateY(-12px)';
                  e.currentTarget.style.boxShadow = '0 24px 56px rgba(212, 83, 138, 0.2)';
                  e.currentTarget.style.borderColor = 'rgba(212, 83, 138, 0.4)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 8px 32px rgba(61, 43, 39, 0.08)';
                  e.currentTarget.style.borderColor = 'rgba(236, 221, 216, 0.7)';
                }}
              >
                <div style={{ fontSize: '54px', marginBottom: '20px' }}>{item.icon}</div>
                <h3 style={{
                  fontSize: '22px',
                  color: '#3d2b27',
                  marginBottom: '14px',
                  fontWeight: 700,
                  letterSpacing: '0.05em'
                }}>
                  {item.title}
                </h3>
                <p style={{
                  fontSize: '15px',
                  color: '#8b5e52',
                  lineHeight: 1.8,
                  letterSpacing: '0.03em'
                }}>
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section style={{ padding: '120px 0', background: 'linear-gradient(135deg, #fffaf8 0%, #faf5f3 100%)' }}>
        <div className="container">
          <div style={{ maxWidth: '850px', margin: '0 auto' }}>
            <h2 style={{
              fontFamily: 'Cormorant Garamond, serif',
              fontSize: '48px',
              color: '#3d2b27',
              marginBottom: '28px',
              fontWeight: 700,
              letterSpacing: '0.08em',
              textAlign: 'center'
            }}>
              Our Story
            </h2>
            <div style={{ width: '60px', height: '2px', background: 'linear-gradient(90deg, transparent, #d4538a, transparent)', margin: '0 auto 32px' }} />
            <p style={{
              fontSize: '17px',
              color: '#8b5e52',
              lineHeight: 2,
              marginBottom: '24px',
              letterSpacing: '0.04em',
              textAlign: 'center'
            }}>
              SHYNIA was born from a passion for beauty and a vision to create nail polishes that are more than just color—they're a statement. Founded by beauty enthusiasts who believed the market was missing truly premium options, we set out to create something special.
            </p>
            <p style={{
              fontSize: '17px',
              color: '#8b5e52',
              lineHeight: 2,
              textAlign: 'center',
              letterSpacing: '0.04em'
            }}>
              Today, SHYNIA serves customers across the world who trust us with their beauty routines. Every polish created is a testament to our commitment to quality, innovation, and celebrating the beauty of individuality.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section style={{
        background: 'linear-gradient(135deg, #d4538a 0%, #c9a96e 100%)',
        padding: '100px 0',
        textAlign: 'center'
      }}>
        <div className="container">
          <h2 style={{
            fontFamily: 'Cormorant Garamond, serif',
            fontSize: '48px',
            color: '#fff',
            marginBottom: '28px',
            fontWeight: 700,
            letterSpacing: '0.08em'
          }}>
            Ready to Get SHYNIA?
          </h2>
          <p style={{
            fontSize: '19px',
            color: 'rgba(255, 255, 255, 0.95)',
            marginBottom: '40px',
            maxWidth: '650px',
            margin: '0 auto 40px',
            lineHeight: 1.9,
            letterSpacing: '0.04em'
          }}>
            Explore our full collection and find your perfect shade today
          </p>
          <a href="/products" className="btn-primary" style={{
            padding: '16px 52px',
            background: '#fff',
            color: '#d4538a',
            fontWeight: 800,
            fontSize: '14px'
          }}>
            🛍️ Shop Now
          </a>
        </div>
      </section>
    </div>
  );
}
