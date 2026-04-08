import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import api from '../api/axios';
import ProductCard from '../components/ProductCard';

export default function Home() {
  const [featured, setFeatured] = useState([]);
  const [homeProducts, setHomeProducts] = useState([]);
  const [containerColors, setContainerColors] = useState([null, null, null]);
  const [selectedBottle, setSelectedBottle] = useState(null);
  const [gameScore, setGameScore] = useState(0);
  const [currentSlide, setCurrentSlide] = useState(0);

  const bannerSlides = [
    {
      title: '✨ Luxury Nail Polish',
      subtitle: 'Premium Finishes, Long-Lasting Color',
      cta: 'Explore Now',
      background: 'linear-gradient(135deg, #d4538a 0%, #c9a96e 100%)',
      btnColor: '#fff'
    },
    {
      title: '💅 Gel Collection',
      subtitle: 'Mirror Shine That Lasts 21+ Days',
      cta: 'Shop Gel',
      background: 'linear-gradient(135deg, #f7d6d0 0%, #d4a5c9 100%)',
      btnColor: '#3d2b27'
    },
    {
      title: '🖤 Matte Perfection',
      subtitle: 'Velvety Finish, Sophisticated Look',
      cta: 'Browse Matte',
      background: 'linear-gradient(135deg, #c9a96e 0%, #8b5e52 100%)',
      btnColor: '#fff'
    },
    {
      title: '✨ Glossy Vibes',
      subtitle: 'High-Shine Colors, Vibrant Appeal',
      cta: 'View Glossy',
      background: 'linear-gradient(135deg, #f7a8b0 0%, #d4a5c9 100%)',
      btnColor: '#3d2b27'
    }
  ];

  const bottleColors = [
    { color: '#d4a5c9', name: 'Orchid', hex: '#d4a5c9' },
    { color: '#c9a96e', name: 'Gold', hex: '#c9a96e' },
    { color: '#f7a8b0', name: 'Rose', hex: '#f7a8b0' },
    { color: '#a8c5c9', name: 'Mint', hex: '#a8c5c9' },
    { color: '#d4538a', name: 'Berry', hex: '#d4538a' },
    { color: '#8b5e52', name: 'Mocha', hex: '#8b5e52' },
    { color: '#e8a87c', name: 'Peach', hex: '#e8a87c' },
    { color: '#d4a5c9', name: 'Plum', hex: '#d4a5c9' }
  ];

  const mixColors = (hex1, hex2) => {
    const c1 = parseInt(hex1.slice(1), 16);
    const c2 = parseInt(hex2.slice(1), 16);
    const r = Math.round((((c1 >> 16) & 255) + ((c2 >> 16) & 255)) / 2);
    const g = Math.round((((c1 >> 8) & 255) + ((c2 >> 8) & 255)) / 2);
    const b = Math.round(((c1 & 255) + (c2 & 255)) / 2);
    return '#' + [r, g, b].map(x => x.toString(16).padStart(2, '0')).join('');
  };

  const addColorToContainer = (bottleIdx, containerIdx) => {
    if (selectedBottle === bottleIdx) {
      const newColors = [...containerColors];
      const bottleHex = bottleColors[bottleIdx].hex;
      
      if (newColors[containerIdx] === null) {
        newColors[containerIdx] = bottleHex;
      } else {
        newColors[containerIdx] = mixColors(newColors[containerIdx], bottleHex);
      }
      
      setContainerColors(newColors);
      setGameScore(gameScore + 10);
      setSelectedBottle(null);
    } else {
      setSelectedBottle(bottleIdx);
    }
  };

  const shrinkContainer = (containerIdx) => {
    const newColors = [...containerColors];
    if (newColors[containerIdx]) {
      newColors[containerIdx] = null;
      setContainerColors(newColors);
      setGameScore(Math.max(0, gameScore - 5));
    }
  };

  const resetGame = () => {
    setContainerColors([null, null, null]);
    setSelectedBottle(null);
    setGameScore(0);
  };

  useEffect(() => {
    api.get('/products').then(r => {
      setFeatured(r.data.slice(0, 4));
      setHomeProducts(r.data.slice(0, 12)); // Fetch more for home
    }).catch(() => {});
  }, []);

  // Auto-rotate slider every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % bannerSlides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [bannerSlides.length]);

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % bannerSlides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + bannerSlides.length) % bannerSlides.length);
  };

  return (
    <div>
      {/* Image Banner Slider */}
      <section style={{
        position: 'relative',
        minHeight: '600px',
        overflow: 'hidden',
        background: '#000'
      }}>
        {/* Slider Container */}
        <div style={{
          position: 'relative',
          width: '100%',
          height: '600px',
          display: 'flex',
          alignItems: 'stretch'
        }}>
          {/* Slides */}
          {bannerSlides.map((slide, idx) => (
            <div
              key={idx}
              style={{
                position: 'absolute',
                width: '100%',
                height: '100%',
                background: slide.background,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                opacity: currentSlide === idx ? 1 : 0,
                transition: 'opacity 0.8s ease-in-out',
                zIndex: currentSlide === idx ? 2 : 0
              }}
            >
              {/* Background Pattern */}
              <div
                style={{
                  position: 'absolute',
                  width: '100%',
                  height: '100%',
                  backgroundImage: `radial-gradient(circle at 20% 50%, rgba(255,255,255,0.15) 0%, transparent 50%), 
                                   radial-gradient(circle at 80% 80%, rgba(255,255,255,0.1) 0%, transparent 50%)`,
                  zIndex: 0
                }}
              />

              {/* Content */}
              <div
                className="container"
                style={{
                  position: 'relative',
                  zIndex: 1,
                  textAlign: 'center',
                  animation: currentSlide === idx ? 'slideInContent 0.8s ease-out 0.2s backwards' : 'none',
                  color: slide.btnColor
                }}
              >
                <h1
                  style={{
                    fontFamily: 'Cormorant Garamond, serif',
                    fontSize: 'clamp(48px, 8vw, 80px)',
                    fontWeight: 700,
                    marginBottom: '20px',
                    letterSpacing: '-0.02em',
                    lineHeight: 1.1,
                    textShadow: '0 4px 20px rgba(0,0,0,0.2)'
                  }}
                >
                  {slide.title}
                </h1>
                <p
                  style={{
                    fontSize: 'clamp(16px, 3vw, 24px)',
                    marginBottom: '40px',
                    fontWeight: 500,
                    letterSpacing: '0.03em',
                    maxWidth: '500px',
                    margin: '0 auto 40px',
                    opacity: 0.95,
                    textShadow: '0 2px 10px rgba(0,0,0,0.15)'
                  }}
                >
                  {slide.subtitle}
                </p>
                <Link
                  to="/products"
                  style={{
                    display: 'inline-block',
                    padding: '16px 48px',
                    background: slide.btnColor === '#fff' ? 'rgba(255,255,255,0.25)' : 'rgba(61,43,39,0.25)',
                    color: slide.btnColor,
                    border: `2px solid ${slide.btnColor}`,
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontWeight: 800,
                    textDecoration: 'none',
                    transition: 'all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    cursor: 'pointer',
                    backdropFilter: 'blur(10px)',
                    boxShadow: '0 8px 32px rgba(0,0,0,0.2)'
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.background = slide.btnColor;
                    e.currentTarget.style.color = slide.btnColor === '#fff' ? '#3d2b27' : '#fff';
                    e.currentTarget.style.transform = 'translateY(-3px)';
                    e.currentTarget.style.boxShadow = '0 16px 48px rgba(0,0,0,0.4)';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.background = slide.btnColor === '#fff' ? 'rgba(255,255,255,0.25)' : 'rgba(61,43,39,0.25)';
                    e.currentTarget.style.color = slide.btnColor;
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 8px 32px rgba(0,0,0,0.2)';
                  }}
                >
                  {slide.cta} →
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Navigation Arrows */}
        <button
          onClick={prevSlide}
          style={{
            position: 'absolute',
            left: '32px',
            top: '50%',
            transform: 'translateY(-50%)',
            width: '56px',
            height: '56px',
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.25)',
            border: '2px solid rgba(255,255,255,0.5)',
            color: '#fff',
            fontSize: '24px',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            zIndex: 3,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backdropFilter: 'blur(10px)'
          }}
          onMouseEnter={e => {
            e.currentTarget.style.background = 'rgba(255,255,255,0.4)';
            e.currentTarget.style.transform = 'translateY(-50%) scale(1.1)';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = 'rgba(255,255,255,0.25)';
            e.currentTarget.style.transform = 'translateY(-50%) scale(1)';
          }}
        >
          ←
        </button>

        <button
          onClick={nextSlide}
          style={{
            position: 'absolute',
            right: '32px',
            top: '50%',
            transform: 'translateY(-50%)',
            width: '56px',
            height: '56px',
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.25)',
            border: '2px solid rgba(255,255,255,0.5)',
            color: '#fff',
            fontSize: '24px',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            zIndex: 3,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backdropFilter: 'blur(10px)'
          }}
          onMouseEnter={e => {
            e.currentTarget.style.background = 'rgba(255,255,255,0.4)';
            e.currentTarget.style.transform = 'translateY(-50%) scale(1.1)';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = 'rgba(255,255,255,0.25)';
            e.currentTarget.style.transform = 'translateY(-50%) scale(1)';
          }}
        >
          →
        </button>

        {/* Dot Indicators */}
        <div
          style={{
            position: 'absolute',
            bottom: '32px',
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            gap: '12px',
            zIndex: 3
          }}
        >
          {bannerSlides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => goToSlide(idx)}
              style={{
                width: currentSlide === idx ? '40px' : '12px',
                height: '12px',
                borderRadius: '6px',
                background: currentSlide === idx ? '#fff' : 'rgba(255,255,255,0.5)',
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                boxShadow: currentSlide === idx ? '0 4px 12px rgba(255,255,255,0.4)' : 'none'
              }}
              onMouseEnter={e => {
                if (currentSlide !== idx) {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.7)';
                }
              }}
              onMouseLeave={e => {
                if (currentSlide !== idx) {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.5)';
                }
              }}
            />
          ))}
        </div>

        <style>{`
          @keyframes slideInContent { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
        `}</style>
      </section>

      {/* Shop by Category */}
      <section style={{ padding: '80px 0', background: '#fff' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '60px' }}>
            <h2 style={{
              fontFamily: 'Cormorant Garamond, serif',
              fontSize: 'clamp(36px, 5vw, 52px)',
              color: '#3d2b27',
              marginBottom: '16px',
              fontWeight: 700
            }}>
              Shop by Category
            </h2>
            <p style={{
              fontSize: '16px',
              color: '#9e7b74',
              maxWidth: '600px',
              margin: '0 auto'
            }}>
              Discover our premium collections – from glossy shines to matte elegance
            </p>
          </div>

          {/* Category Links */}
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '20px',
            marginBottom: '60px',
            flexWrap: 'wrap'
          }}>
            {['', 'Gel', 'Matte', 'Glossy'].map(cat => (
              <Link
                key={cat}
                to={`/products${cat ? `?category=${cat}` : ''}`}
                style={{
                  padding: '12px 24px',
                  fontSize: '14px',
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  border: '2px solid #ecddd8',
                  background: 'transparent',
                  color: '#3d2b27',
                  borderRadius: '24px',
                  textDecoration: 'none',
                  fontWeight: 700,
                  transition: 'all 0.3s ease',
                  cursor: 'pointer'
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = '#d4538a';
                  e.currentTarget.style.color = '#d4538a';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = '#ecddd8';
                  e.currentTarget.style.color = '#3d2b27';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                {cat || 'All Collections'}
              </Link>
            ))}
          </div>

          {/* Products Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '32px',
            justifyContent: 'center'
          }}>
            {homeProducts.map(p => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>

          <div style={{ textAlign: 'center', marginTop: '60px' }}>
            <Link
              to="/products"
              className="btn-primary"
              style={{
                padding: '16px 32px',
                fontSize: '14px',
                letterSpacing: '0.08em',
                textTransform: 'uppercase'
              }}
            >
              View All Products →
            </Link>
          </div>
        </div>
      </section>

      {/* Hero */}
      <section style={{
        background: 'linear-gradient(135deg, #f7d6d0 0%, #faf5f3 40%, #e8cfc0 100%)',
        minHeight: '90vh',
        display: 'flex',
        alignItems: 'center',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Animated background elements */}
        <div style={{
          position: 'absolute',
          width: '300px',
          height: '300px',
          background: 'radial-gradient(circle, rgba(212, 83, 138, 0.1) 0%, transparent 70%)',
          borderRadius: '50%',
          top: '-100px',
          right: '-50px',
          animation: 'float 8s ease-in-out infinite'
        }} />
        
        <div className="container" style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '60px',
          alignItems: 'center',
          position: 'relative',
          zIndex: 2
        }}>
          <div style={{ animation: 'slideIn 0.8s ease-out' }}>
            <p style={{
              fontSize: '13px',
              letterSpacing: '0.3em',
              textTransform: 'uppercase',
              background: 'linear-gradient(135deg, #d4538a 0%, #c9a96e 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              marginBottom: '20px',
              fontWeight: 800,
              filter: 'drop-shadow(0 2px 4px rgba(212, 83, 138, 0.2))'
            }}>
              ✨ Premium Nail Polish Collection
            </p>
            <h1 style={{
              fontFamily: 'Cormorant Garamond, serif',
              fontSize: 'clamp(56px, 7vw, 90px)',
              lineHeight: 1.05,
              background: 'linear-gradient(135deg, #3d2b27 0%, #8b5e52 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              marginBottom: '28px',
              fontWeight: 700,
              letterSpacing: '-0.025em',
              filter: 'drop-shadow(0 4px 8px rgba(61, 43, 39, 0.1))'
            }}>
              Beauty at<br />Your Fingertips
            </h1>
            <p style={{
              fontSize: '17px',
              color: '#8b5e52',
              lineHeight: 1.9,
              marginBottom: '40px',
              maxWidth: '450px',
              letterSpacing: '0.04em'
            }}>
              Discover our curated collection of luxury nail polishes — from gel glossy finishes to velvety matte perfection. Premium quality, premium experience.
            </p>
            <div style={{ display: 'flex', gap: '18px', flexWrap: 'wrap' }}>
              <Link to="/products" className="btn-primary" style={{ padding: '15px 40px', fontSize: '13px' }}>
                👉 Shop Now
              </Link>
              <Link to="/products?category=Gel" className="btn-outline" style={{ padding: '15px 40px', fontSize: '13px' }}>
                Explore Gel
              </Link>
            </div>
          </div>

          {/* Decorative polish bottles */}
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '20px',
            alignItems: 'flex-end',
            animation: 'slideIn 0.8s ease-out 0.1s backwards'
          }}>
            {[
              { h: 160, color: '#d4a5c9', delay: '0s' },
              { h: 200, color: '#c9a96e', delay: '0.1s' },
              { h: 140, color: '#f7a8b0', delay: '0.2s' },
              { h: 180, color: '#a8c5c9', delay: '0.3s' }
            ].map((b, i) => (
              <div key={i} style={{
                width: '48px',
                height: b.h,
                background: `linear-gradient(180deg, ${b.color} 0%, ${b.color}dd 100%)`,
                borderRadius: '24px 24px 6px 6px',
                boxShadow: `0 16px 40px rgba(212, 83, 138, 0.25), inset 0 -4px 8px rgba(0,0,0,0.1)`,
                animation: `float 3s ease-in-out infinite`,
                animationDelay: b.delay,
                position: 'relative',
                transition: 'transform 0.3s ease'
              }} />
            ))}
          </div>
        </div>
        <style>{`
          @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-16px)} }
          @keyframes slideIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        `}</style>
      </section>

      {/* Categories */}
      <section style={{ padding: '100px 0', background: 'linear-gradient(135deg, #fffaf8 0%, #faf5f3 100%)' }}>
        <div className="container">
          <h2 style={{
            textAlign: 'center',
            fontSize: '42px',
            marginBottom: '12px',
            color: '#3d2b27',
            fontFamily: 'Cormorant Garamond, serif',
            fontWeight: 600,
            letterSpacing: '0.05em'
          }}>
            Shop by Finish
          </h2>
          <p style={{
            textAlign: 'center',
            color: '#9e7b74',
            marginBottom: '56px',
            fontSize: '16px',
            letterSpacing: '0.03em'
          }}>
            Find your perfect formula
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '28px' }}>
            {[
              { name: 'Gel', desc: 'Long-lasting, mirror shine', color: '#f7d6d0', icon: '💅' },
              { name: 'Matte', desc: 'Velvety, sophisticated finish', color: '#e8cfc0', icon: '🖤' },
              { name: 'Glossy', desc: 'Vibrant, high-shine colour', color: '#f0e0e8', icon: '✨' }
            ].map(cat => (
              <Link key={cat.name} to={`/products?category=${cat.name}`}>
                <div style={{
                  background: cat.color,
                  borderRadius: '12px',
                  padding: '56px 32px',
                  textAlign: 'center',
                  transition: 'all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
                  cursor: 'pointer',
                  boxShadow: '0 8px 24px rgba(61, 43, 39, 0.1)',
                  position: 'relative',
                  overflow: 'hidden'
                }}
                  onMouseEnter={e => {
                    e.currentTarget.style.transform = 'translateY(-8px)';
                    e.currentTarget.style.boxShadow = '0 20px 48px rgba(212, 83, 138, 0.2)';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 8px 24px rgba(61, 43, 39, 0.1)';
                  }}
                >
                  <div style={{ fontSize: '48px', marginBottom: '20px' }}>{cat.icon}</div>
                  <h3 style={{
                    fontSize: '26px',
                    marginBottom: '10px',
                    color: '#3d2b27',
                    fontFamily: 'Cormorant Garamond, serif',
                    fontWeight: 600,
                    letterSpacing: '0.05em'
                  }}>{cat.name}</h3>
                  <p style={{ fontSize: '14px', color: '#8b5e52', letterSpacing: '0.03em' }}>{cat.desc}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Interactive Color Mixing Game */}
      <section style={{
        padding: '100px 0',
        background: 'linear-gradient(135deg, #fff5f2 0%, #fffaf8 100%)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div className="container">
          <h2 style={{
            textAlign: 'center',
            fontFamily: 'Cormorant Garamond, serif',
            fontSize: '42px',
            marginBottom: '12px',
            color: '#3d2b27',
            fontWeight: 600,
            letterSpacing: '0.05em'
          }}>
            🎮 Color Mixing Game
          </h2>
          <p style={{
            textAlign: 'center',
            color: '#9e7b74',
            marginBottom: '48px',
            fontSize: '16px',
            letterSpacing: '0.03em'
          }}>
            Pick a color bottle, drop it in containers & watch colors blend! 🎨
          </p>

          {/* Game Container */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.7)',
            backdropFilter: 'blur(10px)',
            border: '2px solid rgba(212, 83, 138, 0.2)',
            borderRadius: '20px',
            padding: '48px',
            marginBottom: '48px',
            boxShadow: '0 16px 48px rgba(61, 43, 39, 0.08)'
          }}>
            {/* Score & Controls */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '40px',
              flexWrap: 'wrap',
              gap: '20px'
            }}>
              <div style={{
                fontSize: '24px',
                fontWeight: 800,
                color: '#d4538a',
                letterSpacing: '0.1em'
              }}>
                🏆 Score: <span style={{ fontSize: '32px' }}>{gameScore}</span>
              </div>
              <button
                onClick={resetGame}
                style={{
                  padding: '12px 28px',
                  background: '#d4538a',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '20px',
                  fontSize: '13px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  letterSpacing: '0.08em',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 6px 16px rgba(212, 83, 138, 0.3)'
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = 'translateY(-3px)';
                  e.currentTarget.style.boxShadow = '0 10px 24px rgba(212, 83, 138, 0.4)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 6px 16px rgba(212, 83, 138, 0.3)';
                }}
              >
                🔄 Reset Game
              </button>
            </div>

            {/* Game Layout */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '60px',
              alignItems: 'flex-start'
            }}>
              {/* Left: Bottle Selection */}
              <div>
                <h3 style={{
                  fontSize: '18px',
                  fontWeight: 700,
                  color: '#3d2b27',
                  marginBottom: '24px',
                  letterSpacing: '0.05em'
                }}>
                  SELECT A COLOR 👇
                </h3>

                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(2, 1fr)',
                  gap: '20px'
                }}>
                  {bottleColors.map((bottle, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedBottle(selectedBottle === idx ? null : idx)}
                      style={{
                        padding: '20px',
                        background: selectedBottle === idx ? 'rgba(212, 83, 138, 0.15)' : '#fff',
                        border: selectedBottle === idx ? '2.5px solid #d4538a' : '2px solid #ecddd8',
                        borderRadius: '12px',
                        cursor: 'pointer',
                        transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '12px',
                        boxShadow: selectedBottle === idx ? '0 8px 24px rgba(212, 83, 138, 0.25)' : '0 4px 12px rgba(0,0,0,0.05)'
                      }}
                      onMouseEnter={e => {
                        if (selectedBottle !== idx) {
                          e.currentTarget.style.borderColor = '#d4538a';
                          e.currentTarget.style.boxShadow = '0 6px 16px rgba(212, 83, 138, 0.15)';
                        }
                      }}
                      onMouseLeave={e => {
                        if (selectedBottle !== idx) {
                          e.currentTarget.style.borderColor = '#ecddd8';
                          e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.05)';
                        }
                      }}
                    >
                      {/* Mini Bottle */}
                      <div style={{
                        width: '40px',
                        height: '60px',
                        background: `linear-gradient(135deg, ${bottle.hex} 0%, ${bottle.hex}dd 100%)`,
                        borderRadius: '18px 18px 4px 4px',
                        boxShadow: `0 8px 20px ${bottle.hex}40`,
                        position: 'relative',
                        animation: selectedBottle === idx ? 'bounce 0.5s ease' : 'none'
                      }}>
                        <div style={{
                          position: 'absolute',
                          top: '-6px',
                          left: '50%',
                          transform: 'translateX(-50%)',
                          width: '20px',
                          height: '12px',
                          background: '#2d2520',
                          borderRadius: '4px 4px 2px 2px'
                        }} />
                      </div>
                      <p style={{
                        fontSize: '12px',
                        fontWeight: 700,
                        color: selectedBottle === idx ? '#d4538a' : '#3d2b27',
                        letterSpacing: '0.05em',
                        margin: 0
                      }}>
                        {bottle.name}
                      </p>
                    </button>
                  ))}
                </div>

                {selectedBottle !== null && (
                  <div style={{
                    marginTop: '24px',
                    padding: '16px',
                    background: '#f0e0e8',
                    borderRadius: '8px',
                    textAlign: 'center',
                    animation: 'slideUp 0.3s ease-out'
                  }}>
                    <p style={{
                      fontSize: '13px',
                      fontWeight: 700,
                      color: '#3d2b27',
                      margin: 0,
                      letterSpacing: '0.05em'
                    }}>
                      ✓ {bottleColors[selectedBottle].name} selected!<br/>Drop it in a container 👇
                    </p>
                  </div>
                )}
              </div>

              {/* Right: Mixing Containers */}
              <div>
                <h3 style={{
                  fontSize: '18px',
                  fontWeight: 700,
                  color: '#3d2b27',
                  marginBottom: '24px',
                  letterSpacing: '0.05em'
                }}>
                  MIX IN CONTAINERS 🥤
                </h3>

                <div style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr',
                  gap: '20px'
                }}>
                  {containerColors.map((color, containerIdx) => (
                    <div
                      key={containerIdx}
                      style={{
                        padding: '24px',
                        background: 'linear-gradient(135deg, rgba(255,255,255,0.6) 0%, rgba(240,224,232,0.4) 100%)',
                        border: '2.5px dashed #ecddd8',
                        borderRadius: '12px',
                        textAlign: 'center',
                        cursor: selectedBottle !== null ? 'pointer' : 'default',
                        transition: 'all 0.3s ease',
                        position: 'relative',
                        minHeight: '120px',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '12px'
                      }}
                      onClick={() => selectedBottle !== null && addColorToContainer(selectedBottle, containerIdx)}
                      onMouseEnter={e => {
                        if (selectedBottle !== null) {
                          e.currentTarget.style.background = 'linear-gradient(135deg, rgba(255,255,255,0.8) 0%, rgba(240,224,232,0.6) 100%)';
                          e.currentTarget.style.borderColor = '#d4538a';
                          e.currentTarget.style.borderStyle = 'solid';
                          e.currentTarget.style.boxShadow = '0 8px 24px rgba(212, 83, 138, 0.15)';
                          e.currentTarget.style.transform = 'scale(1.02)';
                        }
                      }}
                      onMouseLeave={e => {
                        e.currentTarget.style.background = 'linear-gradient(135deg, rgba(255,255,255,0.6) 0%, rgba(240,224,232,0.4) 100%)';
                        e.currentTarget.style.borderColor = '#ecddd8';
                        e.currentTarget.style.borderStyle = 'dashed';
                        e.currentTarget.style.boxShadow = 'none';
                        e.currentTarget.style.transform = 'scale(1)';
                      }}
                    >
                      {/* Container Display */}
                      {color ? (
                        <div style={{
                          width: '100%',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          gap: '16px'
                        }}>
                          {/* Colored Liquid */}
                          <div style={{
                            width: '80px',
                            height: '100px',
                            background: color,
                            borderRadius: '12px 12px 20px 20px',
                            boxShadow: `0 12px 32px ${color}40, inset -2px -4px 8px rgba(0,0,0,0.1)`,
                            position: 'relative',
                            animation: 'liquidWave 3s ease-in-out infinite'
                          }}>
                            <div style={{
                              position: 'absolute',
                              top: '4px',
                              left: '8px',
                              width: '20px',
                              height: '20px',
                              background: 'rgba(255,255,255,0.3)',
                              borderRadius: '50%'
                            }} />
                          </div>
                          {/* Actions */}
                          <div style={{
                            display: 'flex',
                            gap: '12px',
                            width: '100%',
                            justifyContent: 'center'
                          }}>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                shrinkContainer(containerIdx);
                              }}
                              style={{
                                padding: '8px 16px',
                                background: '#f39c12',
                                color: '#fff',
                                border: 'none',
                                borderRadius: '6px',
                                fontSize: '11px',
                                fontWeight: 700,
                                cursor: 'pointer',
                                transition: 'all 0.3s ease'
                              }}
                              onMouseEnter={e => {
                                e.currentTarget.style.transform = 'scale(1.1)';
                                e.currentTarget.style.boxShadow = '0 4px 12px rgba(243, 156, 18, 0.3)';
                              }}
                              onMouseLeave={e => {
                                e.currentTarget.style.transform = 'scale(1)';
                                e.currentTarget.style.boxShadow = 'none';
                              }}
                            >
                              🧹 Shrink
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div>
                          <p style={{
                            fontSize: '32px',
                            margin: '0 0 8px 0'
                          }}>
                            🥤
                          </p>
                          <p style={{
                            fontSize: '12px',
                            color: '#9e7b74',
                            margin: 0,
                            letterSpacing: '0.03em'
                          }}>
                            Container {containerIdx + 1}
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Game Tips */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '20px',
            padding: '24px',
            background: 'rgba(212, 83, 138, 0.08)',
            borderRadius: '12px',
            border: '1px solid rgba(212, 83, 138, 0.15)'
          }}>
            <div style={{ textAlign: 'center' }}>
              <p style={{ fontSize: '18px', margin: '0 0 8px 0' }}>🎯</p>
              <p style={{
                fontSize: '12px',
                color: '#3d2b27',
                fontWeight: 600,
                margin: 0,
                letterSpacing: '0.02em'
              }}>
                Select a bottle, drop in containers
              </p>
            </div>
            <div style={{ textAlign: 'center' }}>
              <p style={{ fontSize: '18px', margin: '0 0 8px 0' }}>🎨</p>
              <p style={{
                fontSize: '12px',
                color: '#3d2b27',
                fontWeight: 600,
                margin: 0,
                letterSpacing: '0.02em'
              }}>
                Mix colors to create new shades!
              </p>
            </div>
            <div style={{ textAlign: 'center' }}>
              <p style={{ fontSize: '18px', margin: '0 0 8px 0' }}>✨</p>
              <p style={{
                fontSize: '12px',
                color: '#3d2b27',
                fontWeight: 600,
                margin: 0,
                letterSpacing: '0.02em'
              }}>
                Earn points, shrink containers!
              </p>
            </div>
          </div>
        </div>

        <style>{`
          @keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
          @keyframes bounce { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.1); } }
          @keyframes liquidWave { 0%, 100% { borderBottomLeftRadius: 12px; borderBottomRightRadius: 12px; } 50% { borderBottomLeftRadius: 20px; borderBottomRightRadius: 20px; } }
        `}</style>
      </section>

      {/* Featured Products */}
      {featured.length > 0 && (
        <section style={{ padding: '100px 0', background: 'linear-gradient(135deg, #fff5f2 0%, #faf5f3 100%)' }}>
          <div className="container">
            <h2 style={{
              textAlign: 'center',
              fontSize: '42px',
              marginBottom: '12px',
              color: '#3d2b27',
              fontFamily: 'Cormorant Garamond, serif',
              fontWeight: 600,
              letterSpacing: '0.05em'
            }}>
              Featured Collection
            </h2>
            <p style={{
              textAlign: 'center',
              color: '#9e7b74',
              marginBottom: '56px',
              fontSize: '16px',
              letterSpacing: '0.03em'
            }}>
              Hand-picked by our beauty experts
            </p>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
              gap: '28px'
            }}>
              {featured.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
            <div style={{ textAlign: 'center', marginTop: '56px' }}>
              <Link to="/products" className="btn-outline" style={{ padding: '14px 48px', borderColor: '#3d2b27', color: '#3d2b27' }}>
                View All Products
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Hot Items / Trending */}
      {featured.length > 0 && (
        <section style={{ padding: '100px 0', background: 'linear-gradient(135deg, #f5ece8 0%, #fffaf8 100%)' }}>
          <div className="container">
            <h2 style={{
              textAlign: 'center',
              fontSize: '42px',
              marginBottom: '12px',
              color: '#3d2b27',
              fontFamily: 'Cormorant Garamond, serif',
              fontWeight: 600,
              letterSpacing: '0.05em'
            }}>
              🔥 Hot Glam Right Now
            </h2>
            <p style={{
              textAlign: 'center',
              color: '#9e7b74',
              marginBottom: '56px',
              fontSize: '16px',
              letterSpacing: '0.03em'
            }}>
              The trending colours everyone's loving this season
            </p>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
              gap: '28px'
            }}>
              {featured.slice().reverse().map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          </div>
        </section>
      )}

      {/* Testimonials */}
      <section style={{ padding: '100px 0', background: 'linear-gradient(135deg, #fffaf8 0%, #faf5f3 100%)' }}>
        <div className="container">
          <h2 style={{
            textAlign: 'center',
            fontSize: '42px',
            marginBottom: '56px',
            color: '#3d2b27',
            fontFamily: 'Cormorant Garamond, serif',
            fontWeight: 600,
            letterSpacing: '0.05em'
          }}>
            What Our Clients Say
          </h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '28px'
          }}>
            {[
              { name: 'Sophia R.', review: 'The Gel collection is absolutely stunning. Long-lasting and the colours are exactly as shown. A truly premium experience!', stars: 5 },
              { name: 'Aisha M.', review: 'SHYNIA has become my go-to brand. The packaging is gorgeous and the matte finishes are unmatched in quality.', stars: 5 },
              { name: 'Priya K.', review: 'Finally a nail polish brand that delivers on its promises. The glossy range is my absolute favourite!', stars: 5 }
            ].map((r, i) => (
              <div key={i} style={{
                background: 'rgba(255, 255, 255, 0.8)',
                backdropFilter: 'blur(10px)',
                border: '1.5px solid rgba(236, 221, 216, 0.6)',
                borderRadius: '12px',
                padding: '36px',
                position: 'relative',
                boxShadow: '0 8px 24px rgba(61, 43, 39, 0.08)',
                transition: 'all 0.3s ease'
              }}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow = '0 12px 32px rgba(212, 83, 138, 0.15)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 8px 24px rgba(61, 43, 39, 0.08)';
                }}
              >
                <div style={{
                  background: 'linear-gradient(135deg, #d4538a 0%, #c9a96e 100%)',
                  fontSize: '18px',
                  marginBottom: '16px',
                  letterSpacing: '0.1em'
                }}>
                  {'★'.repeat(r.stars)}
                </div>
                <p style={{
                  fontSize: '15px',
                  color: '#8b5e52',
                  lineHeight: 1.8,
                  marginBottom: '24px',
                  fontStyle: 'italic',
                  letterSpacing: '0.02em'
                }}>
                  "{r.review}"
                </p>
                <p style={{
                  fontSize: '13px',
                  fontWeight: 600,
                  color: '#3d2b27',
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase'
                }}>
                  — {r.name}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Signup - Motion Section */}
      <section style={{
        background: 'linear-gradient(135deg, #3d2b27 0%, #2d2520 50%, #4a3634 100%)',
        padding: '100px 0',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Animated background circles */}
        <div style={{
          position: 'absolute',
          width: '400px',
          height: '400px',
          background: 'radial-gradient(circle, rgba(212, 83, 138, 0.15) 0%, transparent 70%)',
          borderRadius: '50%',
          bottom: '-100px',
          left: '-100px',
          animation: 'float 10s ease-in-out infinite'
        }} />
        <div style={{
          position: 'absolute',
          width: '300px',
          height: '300px',
          background: 'radial-gradient(circle, rgba(201, 169, 110, 0.1) 0%, transparent 70%)',
          borderRadius: '50%',
          top: '-50px',
          right: '-50px',
          animation: 'float 12s ease-in-out infinite 1s'
        }} />

        <div className="container" style={{ position: 'relative', zIndex: 2 }}>
          <div style={{
            maxWidth: '600px',
            margin: '0 auto',
            textAlign: 'center',
            animation: 'slideIn 0.8s ease-out'
          }}>
            <h2 style={{
              fontFamily: 'Cormorant Garamond, serif',
              fontSize: '48px',
              color: '#f7d6d0',
              marginBottom: '16px',
              fontWeight: 700,
              letterSpacing: '0.02em'
            }}>
              ✨ Stay Glam, Stay Updated
            </h2>
            <p style={{
              fontSize: '16px',
              color: '#e8cfc0',
              marginBottom: '40px',
              lineHeight: 1.8,
              letterSpacing: '0.03em'
            }}>
              Get exclusive launches, beauty tips & special offers delivered to your inbox. Join our beauty tribe!
            </p>

            {/* Email Input with Motion */}
            <form onSubmit={(e) => {
              e.preventDefault();
              if (e.target.email.value) {
                alert('✨ Thanks for subscribing! Check your email for exclusive 20% off code 💌');
                e.target.email.value = '';
              }
            }} style={{
              display: 'flex',
              gap: '8px',
              marginBottom: '24px',
              animation: 'slideIn 0.8s ease-out 0.2s backwards'
            }}>
              <input
                type="email"
                name="email"
                placeholder="Enter your email..."
                required
                style={{
                  flex: 1,
                  padding: '16px 20px',
                  borderRadius: '8px',
                  border: '2px solid rgba(212, 83, 138, 0.3)',
                  fontSize: '14px',
                  color: '#3d2b27',
                  background: '#fff',
                  outline: 'none',
                  transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
                  fontWeight: 500
                }}
                onFocus={e => {
                  e.target.style.borderColor = '#d4538a';
                  e.target.style.boxShadow = '0 0 20px rgba(212, 83, 138, 0.4)';
                  e.target.style.transform = 'scale(1.02)';
                }}
                onBlur={e => {
                  e.target.style.borderColor = 'rgba(212, 83, 138, 0.3)';
                  e.target.style.boxShadow = 'none';
                  e.target.style.transform = 'scale(1)';
                }}
              />
              <button
                type="submit"
                style={{
                  padding: '16px 32px',
                  background: 'linear-gradient(135deg, #d4538a 0%, #c9a96e 100%)',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '13px',
                  fontWeight: 800,
                  cursor: 'pointer',
                  transition: 'all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  boxShadow: '0 8px 24px rgba(212, 83, 138, 0.3)',
                  whiteSpace: 'nowrap'
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = 'translateY(-3px)';
                  e.currentTarget.style.boxShadow = '0 16px 40px rgba(212, 83, 138, 0.5)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 8px 24px rgba(212, 83, 138, 0.3)';
                }}
              >
                Subscribe 💌
              </button>
            </form>

            <p style={{
              fontSize: '12px',
              color: '#b89999',
              letterSpacing: '0.05em'
            }}>
              ✓ Spam-free. Unsubscribe anytime.
            </p>
          </div>
        </div>

        <style>{`
          @keyframes slideIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        `}</style>
      </section>

      {/* Benefits Carousel - Animated Cards */}
      <section style={{
        padding: '100px 0',
        background: 'linear-gradient(135deg, #fffaf8 0%, #faf5f3 100%)'
      }}>
        <div className="container">
          <h2 style={{
            textAlign: 'center',
            fontFamily: 'Cormorant Garamond, serif',
            fontSize: '42px',
            color: '#3d2b27',
            marginBottom: '56px',
            fontWeight: 600,
            letterSpacing: '0.05em'
          }}>
            Why Choose SHYNIA
          </h2>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '28px'
          }}>
            {[
              { icon: '💅', title: 'Long-Lasting', desc: 'Up to 21 days of flawless shine', delay: '0s' },
              { icon: '🎨', title: 'Rich Colors', desc: '50+ stunning shades to choose', delay: '0.1s' },
              { icon: '✨', title: 'Premium Formula', desc: 'Vegan & cruelty-free quality', delay: '0.2s' },
              { icon: '💚', title: 'Fast Delivery', desc: 'Ships within 24-48 hours', delay: '0.3s' },
              { icon: '🛡️', title: 'Money-Back', desc: 'Guaranteed satisfaction promise', delay: '0.4s' },
              { icon: '👑', title: 'Luxury Vibes', desc: 'Premium packaging & experience', delay: '0.5s' }
            ].map((benefit, i) => (
              <div key={i} style={{
                background: 'rgba(255, 255, 255, 0.9)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(212, 83, 138, 0.15)',
                borderRadius: '12px',
                padding: '32px 24px',
                textAlign: 'center',
                transition: 'all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
                cursor: 'pointer',
                animation: `slideUp 0.6s ease-out ${benefit.delay} backwards`,
                boxShadow: '0 8px 24px rgba(61, 43, 39, 0.08)'
              }}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = 'translateY(-12px) scale(1.05)';
                  e.currentTarget.style.boxShadow = '0 24px 56px rgba(212, 83, 138, 0.2)';
                  e.currentTarget.style.borderColor = 'rgba(212, 83, 138, 0.4)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = 'translateY(0) scale(1)';
                  e.currentTarget.style.boxShadow = '0 8px 24px rgba(61, 43, 39, 0.08)';
                  e.currentTarget.style.borderColor = 'rgba(212, 83, 138, 0.15)';
                }}
              >
                <div style={{
                  fontSize: '48px',
                  marginBottom: '16px',
                  animation: 'bounce 2s ease-in-out infinite'
                }}>
                  {benefit.icon}
                </div>
                <h3 style={{
                  fontSize: '16px',
                  fontWeight: 700,
                  color: '#3d2b27',
                  marginBottom: '8px',
                  letterSpacing: '0.02em'
                }}>
                  {benefit.title}
                </h3>
                <p style={{
                  fontSize: '13px',
                  color: '#9e7b74',
                  lineHeight: 1.6,
                  letterSpacing: '0.01em'
                }}>
                  {benefit.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        <style>{`
          @keyframes slideUp { from { opacity: 0; transform: translateY(40px); } to { opacity: 1; transform: translateY(0); } }
          @keyframes bounce { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-12px); } }
        `}</style>
      </section>

      {/* Final CTA - Animated Button */}
      <section style={{
        background: 'linear-gradient(135deg, #f7d6d0 0%, #e8cfc0 100%)',
        padding: '120px 0',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute',
          width: '600px',
          height: '600px',
          background: 'radial-gradient(circle, rgba(212, 83, 138, 0.08) 0%, transparent 70%)',
          borderRadius: '50%',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          animation: 'pulse 4s ease-in-out infinite'
        }} />

        <div className="container" style={{ position: 'relative', zIndex: 2, animation: 'slideIn 0.8s ease-out' }}>
          <h2 style={{
            fontFamily: 'Cormorant Garamond, serif',
            fontSize: 'clamp(42px, 6vw, 56px)',
            color: '#3d2b27',
            marginBottom: '24px',
            fontWeight: 700,
            letterSpacing: '-0.02em'
          }}>
            Ready to Glow? 💅
          </h2>
          <p style={{
            fontSize: '18px',
            color: '#8b5e52',
            marginBottom: '48px',
            maxWidth: '500px',
            margin: '0 auto 48px',
            lineHeight: 1.8,
            letterSpacing: '0.02em'
          }}>
            Discover your next favorite shade. Premium quality, luxury experience, pure glam.
          </p>

          <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', flexWrap: 'wrap' }}>
            {[
              { text: '👉 Shop Now', to: '/products', bg: '#3d2b27', color: '#fff' },
              { text: '💌 Get Offers', to: '#newsletter', bg: 'transparent', color: '#3d2b27', border: true }
            ].map((btn, i) => (
              <a
                key={i}
                href={btn.to}
                style={{
                  padding: '18px 48px',
                  background: btn.bg,
                  color: btn.color,
                  border: btn.border ? '2.5px solid #3d2b27' : 'none',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: 800,
                  cursor: 'pointer',
                  transition: 'all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  textDecoration: 'none',
                  display: 'inline-block',
                  boxShadow: i === 0 ? '0 12px 32px rgba(61, 43, 39, 0.25)' : 'none',
                  position: 'relative',
                  overflow: 'hidden'
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = 'translateY(-6px)';
                  if (i === 0) {
                    e.currentTarget.style.boxShadow = '0 20px 48px rgba(61, 43, 39, 0.4)';
                  } else {
                    e.currentTarget.style.background = '#f7d6d0';
                    e.currentTarget.style.boxShadow = '0 12px 32px rgba(212, 83, 138, 0.2)';
                  }
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  if (i === 0) {
                    e.currentTarget.style.boxShadow = '0 12px 32px rgba(61, 43, 39, 0.25)';
                  } else {
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.boxShadow = 'none';
                  }
                }}
              >
                {btn.text}
              </a>
            ))}
          </div>
        </div>

        <style>{`
          @keyframes pulse { 0%, 100% { transform: translate(-50%, -50%) scale(1); opacity: 1; } 50% { transform: translate(-50%, -50%) scale(1.1); opacity: 0.8; } }
        `}</style>
      </section>
    </div>
  );
}