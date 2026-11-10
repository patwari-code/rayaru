import { useState, useEffect } from 'react';
import './Stats.css';

const Stats = ({ history }) => {
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    if (history.length > 0) {
      setAnimate(true);
      const t = setTimeout(() => setAnimate(false), 500);
      return () => clearTimeout(t);
    }
  }, [history.length]);

  const grade11 = history.filter((h) => h.grade === 11).length;
  const grade12 = history.filter((h) => h.grade === 12).length;
  const unique = new Set(history.map((h) => h.id)).size;

  return (
    <section className="stats-section">
      <div className="stats-grid">
        <div className={`stat-card ${animate ? 'pulse' : ''}`}>
          <span className="stat-value">{history.length}</span>
          <span className="stat-label">TOTAL SPINS</span>
        </div>
        <div className={`stat-card ${animate ? 'pulse' : ''}`}>
          <span className="stat-value">{unique}</span>
          <span className="stat-label">UNIQUE CONCEPTS</span>
        </div>
        <div className={`stat-card ${animate ? 'pulse' : ''}`}>
          <span className="stat-value">{grade11}</span>
          <span className="stat-label">GRADE 11</span>
        </div>
        <div className={`stat-card ${animate ? 'pulse' : ''}`}>
          <span className="stat-value">{grade12}</span>
          <span className="stat-label">GRADE 12</span>
        </div>
      </div>
    </section>
  );
};

export default Stats;
