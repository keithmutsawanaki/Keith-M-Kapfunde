import { ArrowUpRight, ArrowLeftRight } from 'lucide-react';
import { useEffect, useState } from 'react';
import { BrowserRouter, Link, Route, Routes, useLocation } from 'react-router-dom';
import Navbar from './Components/Navbar';
import ReferenceHome, { ReferenceFooter } from './reference/ReferenceHome';
import DotField from './reference/DotField';
import { certifications, projectCards, skills, timeline } from './content';

function Label({ children }: { children: React.ReactNode }) { return <span className="section-label">[ {children} ]</span>; }

function PageEffects() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (hash) requestAnimationFrame(() => document.getElementById(hash.slice(1))?.scrollIntoView());
    else window.scrollTo({ top: 0, behavior: 'instant' });
    const pageNames: Record<string, string> = { '/about': 'About', '/projects': 'Projects', '/certifications': 'Certifications' };
    document.title = `${pageNames[pathname] ? `${pageNames[pathname]} · ` : ''}Keith Kapfunde — Full Stack Developer`;
  }, [pathname, hash]);
  useEffect(() => {
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.add('revealed'); observer.unobserve(entry.target); }
    }), { threshold: .08 });
    document.querySelectorAll('[data-reveal]').forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, [pathname]);
  return null;
}

function ScrollProgress() {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    let scheduled = false;
    const update = () => { if (scheduled) return; scheduled = true; requestAnimationFrame(() => { const max = document.documentElement.scrollHeight - innerHeight; setProgress(max > 0 ? Math.min(100, Math.round(scrollY / max * 100)) : 0); scheduled = false; }); };
    window.addEventListener('scroll', update, { passive: true });window.addEventListener('resize', update);update();
    return () => { window.removeEventListener('scroll', update);window.removeEventListener('resize', update); };
  }, []);
  return <div className="scroll-progress" aria-hidden="true"><span style={{ height: `${progress}%` }}/><b>{String(progress).padStart(3, '0')}%</b></div>;
}

function ProjectCard({ project, index }: { project: typeof projectCards[number]; index: number }) {
  const [imageFailed, setImageFailed] = useState(false);
  return <article className={`work-card work-${index % 3}`}>
    <div className="work-top"><span>PROJECT / {String(index + 1).padStart(2, '0')}</span><span aria-hidden="true"><ArrowUpRight aria-hidden="true"/></span></div>
    <div className="work-art">{project.image && !imageFailed ? <img className="project-screenshot" src={project.image} alt={`${project.title} website screenshot`} loading="lazy" onError={() => setImageFailed(true)}/> : <><div className="art-lines"/><span aria-hidden="true">{index === 2 ? 'oak.' : index === 3 ? 'taskflow_' : index === 5 ? '{ API }' : index === 0 ? 'N.' : 'KK.'}</span></>}</div>
    <div className="work-copy"><span className="work-category">{project.category}</span><h3>{project.title}</h3><p>{project.text}</p>
    {project.url ? <a className="text-link" href={project.url} target="_blank" rel="noreferrer">Visit project <span aria-hidden="true"><ArrowUpRight aria-hidden="true"/></span></a> : <span className="project-note">Development project <span aria-hidden="true">—</span></span>}</div>
  </article>;
}

function Certificates({ full = false }: { full?: boolean }) {
  return <section className="certificates content-width" data-reveal><div className="section-heading"><div><Label>Learning path</Label><h2>A foundation.<br/>Always evolving<span className="accent">.</span></h2></div><p>Building a strong foundation through practice, hands-on projects, and continuous learning.</p></div><div className="certificate-list">{certifications.map((cert, i) => <a key={cert.label} href={cert.url} target="_blank" rel="noreferrer"><span className="certificate-index">0{i + 1}</span><h3>{cert.label}</h3><span className="certificate-source">Coursera</span><span className="certificate-arrow" aria-hidden="true"><ArrowUpRight aria-hidden="true"/></span></a>)}</div>{!full && <Link className="text-link cert-more" to="/certifications">View learning path <ArrowUpRight aria-hidden="true"/></Link>}</section>;
}

