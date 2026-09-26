
import React, { useEffect, useState } from 'react';
import { getProfile, getExperiences, getProjects, getSkills, getServices, API_BASE } from '../api';

const PortfolioHome = () => {
  const [profile, setProfile] = useState({});
  const [experiences, setExperiences] = useState([]);
  const [projects, setProjects] = useState([]);
  const [skills, setSkills] = useState([]);
  const [services, setServices] = useState([]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleDownloadCv = async (e) => {
    if (e) e.preventDefault();
    const downloadUrl = `${API_BASE}/portfolio/cv`;
    try {
      const res = await fetch(downloadUrl);
      if (res.ok) {
        const blob = await res.blob();
        const blobUrl = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = blobUrl;
        link.download = 'Esthyak_Ahmmed_Siyam_CV.pdf';
        document.body.appendChild(link);
        link.click();
        link.remove();
        setTimeout(() => window.URL.revokeObjectURL(blobUrl), 1000);
        return;
      }
    } catch (err) {
      console.warn("Direct blob download failed, falling back to window.open", err);
    }
    window.open(downloadUrl, '_blank');
  };

  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? 'hidden' : '';
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setMobileMenuOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [mobileMenuOpen]);

  useEffect(() => {
    Promise.all([
      getProfile().then(res => res && setProfile(res)),
      getExperiences().then(res => res && setExperiences(res)),
      getProjects().then(res => res && setProjects(res)),
      getSkills().then(res => res && setSkills(res)),
      getServices().then(res => res && setServices(res))
    ]).then(() => {
      // Re-trigger global scripts after React renders the template
      setTimeout(() => {
        window.dispatchEvent(new Event('DOMContentLoaded'));
        window.dispatchEvent(new Event('load'));
      }, 500);
    });
  }, []);

  return (
    <div className="portfolio-home">
      

    {/*  Noise Overlay for Cinematic Texture  */}
    <div className="noise-overlay" aria-hidden="true"></div>

    {/*  GTM noscript  */}
    

    {/*  Skip to content  */}
    <a className="skip-link" href="#main">Skip to main content</a>

    {/*  ══════════════════════════════════════════
       NAVIGATION
       ══════════════════════════════════════════  */}
    <nav id="site-nav" className="nav" role="navigation" aria-label="Main navigation">
        <div className="nav__inner">

            <a href="#home" className="nav__logo" aria-label="{profile.name || 'Esthyak Ahmmed Siyam'} — Home" style={{"display":"flex","alignItems":"center","gap":"8px"}}>
        
        
        <svg width="36" height="36" viewBox="0 0 100 100" fill="none" style={{"display":"inline-block","verticalAlign":"middle"}}>
          <path d="M 50 15 L 80 32.5 L 50 50 L 20 67.5 L 50 85" stroke="#F0F2F5" strokeWidth="10" strokeLinecap="square" strokeLinejoin="miter"/>
          <path d="M 50 15 L 20 32.5" stroke="#C9A84C" strokeWidth="10" strokeLinecap="square" strokeLinejoin="miter"/>
          <path d="M 50 85 L 80 67.5" stroke="#C9A84C" strokeWidth="10" strokeLinecap="square" strokeLinejoin="miter"/>
        </svg>


        <span style={{"fontFamily":"var(--font-display)","fontSize":"1.15rem","fontWeight":"700","letterSpacing":"-0.02em","color":"var(--text-primary)", "whiteSpace": "nowrap", "overflow": "hidden", "textOverflow": "ellipsis"}}>{profile.name || 'Esthyak Ahmmed Siyam'}</span>
      </a>

            <ul className="nav__links" role="list">
                <li><a href="#about" className="nav__link">About</a></li>
                <li><a href="#expertise" className="nav__link">Expertise</a></li>
                <li><a href="#work" className="nav__link">Work</a></li>
                <li><a href="#services" className="nav__link">Services</a></li>
                <li><a href="#contact" className="nav__link">Contact</a></li>
            </ul>

            <div className="nav__actions" style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <a 
                  href={`${API_BASE}/portfolio/cv`} 
                  onClick={handleDownloadCv}
                  download="Esthyak_Ahmmed_Siyam_CV.pdf"
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="nav__resume-btn hidden md:inline-flex"
                  title="Download CV"
                  style={{
                    alignItems: "center",
                    gap: "6px",
                    padding: "6px 14px",
                    borderRadius: "4px",
                    border: "1px solid rgba(201, 168, 76, 0.4)",
                    color: "var(--gold, #C9A84C)",
                    fontSize: "0.85rem",
                    fontWeight: "600",
                    textDecoration: "none",
                    cursor: "pointer",
                    transition: "all 0.2s ease"
                  }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                  Resume
                </a>
                <a href={profile.github || '#'} className="nav__github" target="_blank" rel="noopener noreferrer" aria-label="GitHub profile">
          <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/></svg>
          GitHub
        </a>
                <button 
                  className={`nav__hamburger ${mobileMenuOpen ? 'open' : ''}`} 
                  id="nav-hamburger" 
                  aria-label="Toggle menu" 
                  aria-expanded={mobileMenuOpen}
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                >
                  <span></span><span></span><span></span>
                </button>
            </div>
        </div>
    </nav>

    {/*  Mobile menu overlay  */}
    <div 
      id="nav-mobile" 
      className={`nav__mobile ${mobileMenuOpen ? 'open' : ''}`} 
      role="dialog" 
      aria-modal="true" 
      aria-label="Mobile navigation"
    >
        <a href="#about" className="nav__mobile-link" onClick={() => setMobileMenuOpen(false)}>About</a>
        <a href="#expertise" className="nav__mobile-link" onClick={() => setMobileMenuOpen(false)}>Expertise</a>
        <a href="#work" className="nav__mobile-link" onClick={() => setMobileMenuOpen(false)}>Work</a>
        <a href="#services" className="nav__mobile-link" onClick={() => setMobileMenuOpen(false)}>Services</a>
        <a href="#contact" className="nav__mobile-link" onClick={() => setMobileMenuOpen(false)}>Contact</a>
        <div className="nav__mobile-cta" style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            <a 
              href={`${API_BASE}/portfolio/cv`} 
              onClick={(e) => { setMobileMenuOpen(false); handleDownloadCv(e); }}
              download="Esthyak_Ahmmed_Siyam_CV.pdf"
              target="_blank" 
              rel="noopener noreferrer" 
              className="btn btn-secondary"
              style={{
                borderColor: "rgba(201, 168, 76, 0.4)",
                color: "var(--gold, #C9A84C)"
              }}
            >
              Download Resume
            </a>
            <a href="#contact" className="btn btn-primary" onClick={() => setMobileMenuOpen(false)}>Let's Talk</a>
        </div>
    </div>

    <main id="main">

        {/*  ══════════════════════════════════════════
         HERO
         ══════════════════════════════════════════  */}
        <section id="home" className="hero" aria-label="Introduction" style={{ position: 'relative', minHeight: '100vh', display: 'flex', alignItems: 'center', background: 'transparent', padding: '100px 0 60px 0' }}>
            <div className="container" style={{ zIndex: 2, textAlign: 'center', maxWidth: '900px', margin: '0 auto' }}>
                
                <div className="hero__image-wrap reveal" style={{ width: '130px', height: '130px', margin: '0 auto 2rem auto', borderRadius: '50%', overflow: 'hidden', border: '2px solid rgba(255,255,255,0.1)', boxShadow: '0 15px 35px rgba(0,0,0,0.5)' }}>
                    <img src={profile.heroImage || '/siyam.png'} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>

                <h1 className="reveal reveal-delay-1" style={{ fontSize: 'clamp(2.5rem, 7vw, 6rem)', lineHeight: '1.1', fontWeight: 800, color: '#F8FAFC', marginBottom: '1.5rem', letterSpacing: '-0.04em' }}>
                    I am a <span style={{ color: 'var(--gold, #C9A84C)', fontStyle: 'italic', paddingRight: '0.1em' }}>Developer</span>.
                </h1>

                <p className="reveal reveal-delay-2" style={{ fontSize: 'clamp(1.1rem, 2vw, 1.25rem)', color: '#94A3B8', maxWidth: '650px', margin: '0 auto 2.5rem auto', lineHeight: '1.6' }}>
                    Hi, I'm <strong style={{color: '#E2E8F0', fontWeight: 600}}>{profile.name ? profile.name.split(' ')[0] : 'Esthyak'}</strong>. I write code and solve problems. If it can be imagined, I can build it.
                </p>

                <div className="hero__cta reveal reveal-delay-3" style={{ display: 'flex', gap: '1rem', justifyContent: 'center', alignItems: 'center', flexWrap: 'wrap' }}>
                    <a href="#work" style={{ padding: '16px 32px', background: '#E2E8F0', color: '#0F172A', borderRadius: '12px', fontWeight: 600, textDecoration: 'none', transition: 'all 0.3s ease', display: 'inline-flex', alignItems: 'center', gap: '8px' }} onMouseOver={(e) => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.background = '#FFFFFF'; e.currentTarget.style.boxShadow = '0 10px 25px rgba(255,255,255,0.15)' }} onMouseOut={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.background = '#E2E8F0'; e.currentTarget.style.boxShadow = 'none' }}>
                        View Projects
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                    </a>
                    <a href="#contact" style={{ padding: '16px 32px', background: 'transparent', color: '#F8FAFC', borderRadius: '12px', fontWeight: 600, border: '1px solid rgba(255,255,255,0.2)', textDecoration: 'none', transition: 'all 0.3s ease' }} onMouseOver={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.4)' }} onMouseOut={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)' }}>
                        Let's Talk
                    </a>
                </div>

                <div className="hero__social reveal reveal-delay-5" style={{ display: 'flex', justifyContent: 'center', gap: '1.5rem', marginTop: '3.5rem', paddingTop: '2rem', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                    {profile.github && (
                        <a href={profile.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub" style={{ color: '#94A3B8', transition: 'color 0.2s', display: 'flex', alignItems: 'center' }} onMouseOver={(e) => e.currentTarget.style.color = '#F8FAFC'} onMouseOut={(e) => e.currentTarget.style.color = '#94A3B8'}>
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/></svg>
                        </a>
                    )}
                    {profile.linkedin && (
                        <a href={profile.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" style={{ color: '#94A3B8', transition: 'color 0.2s', display: 'flex', alignItems: 'center' }} onMouseOver={(e) => e.currentTarget.style.color = '#F8FAFC'} onMouseOut={(e) => e.currentTarget.style.color = '#94A3B8'}>
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                        </a>
                    )}
                    {profile.whatsapp && (
                        <a href={`https://wa.me/${profile.whatsapp}`} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp" style={{ color: '#94A3B8', transition: 'color 0.2s', display: 'flex', alignItems: 'center' }} onMouseOver={(e) => e.currentTarget.style.color = '#F8FAFC'} onMouseOut={(e) => e.currentTarget.style.color = '#94A3B8'}>
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                        </a>
                    )}
                </div>

            </div>

            {/*  Scroll indicator  */}
            <div className="hero__scroll" aria-hidden="true">
                <span>Scroll</span>
                <span className="hero__scroll-line"></span>
            </div>
        </section>
        {/*  /#home  */}


        {/*  ══════════════════════════════════════════
         STATS BAR
         ══════════════════════════════════════════  */}
        

        <hr className="section-divider" />


        {/*  ══════════════════════════════════════════
         ABOUT / POSITIONING
         ══════════════════════════════════════════  */}
        <section id="about" className="section" aria-labelledby="about-heading">
            <div className="container">
                <div className="section-header reveal">
                    <p className="text-eyebrow">// Developer.Core</p>
                    <h2 className="text-headline" id="about-heading">I write code. I build anything.</h2>
                </div>

                <div className="about__inner">
                    {/*  Text left  */}
                    <div className="about__text">
                        <p className="text-body reveal">
                            {profile.about || 'Hi, I am Esthyak Ahmmed Siyam. I am a passionate Developer, and code is my ultimate tool to create, solve, and build.'}
                        </p>
                        <p className="text-body reveal reveal-delay-1">
                            As a developer, I don't just put together pieces—I engineer solutions from the ground up. Whether it's complex backends, seamless frontends, or full-scale architectures, I have the capability to build whatever logic your business requires.
                        </p>
                        <p className="text-body reveal reveal-delay-2">
                            My philosophy is simple: if a problem exists, it can be solved with code. I am completely confident in my ability to dive into any stack and bring any idea into existence.
                        </p>
                        <div className="reveal reveal-delay-3" style={{"marginTop":"var(--space-8)"}}>
                            <a href="#work" className="btn btn-ghost">See My Work</a>
                        </div>
                    </div>

                    {/*  Pillar cards right  */}
                    <div className="about__pillars">
      {experiences && experiences.slice(0, 3).map((exp, index) => (
        <div key={exp._id || index} className={"pillar-card reveal " + (index > 0 ? "reveal-delay-1" : "")}>
          <div className="pillar-card__content">
            <h4>{exp.job}</h4>
            <p className="text-sm" style={{color: 'var(--accent)', marginBottom: '0.5rem'}}>{exp.company} | {exp.date}</p>
            <p>{exp.responsibilities && exp.responsibilities[0]}</p>
          </div>
        </div>
      ))}
</div></div></div></section>
        {/*  /#about  */}

        <hr className="section-divider" />


        {/*  ══════════════════════════════════════════
         CORE EXPERTISE
         ══════════════════════════════════════════  */}
        <section id="expertise" className="section section-alt" aria-labelledby="expertise-heading">
            <div className="container">
                <div className="section-header reveal">
                    <p className="text-eyebrow">// What.I.Do</p>
                    <h2 className="text-headline" id="expertise-heading">Core Expertise</h2>
                    <p className="text-body">Six domains. One operator who works across all of them.</p>
                </div>

                <div className="expertise__grid">

      {skills && skills.map((skill, index) => (
        <div key={skill._id || index} className={"expertise-card reveal " + (index > 0 ? "reveal-delay-1" : "")}>
          <h3 className="expertise-card__title" style={{marginTop: "1rem"}}>{skill.name}</h3>
        </div>
      ))}

</div>{/* /.expertise__grid */}
            </div>
        </section>
        {/*  /#expertise  */}

        <hr className="section-divider" />


        {/*  ══════════════════════════════════════════
         FEATURED WORK + CASE STUDIES
         ══════════════════════════════════════════  */}
        <section id="work" className="section" aria-labelledby="work-heading">
            <div className="container">
                <div className="section-header reveal">
                    <p className="text-eyebrow">// Architectural.Case.Studies</p>
                    <h2 className="text-headline" id="work-heading">Work That Matters</h2>
                    <p className="text-body">I don't just build websites — I architect digital systems. Here are four that represent what I actually do.</p>
                </div>

                {/*  Featured case studies  */}
                <div className="featured-cases">

      {projects && projects.filter(p => !p.category || p.category === 'Featured').map((project, index) => (
        <article key={project._id || index} className={"case-card reveal " + (index > 0 ? "reveal-delay-1" : "")}>
          <div className="case-card__left">
            <p className="case-card__meta">// {index + 1 < 10 ? '0'+(index+1) : index+1} — {project.name}</p>
            <h3 className="case-card__title">{project.name}</h3>
            <p className="case-card__story">{project.description || 'A modern full-stack web application.'}</p>
          </div>
          <div className="case-card__right">
            {project.link && project.link !== "#" && (
              <a href={project.link} className="btn btn-primary btn-sm" target="_blank" rel="noopener noreferrer">
                Live Demo
              </a>
            )}
            {project.github && (
              <a href={project.github} className="btn btn-ghost btn-sm" target="_blank" rel="noopener noreferrer">
                GitHub
              </a>
            )}
          </div>
        </article>
      ))}

</div>{/* /.featured-cases */}

                {/*  Project card grid  */}
                <div id="project-grid" style={{"marginTop":"var(--space-6)"}}>
                    <div className="section-header reveal" style={{"marginBottom":"var(--space-8)"}}>
                        <p className="text-eyebrow">// More.Work</p>
                        <h3 className="text-subheadline" style={{"color":"var(--text-primary)"}}>More Projects</h3>
                    </div>

                    
                    <div className="project-grid">
                        {projects && projects.filter(p => p.category === 'MoreProjects' || p.category === 'Minor').map((proj, idx) => (
                            <div key={proj._id || idx} className={`project-card reveal reveal-delay-${idx % 6}`}>
                                <p className="project-card__role">{proj.description || "Full-Stack Project"}</p>
                                <h4 className="project-card__title">{proj.name}</h4>
                                <div className="project-card__footer" style={{marginTop: "var(--space-3)"}}>
                                    <div className="tag-group">
                                        <span className="tag tag-neutral">{proj.year}</span>
                                    </div>
                                    <div style={{display: "flex", gap: "var(--space-3)"}}>
                                        {proj.github && proj.github !== "#" && (
                                            <a href={proj.github} className="project-card__link" target="_blank" rel="noopener noreferrer">GitHub →</a>
                                        )}
                                        {proj.link && proj.link !== "#" && (
                                            <a href={proj.link} className="project-card__link" target="_blank" rel="noopener noreferrer">Visit →</a>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/*  /.project-grid  */}
                </div>
            </div>
        </section>
        {/*  /#work  */}

        <hr className="section-divider" />


        {/*  ══════════════════════════════════════════
         AI DEV WORKFLOW (detailed)
         ══════════════════════════════════════════  */}
        

        <hr className="section-divider" />


        {/*  ══════════════════════════════════════════
         TECH STACK
         ══════════════════════════════════════════  */}
        <section id="stack" className="section" aria-labelledby="stack-heading">
            <div className="container">
                <div className="section-header reveal">
                    <p className="text-eyebrow">// Technical.Fluency</p>
                    <h2 className="text-headline" id="stack-heading">Tech Stack</h2>
                </div>

                <div className="stack__groups">

      {skills && skills.length > 0 && (
        <div className="reveal glass-card" style={{width: "100%"}}>
          <p className="stack-group__label">Technologies & Tools</p>
          <div className="stack-group__items">
            {skills.map((skill, index) => (
              <span key={skill._id || index} className="stack-item">{skill.name}</span>
            ))}
          </div>
        </div>
      )}

</div></div></section>
        {/*  /#stack  */}

        <hr className="section-divider" />


        {/*  ══════════════════════════════════════════
         GITHUB / OPEN SOURCE
         ══════════════════════════════════════════  */}
        <section id="github" className="section section-alt" aria-labelledby="github-heading">
            <div className="container">
                <div className="section-header reveal">
                    <p className="text-eyebrow">// Open.Source</p>
                    <h2 className="text-headline" id="github-heading">On GitHub</h2>
                    <p className="text-body">Three plugins and tools built to solve real problems — open source, documented, and in use.</p>
                </div>

                <div className="github__repos">

      {projects && projects.filter(p => p.category === 'OpenSource').map((project, index) => (
        <a key={project._id || index} href={project.github} className={"repo-card reveal " + (index > 0 ? "reveal-delay-1" : "")} target="_blank" rel="noopener noreferrer">
            <div className="repo-card__header">
                <span className="repo-card__icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z"/></svg>
                </span>
                <span className="repo-card__name">{project.name}</span>
            </div>
            <p className="repo-card__desc">{project.description}</p>
        </a>
      ))}

</div>


                <div className="reveal" style={{"marginTop":"var(--space-8)","textAlign":"center"}}>
                    <a href={profile.github || '#'} className="btn btn-ghost" target="_blank" rel="noopener noreferrer">
            View Profile
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3"/></svg>
          </a>
                </div>
            </div>
        </section>
        {/*  /#github  */}

        <hr className="section-divider" />


        {/*  ══════════════════════════════════════════
         SERVICES
         ══════════════════════════════════════════  */}
        <section id="services" className="section" aria-labelledby="services-heading">
            <div className="container">
                <div className="section-header reveal">
                    <p className="text-eyebrow">// What.I.Can.Build</p>
                    <h2 className="text-headline" id="services-heading">Engineering &amp; Development</h2>
                    <p className="text-body">As a developer, I can build and engineer virtually anything you need. If you have an idea, we can write the code to make it real.</p>
                </div>

                
                <div className="services__grid">
                    {services && services.length > 0 ? services.map((s, idx) => (
                        <div key={s._id || idx} className={`service-card reveal reveal-delay-${(idx % 3) + 1}`}>
                            <div className="icon-box" aria-hidden="true" dangerouslySetInnerHTML={{ __html: s.iconSvg || '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>' }}>
                            </div>
                            <h3 className="service-card__title">{s.title}</h3>
                            <p className="service-card__desc">{s.description}</p>
                            <a href="#contact" className="btn btn-ghost btn-sm">Discuss Project</a>
                        </div>
                    )) : (
                        <p className="text-textMuted">No services available.</p>
                    )}
                </div>

            </div>
        </section>
        {/*  /#services  */}

        <hr className="section-divider" />


        {/*  ══════════════════════════════════════════
         CONTACT
         ══════════════════════════════════════════  */}
        <section id="contact" className="section section-alt" aria-labelledby="contact-heading">
            <div className="container">
                <div className="contact__inner">

                    {/*  Left: info  */}
                    <div className="contact__info">
                        <div className="reveal">
                            <p className="text-eyebrow" style={{"marginBottom":"var(--space-4)"}}>// Get.In.Touch</p>
                            <h2 className="text-headline contact__headline" id="contact-heading">Let's build something that works.</h2>
                        </div>
                        <p className="contact__subtext reveal reveal-delay-1">
                            I'm selective about what I take on. If the project is interesting and the problem is real, I want to hear about it. No need for a formal brief — just tell me what you're trying to build.
                        </p>

                        
                        <div className="contact__direct reveal reveal-delay-2">
                            {profile.email && (
                                <a href={`mailto:${profile.email}`} className="contact__direct-item" aria-label="Send email">
                                    <div className="icon-box">
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                                    </div>
                                    <div>
                                        <p className="contact__direct-label">Email</p>
                                        <p className="contact__direct-value">{profile.email}</p>
                                    </div>
                                </a>
                            )}
                            {profile.whatsapp && (
                                <a href={`https://wa.me/${profile.whatsapp}`} className="contact__direct-item" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp">
                                    <div className="icon-box">
                                        <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                                    </div>
                                    <div>
                                        <p className="contact__direct-label">WhatsApp</p>
                                        <p className="contact__direct-value">{profile.whatsapp}</p>
                                    </div>
                                </a>
                            )}
                        </div>

                        <div className="contact__links-grid reveal reveal-delay-3" style={{"marginTop":"var(--space-8)","display":"grid","gridTemplateColumns":"1fr 1fr","gap":"var(--space-6)"}}>
                            {/*  Personal Network  */}
                            <div>
                                <h4 style={{"fontFamily":"var(--font-mono)","fontSize":"0.72rem","letterSpacing":"0.1em","textTransform":"uppercase","color":"var(--accent)","marginBottom":"var(--space-3)"}}>// Personal</h4>
                                <ul style={{"display":"flex","flexDirection":"column","gap":"var(--space-2)","fontSize":"0.85rem","padding":"0","listStyle":"none"}}>
                                                        
                            {profile.email && (
                                <li><a href={`mailto:${profile.email}`} className="text-link" style={{"textDecoration":"none"}}>Email</a></li>
                            )}
                            {profile.github && (
                                <li><a href={profile.github} className="text-link" style={{"textDecoration":"none"}} target="_blank" rel="noopener noreferrer">GitHub</a></li>
                            )}
                            {profile.linkedin && (
                                <li><a href={profile.linkedin} className="text-link" style={{"textDecoration":"none"}} target="_blank" rel="noopener noreferrer">LinkedIn</a></li>
                            )}

                                </ul>
                            </div>

                            {/*  Work / Brands  */}
                            <div>
                                <h4 style={{"fontFamily":"var(--font-mono)","fontSize":"0.72rem","letterSpacing":"0.1em","textTransform":"uppercase","color":"var(--accent)","marginBottom":"var(--space-3)"}}>// Work / Brands</h4>
                                <ul style={{"display":"flex","flexDirection":"column","gap":"var(--space-2)","fontSize":"0.85rem","padding":"0","listStyle":"none"}}>
                                    {projects && projects.slice(0, 3).map((p, i) => (
                                        p.link && p.link !== '#' ? (
                                            <li key={p._id || i}><a href={p.link} className="text-link" style={{"textDecoration":"none"}} target="_blank" rel="noopener noreferrer">{p.name}</a></li>
                                        ) : null
                                    ))}
                                </ul>

                            </div>
                        </div>
                    </div>
                    {/*  /.contact__info  */}

                    {/*  Right: form  */}
                    <div className="contact__form-wrap reveal reveal-delay-1">
                        <h3 className="contact__form-title">Send a Message</h3>
                        <form id="contact-form" action="https://formspree.io/f/mrblblll" method="POST" novalidate>
                            <div className="contact__form-row">
                                <div className="form-group">
                                    <label className="form-label" htmlFor="name">Full Name *</label>
                                    <input className="form-input" id="name" name="firstname" type="text" placeholder="Your name" required autocomplete="name" />
                                </div>
                                <div className="form-group">
                                    <label className="form-label" htmlFor="email">Email *</label>
                                    <input className="form-input" id="email" name="email" type="email" placeholder="your@email.com" required autocomplete="email" />
                                </div>
                            </div>

                            <div className="form-group">
                                <label className="form-label" htmlFor="subject">Subject *</label>
                                <input className="form-input" id="subject" name="subject" type="text" placeholder="What's this about?" required />
                            </div>

                            <div className="form-group">
                                <label className="form-label" htmlFor="service">Service (optional)</label>
                                <select className="form-input" id="service" name="service_needed">
                  <option value="">Select a service…</option>
                  <option value="Web Architecture &amp; E-commerce">Web Architecture &amp; E-commerce</option>
                  <option value="SEO &amp; Digital Growth">SEO &amp; Digital Growth</option>
                  <option value="Brand Strategy &amp; Consulting">Brand Strategy &amp; Consulting</option>
                  <option value="AI-Assisted Development">AI-Assisted Development</option>
                  <option value="Other">Other</option>
                </select>
                            </div>

                            <div className="form-group">
                                <label className="form-label" htmlFor="message">Message *</label>
                                <textarea className="form-input" id="message" name="message" placeholder="Tell me about your project…" required></textarea>
                            </div>

                            <button type="submit" className="btn btn-primary" id="form-submit" style={{"width":"100%","justifyContent":"center"}}>
                Send Message
              </button>

                            <div id="form-feedback" className="form-feedback" role="alert" aria-live="polite"></div>
                        </form>
                    </div>
                    {/*  /.contact__form-wrap  */}

                </div>
                {/*  /.contact__inner  */}
            </div>
        </section>
        {/*  /#contact  */}

    </main>


    {/*  ══════════════════════════════════════════
       FOOTER
       ══════════════════════════════════════════  */}
    <footer className="footer" role="contentinfo">
        <div className="footer__inner">
            <div className="footer__brand">
                <div style={{"display":"flex","alignItems":"center","gap":"10px","marginBottom":"var(--space-2)"}}>
                    <svg width="28" height="28" viewBox="0 0 100 100" fill="none">
                      <path d="M 50 15 L 80 32.5 L 50 50 L 20 67.5 L 50 85" stroke="#F0F2F5" strokeWidth="10" strokeLinecap="square" strokeLinejoin="miter"/>
                      <path d="M 50 15 L 20 32.5" stroke="#C9A84C" strokeWidth="10" strokeLinecap="square" strokeLinejoin="miter"/>
                      <path d="M 50 85 L 80 67.5" stroke="#C9A84C" strokeWidth="10" strokeLinecap="square" strokeLinejoin="miter"/>
                    </svg>
                    <h3 style={{"marginBottom":"0"}}>{profile.name || 'Esthyak Ahmmed Siyam'}</h3>
                </div>
                <p>Full-Stack Developer &amp; Digital Architect · Bangladesh</p>
            </div>

            <nav className="footer__nav" aria-label="Footer navigation">
                <a href="#about">About</a>
                <a href="#expertise">Expertise</a>
                <a href="#work">Work</a>
                <a href="#services">Services</a>
                <a href="#contact">Contact</a>
            </nav>

            <div className="footer__right">
                <div className="social-links" style={{"justifyContent":"flex-end"}}>
                    <a href={profile.github || '#'} className="social-link" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
            <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/></svg>
          </a>
                    <a href="https://www.linkedin.com/in/eahmedsiyam/" className="social-link" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
            <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
          </a>
                </div>
                <p className="footer__copy">&copy; 2025 {profile.name || 'Esthyak Ahmmed Siyam'}. All rights reserved.</p>
            </div>
        </div>
    </footer>

    {/*  Mobile sticky CTA  */}
    <div className="mobile-cta-bar" aria-hidden="true">
        <a href="#contact" className="btn btn-primary btn-sm">Get In Touch</a>
    </div>


    {/*  ══════════════════════════════════════════
       STRUCTURED DATA (JSON-LD)
       ══════════════════════════════════════════  */}
    

    {/*  ── JS (module — auto-deferred, no build step) ──  */}
    


    </div>
  );
};

export default PortfolioHome;
