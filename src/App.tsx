import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./Components/Navbar";

const stats = [
  { value: "1st", label: "year building" },
  { value: "3+", label: "projects shipped" },
  { value: "2", label: "core stacks" },
  { value: "100%", label: "curious" },
];

const projectCards = [
  {
    title: "Natasha's Portfolio",
    category: "frontend + digital marketing",
    text: "A professional digital marketer's portfolio showcasing social media marketing, content creation, and digital strategy expertise with a modern design.",
    url: "https://natasha-portfolio.onrender.com",
    image: "https://natasha-portfolio.onrender.com/NATASHA.jpeg",
  },
  {
    title: "Personal Portfolio",
    category: "full stack developer portfolio",
    text: "A comprehensive portfolio site demonstrating full-stack development skills with React, JavaScript, Python, and responsive web design.",
    url: "https://portfolio-7o1b.onrender.com/",
    image: "https://portfolio-7o1b.onrender.com/profile.jpeg",
  },
  {
    title: "Oak Project",
    category: "collaborative group project",
    text: "Built as a team of three developers, this project showcases collaborative web development skills and teamwork in delivering a complete application.",
    url: "https://oak-project-2.vercel.app",
    image: null,
  },
  {
    title: "TaskFlow",
    category: "full stack app",
    text: "Built a productivity dashboard with authentication, task management, and a clean responsive UI using React and a backend API.",
    url: null,
    image: null,
  },
  {
    title: "Portfolio Website",
    category: "frontend + branding",
    text: "Designed and developed a personal portfolio that showcases my work, projects, and technical journey with a modern frontend.",
    url: null,
    image: null,
  },
  {
    title: "API Starter",
    category: "backend development",
    text: "Created a reusable backend foundation with routes, data handling, and structured project architecture for future products.",
    url: null,
    image: null,
  },
];

const values = [
  "React",
  "TypeScript",
  "Node.js",
  "Express",
  "PostgreSQL",
  "MongoDB",
  "Tailwind CSS",
  "REST APIs",
  "Git & GitHub",
  "Problem solving",
];

const certifications = [
  "JavaScript Fundamentals",
  "Python Programming full course",
  "Frontend Development with React",
  "Backend Development with Node.js",
];

const timeline = [
  { period: "2026 — Present", role: "Full Stack Developer", company: "Self-taught / freelance projects" },
  { period: "2026", role: "Web Developer Journey", company: "Started learning frontend and backend skills" },
  { period: "This Year", role: "Building Projects", company: "Learning, coding, and shipping ideas" },
];

