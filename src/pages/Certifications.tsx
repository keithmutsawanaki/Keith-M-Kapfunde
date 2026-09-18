import CourseraLogo from "../assets/coursera-logo.svg";

const Certifications = () => {
  return (
    <main className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Certifications</h1>

      <div className="grid gap-4">
        <a
          href="https://coursera.org/share/7938756534d5722fa1c5e14ac5955594"
          target="_blank"
          rel="noopener noreferrer"
          className="block"
          aria-label="Open Coursera certificate"
        >
          <article className="flex items-center gap-4 p-4 border rounded-lg hover:shadow transition">
            <img src={CourseraLogo} alt="Coursera logo" className="w-16 h-16 object-contain" />

            <div className="flex-1">
              <h2 className="text-lg font-semibold">Coursera Certificate</h2>
              <p className="text-sm text-gray-600">Full certificate available via Coursera share link.</p>
            </div>

            <div>
              <span className="inline-block bg-gray-300 text-black px-3 py-1 rounded-md">View Certificate</span>
            </div>
          </article>
        </a>
      </div>
    </main>
  );
};

export default Certifications;
