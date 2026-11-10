import { useState } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import SpinWheel from './components/SpinWheel';
import Stats from './components/Stats';
import mathConcepts from './data/mathConcepts';
import './App.css';

function App() {
  const [history, setHistory] = useState([]);

  const handleSpinEnd = (concept) => {
    setHistory((prev) => [...prev, concept]);
  };

  return (
    <div className="app">
      <Header />
      <main className="main">
        <Hero />
        <section className="wheel-section">
          <SpinWheel segments={mathConcepts} onSpinEnd={handleSpinEnd} />
        </section>
        {history.length > 0 && <Stats history={history} />}
      </main>
      <footer className="footer">
        <span className="footer-text">
          MATHSPIN &mdash; Making math irresistible
        </span>
      </footer>
    </div>
  );
}

export default App;
