const About = () => {
  return (
    <main className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">About</h1>

      <div className="flex flex-col lg:flex-row items-start gap-6">
        <div className="w-40 h-40 rounded-full bg-gray-200 flex items-center justify-center text-3xl font-bold text-gray-600">
          KK
        </div>

        <div className="flex-1">
          <p className="text-lg mb-3">
            Hi — I’m Keith. I build clean, user-friendly web experiences using modern JavaScript
            and React. I enjoy turning ideas into polished interfaces and solving real problems with code.
          </p>

          <p className="text-gray-700 mb-4">
            I focus on readable, maintainable code and thoughtful UX. Outside of coding I enjoy learning
            new tools, reading about design, and contributing to projects that help people learn.
          </p>

          <div className="flex flex-wrap gap-2">
            <span className="bg-gray-100 text-gray-800 px-3 py-1 rounded">React</span>
            <span className="bg-gray-100 text-gray-800 px-3 py-1 rounded">TypeScript</span>
            <span className="bg-gray-100 text-gray-800 px-3 py-1 rounded">Tailwind</span>
            <span className="bg-gray-100 text-gray-800 px-3 py-1 rounded">Node</span>
          </div>
        </div>
      </div>
    </main>
  );
};

export default About;
