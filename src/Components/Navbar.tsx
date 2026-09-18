import { Link } from "react-router-dom";
import { useEffect, useState } from "react";


const Navbar = () => {
    const [showNavbar, setShowNavbar] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        // Scrolling down
        setShowNavbar(false);
      } else {
        // Scrolling up
        setShowNavbar(true);
      }

      setLastScrollY(currentScrollY);
    };
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [lastScrollY]);

  return (
    <header
      className={`fixed top-0 left-0 z-50 w-full transition-transform duration-300 backdrop-blur-md bg-white/80 border-b border-black/10 ${
        showNavbar ? "translate-y-0" : "-translate-y-full"
      }`}
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5 lg:px-10">
        <Link to="/" className="text-2xl font-bold tracking-tight text-black">
          Keith<span className="text-gray-600">.</span>
        </Link>

        <div className="flex items-center gap-8">
          <Link to="/about" className="text-sm font-medium text-gray-700 transition hover:text-black hover:scale-110 hover:-rotate-12 origin-center duration-300">
            About
          </Link>

          <Link to="/projects" className="text-sm font-medium text-gray-700 transition hover:text-black hover:scale-110 hover:-rotate-12 origin-center duration-300">
            Projects
          </Link>

          <Link
            to="/certifications"
            className="text-sm font-medium text-gray-700 transition hover:text-black hover:scale-110 hover:-rotate-12 origin-center duration-300"
          >
            Certifications
          </Link>

          <div className="flex items-center gap-4">
            <a
              href="https://github.com/keithmutsawanaki"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-medium text-gray-700 transition hover:text-black hover:scale-110 hover:-rotate-12 origin-center duration-300"
            >
              GitHub
            </a>

            <a
              href="https://www.linkedin.com/in/keith-mutsawanaki-kapfunde-0a74243b1"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-medium text-gray-700 transition hover:text-black hover:scale-110 hover:-rotate-12 origin-center duration-300"
            >
              LinkedIn
            </a>

            <a
              href="mailto:keithmutsawanaku@gmail.com"
              className="text-sm font-medium text-gray-700 transition hover:text-black hover:scale-110 hover:-rotate-12 origin-center duration-300"
            >
              Email
            </a>

            <a
              href="/Keith_Kapfunde_CV.pdf"
              download
              aria-label="Download CV"
              className="rounded-md bg-gray-300 px-3 py-1 text-sm font-medium text-black hover:bg-gray-400 transition"
            >
              My CV
            </a>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