function Contact() { return <ReferenceFooter/>; }

function AboutContent({ full = false }: { full?: boolean }) {
  return <section className="about-section content-width" data-reveal><div className="about-heading"><Label>The developer</Label><h2>Curiosity.<br/>Code.<br/><span className="accent">Possibility.</span></h2><Link className="text-link" to={full ? '/projects' : '/about'}>{full ? 'Explore my work' : 'More about me'} <ArrowUpRight aria-hidden="true"/></Link></div><div className="about-details"><div className="profile-art" aria-hidden="true"><span>KK<span className="accent">.</span></span><div className="profile-coordinates">FRONTEND <ArrowLeftRight aria-hidden="true"/> BACKEND<br/>ALWAYS EVOLVING / EST. 2026</div></div><p>I’m Keith Mutsawanaki Kapfunde, a full stack developer focused on building practical digital solutions that turn ideas into working products. I enjoy solving problems through technology, learning by building, and continuously improving the way I create.</p><p>I started my developer journey in 2026. My work is driven by curiosity, consistency, and a desire to build clean, useful, and scalable digital experiences.</p>{full && <p>I focus on readable, maintainable code and thoughtful user experiences. Outside of coding I enjoy learning new tools, reading about design, and contributing to projects that help people learn.</p>}<div className="availability"><span className="online-dot"/> Available for freelance work & collaborations</div></div></section>;
}

function Journey() {
  return <section className="journey content-width" data-reveal><div><Label>The journey</Label><h2>One project<br/>at a time<span className="accent">.</span></h2></div><div className="timeline">{timeline.map(item => <div key={item.role}><span>{item.period}</span><h3>{item.role}</h3><p>{item.company}</p></div>)}</div></section>;
}

function Projects() { return <><main id="main-content" className="inner-page content-width"><Label>Selected work / 06 projects</Label><h1>Ideas into<br/>working products<span className="accent">.</span></h1><p className="page-intro">A collection of frontend experiences, full stack applications, and collaborative work from my developer journey.</p><div className="project-grid">{projectCards.map((project, index) => <ProjectCard project={project} index={index} key={project.title}/>)}</div></main><Contact/></>; }
function About() { return <><main id="main-content" className="inner-page"><div className="content-width"><Label>About Keith</Label><h1>A developer.<br/>Always evolving<span className="accent">.</span></h1></div><AboutContent full/><div id="stack" className="content-width skills-section"><Label>The stack</Label><h2>Tools behind the ideas<span className="accent">.</span></h2><div className="tags">{skills.map(skill => <span key={skill}>{skill}</span>)}</div></div><Journey/></main><Contact/></>; }
function Certifications() { return <><main id="main-content" className="inner-page"><div className="content-width"><Label>Certifications</Label><h1>Never stop<br/>learning<span className="accent">.</span></h1><p className="page-intro">Skills I’m building as I move forward in tech.</p></div><Certificates full/></main><Contact/></>; }
function NotFound() { return <><main id="main-content" className="inner-page content-width"><Label>404</Label><h1>Let’s get<br/>back on track<span className="accent">.</span></h1><Link className="pill" to="/">Back to home <ArrowUpRight aria-hidden="true"/></Link></main><Contact/></>; }

export default function App() { return <BrowserRouter><a className="skip-link" href="#main-content">Skip to content</a><DotField/><PageEffects/><Navbar/><ScrollProgress/><Routes><Route path="/" element={<ReferenceHome/>}/><Route path="/projects" element={<Projects/>}/><Route path="/about" element={<About/>}/><Route path="/certifications" element={<Certifications/>}/><Route path="*" element={<NotFound/>}/></Routes></BrowserRouter>; }