function Home() {
  return (
    <main className="page-shell">
      <section className="hero section">
        <div className="eyebrow">Full stack developer </div>
        <h1>
          I build practical digital products from the frontend to the backend.
        </h1>
        <p className="lead">
          I’m Keith Kapfunde, a full stack developer focused on building practical digital solutions that turn ideas into working products. I enjoy solving problems through technology, learning by building, and continuously improving the way I create.

        </p>

        <div className="cta-row">
          <a className="primary-btn" href="#projects">
            View projects
          </a>
          <a className="secondary-btn" href="#contact">
            Let&apos;s talk
          </a>
        </div>

        <div className="stats-grid">
          {stats.map((item) => (
            <div className="stat-card" key={item.label}>
              <strong>{item.value}</strong>
              <span>{item.label}</span>
            </div>
          ))}
        </div>
      </section>

      <section id="projects" className="section panel-section">
        <div className="section-heading">
          <span className="mini-label">Selected work</span>
          <h2>Projects I&apos;m building while growing my developer journey.</h2>
        </div>

        <div className="project-grid">
          {projectCards.map((project) => (
            <article 
              className="project-card" 
              key={project.title}
              onClick={() => project.url && window.open(project.url, '_blank')}
              style={project.url ? { cursor: 'pointer' } : { cursor: 'default' }}
            >
              <div className="project-visual" aria-hidden="true" style={project.image ? { backgroundImage: `url(${project.image})`, backgroundSize: 'cover', backgroundPosition: 'center' } : {}} />
              <div className="project-copy">
                <span>{project.category}</span>
                <h3>{project.title}</h3>
                <p>{project.text}</p>
                {project.url && (
                  <a 
                    href={project.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-block mt-4 px-3 py-1 text-xs font-semibold text-white bg-black rounded hover:brightness-90 transition"
                  >
                    Visit Project →
                  </a>
                )}
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="section split-section">
        <div>
          <span className="mini-label">About</span>
          <h2>Learning, building, and improving every day.</h2>
        </div>

        <div className="about-copy">
          <p>
            I started my developer journey this year and I&apos;m focused on becoming a strong full stack developer. I
            enjoy learning both the front end and back end because I like seeing ideas become real, working products.
          </p>
          <p>
            My work is driven by curiosity, consistency, and a desire to build clean, useful, and scalable digital
            experiences.
          </p>
        </div>
      </section>

      <section className="section services-section">
        <div className="section-heading narrow">
          <span className="mini-label">Stack</span>
          <h2>Tools and technologies I&apos;m learning and using.</h2>
        </div>

        <div className="chip-scroll-container">
          <div className="chip-scroll-track">
            {values.map((value) => (
              <span className="chip" key={`${value}-1`}>
                {value}
              </span>
            ))}
            {values.map((value) => (
              <span className="chip" key={`${value}-2`}>
                {value}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section id="certifications" className="section certification-section">
        <div className="section-heading narrow">
          <span className="mini-label">Learning path</span>
          <h2>Building a strong foundation through practice.</h2>
        </div>

        <ul className="cert-list">
          {certifications.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>

      <section className="section timeline-section">
        <div className="section-heading narrow">
          <span className="mini-label">Journey</span>
          <h2>My progress so far.</h2>
        </div>

        <div className="timeline-list">
          {timeline.map((item) => (
            <div className="timeline-item" key={`${item.period}-${item.role}`}>
              <span>{item.period}</span>
              <div>
                <h3>{item.role}</h3>
                <p>{item.company}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <footer id="contact" className="contact-banner">
        <div>
          <span className="mini-label">Let&apos;s build something meaningful</span>
          <h2>Open to new projects, opportunities, and collaborations.</h2>
        </div>

        <div className="contact-actions flex items-center gap-3">
          <a
            className="primary-btn"
            href="mailto:keithmutsawanaku@gmail.com"
            aria-label="Send email"
          >
            Email me
          </a>

          <a
            className="secondary-btn"
            href="tel:0778362164"
            aria-label="Call phone number"
          >
            Call: 0778362164
          </a>

          <a
            className="secondary-btn"
            href="https://wa.me/263778362164"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Chat on WhatsApp"
          >
            WhatsApp
          </a>
        </div>
      </footer>
    </main>
  );
}

function About() {
  return (
    <main className="page-shell inner-page">
      <section className="section">
        <span className="mini-label">About</span>
        <h1>Full stack developer building my path one project at a time.</h1>
        <p className="lead">
          I&apos;m Keith Kapfunde, a full stack developer focused on building practical digital solutions that turn ideas into working products. I enjoy solving problems through technology, learning by building, and continuously improving the way I create.
        </p>
      </section>
    </main>
  );
}

function Projects() {
  return (
    <main className="page-shell inner-page">
      <section className="section">
        <span className="mini-label">Projects</span>
        <h1>My work as I grow in full stack development.</h1>
        <div className="project-grid compact-grid">
          {projectCards.map((project) => (
            <article className="project-card" key={project.title}>
              <div className="project-visual" aria-hidden="true" />
              <div className="project-copy">
                <span>{project.category}</span>
                <h3>{project.title}</h3>
                <p>{project.text}</p>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}

function Certifications() {
  return (
    <main className="page-shell inner-page">
      <section className="section">
        <span className="mini-label">Learning path</span>
        <h1>Skills I&apos;m building as I move forward in tech.</h1>
        <ul className="cert-list large-list">
          {certifications.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>
    </main>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/certifications" element={<Certifications />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;