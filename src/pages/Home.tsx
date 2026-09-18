const Home = () => {
  return (
    <main style={{ padding: "2rem" }}>
      <h1>Home</h1>
      <p>Welcome to the portfolio homepage.</p>

      <div style={{ marginTop: 16, display: "flex", gap: 12 }}>
        <a href="https://github.com/keithmutsawanaki" target="_blank" rel="noopener noreferrer">GitHub</a>
        <a href="https://www.linkedin.com/in/keith-mutsawanaki-kapfunde-0a74243b1" target="_blank" rel="noopener noreferrer">LinkedIn</a>
        <a href="mailto:keithmutsawanaku@gmail.com">Email</a>
        <a href="/Keith_Kapfunde_CV.pdf" download style={{ padding: "6px 10px", background: "#d1d5db", color: "#000", borderRadius: 6 }}>
          My CV
        </a>
      </div>
    </main>
  );
};

export default Home;
