"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

export default function Home() {
  const [activeSection, setActiveSection] = useState("home");
  const [navScrolled, setNavScrolled] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  
  const loaderRef = useRef<HTMLDivElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null);
  const trailRef = useRef<HTMLDivElement>(null);
  const loaderBarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Reveal Observer
    const initReveal = () => {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
      }, { threshold: 0.1 });
      document.querySelectorAll('.reveal:not(.visible)').forEach(el => observer.observe(el));
    };

    // Skill Bars
    const initBars = () => {
      document.querySelectorAll('.exp-fill').forEach((bar: any) => {
        const w = bar.getAttribute('data-width');
        setTimeout(() => { bar.style.width = w + '%'; }, 200);
      });
    };

    // Initialize loader bar
    if (loaderBarRef.current) {
      loaderBarRef.current.style.width = '100%';
    }

    const loadTimeout = setTimeout(() => {
      if (loaderRef.current) loaderRef.current.classList.add('hidden');
      initReveal();
    }, 2000);

    setTimeout(() => {
      initReveal();
      initBars();
    }, 2100);

    // Cursor Logic
    let mx = 0, my = 0, tx = 0, ty = 0;
    const cursor = cursorRef.current;
    const trail = trailRef.current;

    const mouseMoveHandler = (e: MouseEvent) => {
      mx = e.clientX; 
      my = e.clientY;
      if (cursor) {
        cursor.style.left = mx - 6 + 'px';
        cursor.style.top = my - 6 + 'px';
      }
    };
    document.addEventListener('mousemove', mouseMoveHandler);

    const cursorInterval = setInterval(() => {
      tx += (mx - tx) * 0.15;
      ty += (my - ty) * 0.15;
      if (trail) {
        trail.style.left = tx - 15 + 'px';
        trail.style.top = ty - 15 + 'px';
      }
    }, 16);

    // Hover effects
    let interactiveElements: NodeListOf<Element>;
    const hoverEnterHandle = () => { 
      if (cursor) cursor.style.transform = 'scale(2)'; 
      if (trail) trail.style.transform = 'scale(0.7)'; 
    };
    const hoverLeaveHandle = () => { 
      if (cursor) cursor.style.transform = 'scale(1)'; 
      if (trail) trail.style.transform = 'scale(1)'; 
    };

    // Need to hook it after component mount and interactions
    const attachHovers = () => {
      interactiveElements = document.querySelectorAll('button,a,.service-card,.project-card,.portfolio-card,.testi-card');
      interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', hoverEnterHandle);
        el.addEventListener('mouseleave', hoverLeaveHandle);
      });
    };

    const floatTexts = ['<code>', '</div>', 'function()', 'async/await', 'npm install', 'git push', '{ }', '01001', '100%', 'deploy()', '#!/bin', 'const x =', 'return true', '[]', 'API'];
    const floatEl = document.getElementById('floatingEl');
    if (floatEl && floatEl.childNodes.length === 0) {
      for (let i = 0; i < 15; i++) {
        const el = document.createElement('div');
        el.className = 'float-el';
        el.textContent = floatTexts[Math.floor(Math.random() * floatTexts.length)];
        el.style.left = Math.random() * 100 + '%';
        el.style.animationDuration = (8 + Math.random() * 12) + 's';
        el.style.animationDelay = (Math.random() * 10) + 's';
        floatEl.appendChild(el);
      }
    }

    const scrollHandler = () => {
      setNavScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', scrollHandler);

    attachHovers();

    return () => {
      document.removeEventListener('mousemove', mouseMoveHandler);
      clearInterval(cursorInterval);
      if (interactiveElements) {
        interactiveElements.forEach(el => {
          el.removeEventListener('mouseenter', hoverEnterHandle);
          el.removeEventListener('mouseleave', hoverLeaveHandle);
        });
      }
      window.removeEventListener('scroll', scrollHandler);
      clearTimeout(loadTimeout);
    };
  }, [activeSection]);

  const navigate = (e: React.MouseEvent, page: string) => {
    e.preventDefault();
    setMobileNavOpen(false);
    setActiveSection(page);
    
    // Smooth scroll to target section
    const targetElement = document.getElementById(`${page}-section`);
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: 'smooth' });
    }
    
    setTimeout(() => {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
      }, { threshold: 0.1 });
      document.querySelectorAll('.reveal:not(.visible)').forEach(el => observer.observe(el));
      
      document.querySelectorAll('.exp-fill').forEach((bar: any) => {
        const w = bar.getAttribute('data-width');
        setTimeout(() => { bar.style.width = w + '%'; }, 200);
      });
    }, 150);
  };

  return (
    <>
      <div id="cursor" ref={cursorRef}></div>
      <div id="cursor-trail" ref={trailRef}></div>

      {/* Loader */}
      <div id="loader" ref={loaderRef}>
        <div className="loader-logo">Code<span>4</span>Life</div>
        <div className="loader-bar"><div className="loader-bar-fill" ref={loaderBarRef}></div></div>
        <div className="loader-text">INITIALIZING SYSTEMS...</div>
      </div>

      {/* Mobile Nav */}
      <div className={`mobile-nav ${mobileNavOpen ? 'open' : ''}`} id="mobileNav">
        <button className="mobile-close" onClick={() => setMobileNavOpen(false)}>✕</button>
        <a href="#" onClick={(e) => navigate(e, 'home')}>Home</a>
        <a href="#" onClick={(e) => navigate(e, 'services')}>Services</a>
        <a href="#" onClick={(e) => navigate(e, 'work')}>Our Work</a>
        <a href="#" onClick={(e) => navigate(e, 'about')}>About</a>
        <a href="#" onClick={(e) => navigate(e, 'contact')}>Contact</a>
      </div>

      {/* NAVBAR */}
      <nav id="navbar" className={navScrolled ? 'scrolled' : ''}>
        <div className="nav-logo">
          <div className="logo-icon">&lt;/&gt;</div>
          <div className="logo-text">Code<span>4</span>Life</div>
        </div>
        <ul className="nav-links">
          <li><a href="#" onClick={(e) => navigate(e, 'home')}>Home</a></li>
          <li><a href="#" onClick={(e) => navigate(e, 'services')}>Services</a></li>
          <li><a href="#" onClick={(e) => navigate(e, 'work')}>Our Work</a></li>
          <li><a href="#" onClick={(e) => navigate(e, 'about')}>About</a></li>
          <li><a href="#" onClick={(e) => navigate(e, 'contact')}>Contact</a></li>
        </ul>
        <button className="nav-cta" onClick={(e) => navigate(e as any, 'contact')}>Start Project</button>
        <div className="hamburger" id="hamburger" onClick={() => setMobileNavOpen(true)}>
          <span></span><span></span><span></span>
        </div>
      </nav>

      <main>
        {/* ===================== HOME PAGE ===================== */}
        <div id="home-section" className={`page-section ${activeSection === 'home' ? 'active' : ''}`}>
          {/* HERO */}
          <section id="home">
            <div className="hero-bg">
              <div className="grid-bg"></div>
              <div className="hero-glow"></div>
              <div className="floating-elements" id="floatingEl"></div>
            </div>
            <div className="container">
              <div className="hero-content">
                <div className="hero-tag">// Code4Life Digital Agency</div>
                <h1 className="hero-title">We Build The<br/><span className="accent">Future</span> of<br/>Digital Products</h1>
                <p className="hero-sub">We design and develop powerful digital solutions for startups, businesses, and innovators. Code that lives, breathes, and performs.</p>
                <div className="hero-btns">
                  <button className="btn-primary" onClick={(e) => navigate(e as any, 'contact')}>Start a Project</button>
                  <button className="btn-secondary" onClick={(e) => navigate(e as any, 'work')}>View Our Work</button>
                </div>
              </div>
            </div>
            <div className="hero-scroll">SCROLL</div>
          </section>

          {/* SERVICES OVERVIEW */}
          <section id="services-overview">
            <div className="container">
              <div className="reveal">
                <div className="section-label">What we do</div>
                <h2 className="section-title">Our <span>Services</span></h2>
                <p className="section-sub">From concept to deployment — we cover every layer of the digital stack with precision and craft.</p>
              </div>
              <div className="services-grid">
                <div className="service-card reveal">
                  <div className="service-icon">🛒</div>
                  <h3>E-commerce Development</h3>
                  <p>Scalable online stores with seamless payment integration and high-performance architecture.</p>
                </div>
                <div className="service-card reveal reveal-delay-1">
                  <div className="service-icon">🌐</div>
                  <h3>Web Development</h3>
                  <p>Modern responsive websites, dashboards, and SaaS platforms built to scale.</p>
                </div>
                <div className="service-card reveal reveal-delay-2">
                  <div className="service-icon">📱</div>
                  <h3>Mobile App Development</h3>
                  <p>Android & iOS apps with cross-platform solutions and high-performance UI.</p>
                </div>
                <div className="service-card reveal reveal-delay-3">
                  <div className="service-icon">🖥️</div>
                  <h3>Desktop Applications</h3>
                  <p>Powerful business tools and custom enterprise software built for performance.</p>
                </div>
              </div>
            </div>
          </section>

          {/* STATS */}
          <section id="stats">
            <div className="container">
              <div className="stats-grid">
                <div className="reveal">
                  <div className="stat-num">50+</div>
                  <div className="stat-label">Projects Delivered</div>
                </div>
                <div className="reveal reveal-delay-1">
                  <div className="stat-num">30+</div>
                  <div className="stat-label">Happy Clients</div>
                </div>
                <div className="reveal reveal-delay-2">
                  <div className="stat-num">5+</div>
                  <div className="stat-label">Years Experience</div>
                </div>
                <div className="reveal reveal-delay-3">
                  <div className="stat-num">99%</div>
                  <div className="stat-label">Client Satisfaction</div>
                </div>
              </div>
            </div>
          </section>

          {/* FEATURED WORK */}
          <section id="featured-work">
            <div className="container">
              <div className="reveal">
                <div className="section-label">Portfolio</div>
                <h2 className="section-title">Featured <span>Projects</span></h2>
              </div>
              <div className="projects-grid">
                <div className="project-card reveal">
                  <div className="project-img" style={{ background: 'linear-gradient(135deg,#001a0d,#003320)' }}>
                    <div className="project-img-bg" style={{ fontFamily: 'monospace', fontSize: '4rem', opacity: 0.3, color: '#00ff6a' }}>📊</div>
                    <span className="project-tag">AI · DASHBOARD</span>
                  </div>
                  <div className="project-body">
                    <div className="project-title">NeuralDash — AI Analytics Platform</div>
                    <p className="project-desc">Real-time AI-powered analytics dashboard with predictive modeling and live data streams.</p>
                    <div className="tech-stack">
                      <span className="tech-pill">React</span>
                      <span className="tech-pill">Python</span>
                      <span className="tech-pill">TensorFlow</span>
                    </div>
                    <a className="btn-ghost" href="#">View Case Study →</a>
                  </div>
                </div>
                <div className="project-card reveal reveal-delay-1">
                  <div className="project-img" style={{ background: 'linear-gradient(135deg,#0d0010,#1a0020)' }}>
                    <div className="project-img-bg" style={{ fontFamily: 'monospace', fontSize: '4rem', opacity: 0.3, color: '#00ff6a' }}>🛍️</div>
                    <span className="project-tag">E-COMMERCE</span>
                  </div>
                  <div className="project-body">
                    <div className="project-title">ShopMatrix — Modern Commerce</div>
                    <p className="project-desc">High-performance ecommerce platform with AI recommendations and multi-currency support.</p>
                    <div className="tech-stack">
                      <span className="tech-pill">Next.js</span>
                      <span className="tech-pill">Stripe</span>
                      <span className="tech-pill">PostgreSQL</span>
                    </div>
                    <a className="btn-ghost" href="#">View Case Study →</a>
                  </div>
                </div>
                <div className="project-card reveal reveal-delay-2">
                  <div className="project-img" style={{ background: 'linear-gradient(135deg,#001020,#002040)' }}>
                    <div className="project-img-bg" style={{ fontFamily: 'monospace', fontSize: '4rem', opacity: 0.3, color: '#00ff6a' }}>💸</div>
                    <span className="project-tag">FINTECH · MOBILE</span>
                  </div>
                  <div className="project-body">
                    <div className="project-title">PayFlow — Fintech Mobile App</div>
                    <p className="project-desc">Cross-platform fintech app with real-time transactions, biometric auth, and crypto support.</p>
                    <div className="tech-stack">
                      <span className="tech-pill">Flutter</span>
                      <span className="tech-pill">Firebase</span>
                      <span className="tech-pill">Blockchain</span>
                    </div>
                    <a className="btn-ghost" href="#">View Case Study →</a>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* WHY CHOOSE US */}
          <section id="why-us">
            <div className="container">
              <div className="why-grid">
                <div>
                  <div className="reveal">
                    <div className="section-label">Why Us</div>
                    <h2 className="section-title">Built Different.<br/><span>Code Harder.</span></h2>
                    <p className="section-sub">We don't just ship code — we engineer digital experiences that outperform, outlast, and outscale.</p>
                  </div>
                  <div className="why-list">
                    <div className="why-item reveal">
                      <span className="why-num">01</span>
                      <div>
                        <h4>Performance-First Architecture</h4>
                        <p>Every line of code is optimized for speed, scalability, and reliability under real-world load.</p>
                      </div>
                    </div>
                    <div className="why-item reveal reveal-delay-1">
                      <span className="why-num">02</span>
                      <div>
                        <h4>Full-Stack Mastery</h4>
                        <p>From pixel-perfect UIs to robust backend systems — we own the entire stack end to end.</p>
                      </div>
                    </div>
                    <div className="why-item reveal reveal-delay-2">
                      <span className="why-num">03</span>
                      <div>
                        <h4>Agile & Transparent</h4>
                        <p>Weekly deliverables, real-time updates, and zero surprises. You're in the loop, always.</p>
                      </div>
                    </div>
                    <div className="why-item reveal reveal-delay-3">
                      <span className="why-num">04</span>
                      <div>
                        <h4>Post-Launch Support</h4>
                        <p>We don't disappear after delivery. Ongoing maintenance, upgrades, and 24/7 support available.</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="why-visual reveal">
                  <div className="why-circle">
                    <div className="why-circle-inner">
                      <span>CODE<br/>4<br/>LIFE</span>
                    </div>
                    <div className="orbit-dot" style={{ top: '10px', left: '50%', transform: 'translateX(-50%)' }}></div>
                    <div className="orbit-dot" style={{ bottom: '10px', left: '50%', transform: 'translateX(-50%)' }}></div>
                    <div className="orbit-dot" style={{ left: '10px', top: '50%', transform: 'translateY(-50%)' }}></div>
                    <div className="orbit-dot" style={{ right: '10px', top: '50%', transform: 'translateY(-50%)' }}></div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* TESTIMONIALS */}
          <section id="testimonials">
            <div className="container">
              <div className="reveal">
                <div className="section-label">Client Stories</div>
                <h2 className="section-title">What They <span>Say</span></h2>
              </div>
              <div className="testi-grid">
                <div className="testi-card reveal">
                  <div className="testi-quote">"</div>
                  <p className="testi-text">Code4Life delivered our entire platform in record time. The quality was exceptional — clean code, perfect design, zero bugs on launch day.</p>
                  <div className="testi-author">
                    <div className="testi-avatar">JK</div>
                    <div>
                      <div className="testi-name">James K.</div>
                      <div className="testi-role">CEO, TechFlow Inc.</div>
                    </div>
                  </div>
                </div>
                <div className="testi-card reveal reveal-delay-1">
                  <div className="testi-quote">"</div>
                  <p className="testi-text">Their mobile app exceeded every expectation. The UI is stunning, performance is flawless, and user retention went up by 40% after launch.</p>
                  <div className="testi-author">
                    <div className="testi-avatar">SM</div>
                    <div>
                      <div className="testi-name">Sarah M.</div>
                      <div className="testi-role">Product Lead, NovaPay</div>
                    </div>
                  </div>
                </div>
                <div className="testi-card reveal reveal-delay-2">
                  <div className="testi-quote">"</div>
                  <p className="testi-text">I've worked with many agencies but Code4Life stands apart. They think like founders, not contractors. Our revenue doubled in 3 months.</p>
                  <div className="testi-author">
                    <div className="testi-avatar">RA</div>
                    <div>
                      <div className="testi-name">Rami A.</div>
                      <div className="testi-role">Founder, UrbanStore</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* CTA BANNER */}
          <section id="cta-banner">
            <div className="cta-glow"></div>
            <div className="container" style={{ position: 'relative', zIndex: 2 }}>
              <div className="reveal">
                <h2 className="cta-title">Ready to Build<br/>Something <span>Legendary?</span></h2>
                <p className="cta-sub">Let's turn your vision into reality. One line of code at a time.</p>
                <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
                  <button className="btn-primary" onClick={(e) => navigate(e as any, 'contact')}>Start a Project</button>
                  <button className="btn-secondary" onClick={(e) => navigate(e as any, 'contact')}>Get Free Consultation</button>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* ===================== SERVICES PAGE ===================== */}
        <div id="services-section" className={`page-section ${activeSection === 'services' ? 'active' : ''}`}>
          <section id="services-page">
            <div className="container">
              <div className="reveal" style={{ textAlign: 'center', maxWidth: '600px', margin: '0 auto 0' }}>
                <div className="section-label" style={{ justifyContent: 'center' }}>What We Offer</div>
                <h2 className="section-title">Our <span>Services</span></h2>
                <p className="section-sub" style={{ margin: '0 auto' }}>Comprehensive digital solutions engineered for growth, performance, and impact.</p>
              </div>
              <div className="services-detailed-grid">
                <div className="service-detail-card reveal">
                  <div className="svc-icon-wrap">🛒</div>
                  <h3>E-commerce Development</h3>
                  <p>Build scalable, conversion-optimized online stores that turn visitors into loyal customers.</p>
                  <ul className="svc-features">
                    <li>Scalable online store architecture</li>
                    <li>Multi-gateway payment integration</li>
                    <li>High-performance product catalog</li>
                    <li>Inventory & order management</li>
                    <li>SEO-optimized product pages</li>
                  </ul>
                </div>
                <div className="service-detail-card reveal reveal-delay-1">
                  <div className="svc-icon-wrap">🌐</div>
                  <h3>Web Development</h3>
                  <p>Modern, responsive websites and web applications built with cutting-edge technologies.</p>
                  <ul className="svc-features">
                    <li>Modern responsive websites</li>
                    <li>Complex dashboards & portals</li>
                    <li>SaaS platform development</li>
                    <li>API design & integration</li>
                    <li>Performance optimization</li>
                  </ul>
                </div>
                <div className="service-detail-card reveal reveal-delay-2">
                  <div className="svc-icon-wrap">📱</div>
                  <h3>Mobile App Development</h3>
                  <p>Native and cross-platform mobile apps that deliver exceptional user experiences.</p>
                  <ul className="svc-features">
                    <li>iOS & Android native apps</li>
                    <li>Cross-platform solutions</li>
                    <li>High-performance UI/UX</li>
                    <li>Push notifications & offline support</li>
                    <li>App Store optimization</li>
                  </ul>
                </div>
                <div className="service-detail-card reveal reveal-delay-3">
                  <div className="svc-icon-wrap">🖥️</div>
                  <h3>Desktop Applications</h3>
                  <p>Powerful, enterprise-grade desktop tools engineered for productivity and scale.</p>
                  <ul className="svc-features">
                    <li>Custom enterprise software</li>
                    <li>Cross-platform desktop apps</li>
                    <li>Database-heavy business tools</li>
                    <li>Automation & workflow systems</li>
                    <li>Legacy system modernization</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* ===================== WORK PAGE ===================== */}
        <div id="work-section" className={`page-section ${activeSection === 'work' ? 'active' : ''}`}>
          <section id="portfolio-page">
            <div className="container">
              <div className="reveal" style={{ textAlign: 'center', maxWidth: '600px', margin: '0 auto' }}>
                <div className="section-label" style={{ justifyContent: 'center' }}>Portfolio</div>
                <h2 className="section-title">Our <span>Work</span></h2>
                <p className="section-sub" style={{ margin: '0 auto' }}>A selection of projects that pushed boundaries and delivered results.</p>
              </div>
              <div className="portfolio-grid">
                <div className="portfolio-card reveal">
                  <div className="portfolio-body">
                    <div className="portfolio-cat">AI · Analytics</div>
                    <div className="portfolio-title">NeuralDash — AI Analytics Platform</div>
                    <p className="portfolio-desc">Real-time AI-powered analytics with machine learning predictions and live streaming data.</p>
                    <div className="tech-stack">
                      <span className="tech-pill">React</span>
                      <span className="tech-pill">Python</span>
                      <span className="tech-pill">TensorFlow</span>
                      <span className="tech-pill">AWS</span>
                    </div>
                  </div>
                </div>
                <div className="portfolio-card reveal reveal-delay-1">
                  <div className="portfolio-body">
                    <div className="portfolio-cat">E-commerce</div>
                    <div className="portfolio-title">ShopMatrix — Modern Commerce Platform</div>
                    <p className="portfolio-desc">Full-stack ecommerce with AI recommendations, multi-currency, and real-time inventory.</p>
                    <div className="tech-stack">
                      <span className="tech-pill">Next.js</span>
                      <span className="tech-pill">Stripe</span>
                      <span className="tech-pill">PostgreSQL</span>
                      <span className="tech-pill">Redis</span>
                    </div>
                  </div>
                </div>
                <div className="portfolio-card reveal reveal-delay-2">
                  <div className="portfolio-body">
                    <div className="portfolio-cat">Fintech · Mobile</div>
                    <div className="portfolio-title">PayFlow — Fintech Mobile App</div>
                    <p className="portfolio-desc">Cross-platform fintech with real-time transactions, biometrics, and crypto wallet.</p>
                    <div className="tech-stack">
                      <span className="tech-pill">Flutter</span>
                      <span className="tech-pill">Firebase</span>
                      <span className="tech-pill">Node.js</span>
                    </div>
                  </div>
                </div>
                <div className="portfolio-card reveal reveal-delay-3">
                  <div className="portfolio-body">
                    <div className="portfolio-cat">Logistics · Enterprise</div>
                    <div className="portfolio-title">LogiCore — Logistics Management System</div>
                    <p className="portfolio-desc">Enterprise-grade logistics platform with live tracking, fleet management, and route optimization.</p>
                    <div className="tech-stack">
                      <span className="tech-pill">Vue.js</span>
                      <span className="tech-pill">Go</span>
                      <span className="tech-pill">Docker</span>
                    </div>
                  </div>
                </div>
                <div className="portfolio-card reveal">
                  <div className="portfolio-body">
                    <div className="portfolio-cat">Hospitality · Booking</div>
                    <div className="portfolio-title">LuxeStay — Hotel Booking App</div>
                    <p className="portfolio-desc">Seamless hotel reservation system with virtual tours, room management, and secure payments.</p>
                    <div className="tech-stack">
                      <span className="tech-pill">React Native</span>
                      <span className="tech-pill">Node.js</span>
                      <span className="tech-pill">MongoDB</span>
                    </div>
                  </div>
                </div>
                <div className="portfolio-card reveal reveal-delay-1">
                  <div className="portfolio-body">
                    <div className="portfolio-cat">Health · Fitness</div>
                    <div className="portfolio-title">FitSync — Workout Tracker</div>
                    <p className="portfolio-desc">Personalized AI workout plans, nutrition tracking, and social challenges for fitness enthusiasts.</p>
                    <div className="tech-stack">
                      <span className="tech-pill">Swift</span>
                      <span className="tech-pill">Kotlin</span>
                      <span className="tech-pill">GraphQL</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* ===================== ABOUT PAGE ===================== */}
        <div id="about-section" className={`page-section ${activeSection === 'about' ? 'active' : ''}`}>
          <section id="about-page">
            <div className="container">
              <div className="about-hero-grid">
                <div className="reveal">
                  <div className="section-label">Our Story</div>
                  <h2 className="section-title">Code is Our<br/><span>Life's Work</span></h2>
                  <p className="section-sub" style={{ marginBottom: '24px' }}>Code4Life was founded on a single belief: that great software changes everything. We exist to build digital products that don't just function — they perform, inspire, and endure.</p>
                  <p className="section-sub">From Lebanon to the world, we bring technical mastery and creative vision to every project we touch. Our team lives and breathes code — it's not just what we do, it's who we are.</p>
                </div>
                <div className="terminal-window reveal">
                  <div className="terminal-bar">
                    <div className="t-dot r"></div>
                    <div className="t-dot y"></div>
                    <div className="t-dot g"></div>
                  </div>
                  <div className="terminal-body">
                    <div className="t-line"><span className="t-prompt">$</span><span className="t-cmd">whoami</span></div>
                    <div className="t-line"><span className="t-output">code4life — digital agency</span></div>
                    <div className="t-line" style={{ marginTop: '8px' }}><span className="t-prompt">$</span><span className="t-cmd">cat mission.txt</span></div>
                    <div className="t-line"><span className="t-output">Build the future, one line at a time.</span></div>
                    <div className="t-line" style={{ marginTop: '8px' }}><span className="t-prompt">$</span><span className="t-cmd">ls /skills</span></div>
                    <div className="t-line"><span className="t-output">web/ mobile/ desktop/ ai/ cloud/</span></div>
                    <div className="t-line" style={{ marginTop: '8px' }}><span className="t-prompt">$</span><span className="t-cmd">ping clients --success-rate</span></div>
                    <div className="t-line"><span className="t-output">99% satisfaction — 50+ delivered</span></div>
                    <div className="t-line" style={{ marginTop: '8px' }}><span className="t-prompt">$</span><span className="t-cursor"></span></div>
                  </div>
                </div>
              </div>

              {/* Expertise */}
              <div className="reveal">
                <div className="section-label">Expertise</div>
                <h2 className="section-title">Our <span>Tech Stack</span></h2>
              </div>
              <div className="expertise-grid">
                <div className="expertise-item reveal" data-level="95">
                  <div className="exp-label">React / Next.js</div>
                  <div className="exp-bar"><div className="exp-fill" data-width="95"></div></div>
                </div>
                <div className="expertise-item reveal reveal-delay-1" data-level="90">
                  <div className="exp-label">Node.js / Python</div>
                  <div className="exp-bar"><div className="exp-fill" data-width="90"></div></div>
                </div>
                <div className="expertise-item reveal reveal-delay-2">
                  <div className="exp-label">Flutter / React Native</div>
                  <div className="exp-bar"><div className="exp-fill" data-width="85"></div></div>
                </div>
                <div className="expertise-item reveal reveal-delay-3">
                  <div className="exp-label">Cloud & DevOps</div>
                  <div className="exp-bar"><div className="exp-fill" data-width="88"></div></div>
                </div>
                <div className="expertise-item reveal">
                  <div className="exp-label">UI/UX Design</div>
                  <div className="exp-bar"><div className="exp-fill" data-width="92"></div></div>
                </div>
                <div className="expertise-item reveal reveal-delay-1">
                  <div className="exp-label">AI / ML Integration</div>
                  <div className="exp-bar"><div className="exp-fill" data-width="78"></div></div>
                </div>
              </div>

              {/* Process Timeline */}
              <div style={{ marginTop: '80px' }}>
                <div className="reveal">
                  <div className="section-label">How We Work</div>
                  <h2 className="section-title">Our <span>Process</span></h2>
                </div>
                <div className="process-timeline" style={{ marginTop: '48px' }}>
                  <div className="timeline-item reveal">
                    <div className="timeline-num">01</div>
                    <div className="timeline-content">
                      <h4>Discovery</h4>
                      <p>Deep-dive into your goals, audience, and vision. We ask the right questions to understand what you truly need.</p>
                    </div>
                  </div>
                  <div className="timeline-item reveal reveal-delay-1">
                    <div className="timeline-num">02</div>
                    <div className="timeline-content">
                      <h4>Planning</h4>
                      <p>Architecture design, tech stack selection, timeline planning, and milestone definition.</p>
                    </div>
                  </div>
                  <div className="timeline-item reveal reveal-delay-2">
                    <div className="timeline-num">03</div>
                    <div className="timeline-content">
                      <h4>Design</h4>
                      <p>High-fidelity UI/UX prototypes, brand alignment, and user flow validation before a single line of code.</p>
                    </div>
                  </div>
                  <div className="timeline-item reveal reveal-delay-3">
                    <div className="timeline-num">04</div>
                    <div className="timeline-content">
                      <h4>Development</h4>
                      <p>Agile sprints, code reviews, CI/CD pipelines, and weekly demos to keep you fully informed.</p>
                    </div>
                  </div>
                  <div className="timeline-item reveal">
                    <div className="timeline-num">05</div>
                    <div className="timeline-content">
                      <h4>Launch</h4>
                      <p>Rigorous testing, staged deployment, performance validation, and a smooth go-live experience.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* ===================== CONTACT PAGE ===================== */}
        <div id="contact-section" className={`page-section ${activeSection === 'contact' ? 'active' : ''}`}>
          <section id="contact-page">
            <div className="container">
              <div className="reveal" style={{ textAlign: 'center', maxWidth: '600px', margin: '0 auto' }}>
                <div className="section-label" style={{ justifyContent: 'center' }}>Let's Talk</div>
                <h2 className="section-title">Start Your <span>Project</span></h2>
                <p className="section-sub" style={{ margin: '0 auto' }}>Tell us about your idea and we'll get back to you within 24 hours.</p>
              </div>
              <div className="contact-grid">
                <div className="contact-info">
                  <div className="contact-info-item reveal">
                    <div className="c-icon">📞</div>
                    <div>
                      <div className="c-label">WhatsApp</div>
                      <div className="c-value"><a href="https://wa.me/96176473321" target="_blank" rel="noreferrer">+961 76 473 321</a></div>
                    </div>
                  </div>
                  <div className="contact-info-item reveal reveal-delay-1">
                    <div className="c-icon">✉️</div>
                    <div>
                      <div className="c-label">Email</div>
                      <div className="c-value"><a href="mailto:code4life.lb@gmail.com">code4life.lb@gmail.com</a></div>
                    </div>
                  </div>
                  <div className="contact-info-item reveal reveal-delay-2">
                    <div className="c-icon">📍</div>
                    <div>
                      <div className="c-label">Location</div>
                      <div className="c-value">Lebanon 🇱🇧</div>
                    </div>
                  </div>
                  <div className="reveal reveal-delay-3">
                    <div className="c-label" style={{ marginBottom: '12px', textAlign: 'center' }}>Follow Us</div>
                    <div className="social-links">
                      <a className="social-btn" href="https://instagram.com/_code4life" target="_blank" rel="noreferrer" title="Instagram">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="5"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/></svg>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>

      </main>

      {/* FOOTER */}
      <footer>
        <div className="container">
          <div className="footer-grid">
            <div className="footer-brand">
              <div className="nav-logo">
                <div className="logo-icon">&lt;/&gt;</div>
                <div className="logo-text">Code<span>4</span>Life</div>
              </div>
              <p>We design and develop powerful digital solutions for startups, businesses, and innovators. Code is our life.</p>
              <div className="social-links" style={{ marginTop: '20px' }}>
                <a className="social-btn" href="https://instagram.com/_code4life" target="_blank" rel="noreferrer" title="Instagram">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="5"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/></svg>
                </a>
              </div>
            </div>
            <div className="footer-col">
              <h5>Quick Links</h5>
              <ul className="footer-links">
                <li><a href="#" onClick={(e) => navigate(e, 'home')}>Home</a></li>
                <li><a href="#" onClick={(e) => navigate(e, 'services')}>Services</a></li>
                <li><a href="#" onClick={(e) => navigate(e, 'work')}>Our Work</a></li>
                <li><a href="#" onClick={(e) => navigate(e, 'about')}>About Us</a></li>
                <li><a href="#" onClick={(e) => navigate(e, 'contact')}>Contact</a></li>
              </ul>
            </div>
            <div className="footer-col">
              <h5>Services</h5>
              <ul className="footer-links">
                <li><a href="#" onClick={(e) => navigate(e, 'services')}>E-commerce</a></li>
                <li><a href="#" onClick={(e) => navigate(e, 'services')}>Web Development</a></li>
                <li><a href="#" onClick={(e) => navigate(e, 'services')}>Mobile Apps</a></li>
                <li><a href="#" onClick={(e) => navigate(e, 'services')}>Desktop Apps</a></li>
              </ul>
            </div>
            <div className="footer-col">
              <h5>Contact</h5>
              <ul className="footer-links">
                <li><a href="https://wa.me/96176473321" target="_blank" rel="noreferrer">📞 WhatsApp</a></li>
                <li><a href="mailto:code4life.lb@gmail.com">✉ code4life.lb@gmail.com</a></li>
                <li><a href="https://instagram.com/_code4life" target="_blank" rel="noreferrer">📸 @_code4life</a></li>
                <li><a>📍 Lebanon 🇱🇧</a></li>
              </ul>
            </div>
          </div>
          <div className="footer-bottom">
            <div className="footer-copy">© 2025 <span>Code4Life</span>. All rights reserved.</div>
            <div className="footer-copy" style={{ fontSize: '0.7rem' }}>Built with 💚 in Lebanon</div>
          </div>
        </div>
      </footer>
    </>
  );
}
