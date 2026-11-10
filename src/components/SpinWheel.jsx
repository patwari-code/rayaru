import { useRef, useEffect, useState, useCallback } from 'react';
import confetti from 'canvas-confetti';
import './SpinWheel.css';

const SpinWheel = ({ segments, onSpinEnd }) => {
  const canvasRef = useRef(null);
  const [rotation, setRotation] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const [winner, setWinner] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const animationRef = useRef(null);
  const currentRotationRef = useRef(0);

  const segCount = segments.length;
  const segAngle = (2 * Math.PI) / segCount;

  const drawWheel = useCallback((ctx, width, height, rot) => {
    const cx = width / 2;
    const cy = height / 2;
    const radius = Math.min(cx, cy) - 20;

    ctx.clearRect(0, 0, width, height);

    // Outer glow ring
    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, radius + 8, 0, 2 * Math.PI);
    ctx.strokeStyle = spinning
      ? 'rgba(0, 240, 255, 0.6)'
      : 'rgba(0, 240, 255, 0.25)';
    ctx.lineWidth = 2;
    ctx.shadowColor = 'rgba(0, 240, 255, 0.5)';
    ctx.shadowBlur = spinning ? 25 : 12;
    ctx.stroke();
    ctx.restore();

    // Second glow ring
    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, radius + 14, 0, 2 * Math.PI);
    ctx.strokeStyle = spinning
      ? 'rgba(168, 85, 247, 0.4)'
      : 'rgba(168, 85, 247, 0.15)';
    ctx.lineWidth = 1;
    ctx.shadowColor = 'rgba(168, 85, 247, 0.4)';
    ctx.shadowBlur = spinning ? 20 : 8;
    ctx.stroke();
    ctx.restore();

    // Draw segments
    segments.forEach((seg, i) => {
      const startAngle = rot + i * segAngle;
      const endAngle = startAngle + segAngle;

      // Segment fill
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.arc(cx, cy, radius, startAngle, endAngle);
      ctx.closePath();

      const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, radius);
      const baseColor = seg.color || '#00f0ff';
      grad.addColorStop(0, 'rgba(20, 20, 35, 0.97)');
      grad.addColorStop(0.4, hexToRgba(baseColor, 0.12));
      grad.addColorStop(0.75, hexToRgba(baseColor, 0.22));
      grad.addColorStop(1, hexToRgba(baseColor, 0.35));
      ctx.fillStyle = grad;
      ctx.fill();

      // Segment border
      ctx.strokeStyle = hexToRgba(baseColor, 0.3);
      ctx.lineWidth = 1;
      ctx.stroke();
      ctx.restore();

      // Text
      ctx.save();
      const textAngle = startAngle + segAngle / 2;
      const textRadius = radius * 0.65;
      ctx.translate(
        cx + Math.cos(textAngle) * textRadius,
        cy + Math.sin(textAngle) * textRadius
      );
      ctx.rotate(textAngle + Math.PI / 2);

      const fontSize = radius < 200 ? 11 : 14;
      ctx.font = `700 ${fontSize}px 'Space Grotesk', sans-serif`;
      ctx.fillStyle = '#ffffff';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.shadowColor = baseColor;
      ctx.shadowBlur = 10;

      // Word wrap
      const words = seg.title.split(' ');
      const lines = [];
      let line = '';
      words.forEach(word => {
        const test = line + (line ? ' ' : '') + word;
        if (test.length > 10 && line) {
          lines.push(line);
          line = word;
        } else {
          line = test;
        }
      });
      lines.push(line);

      const lineHeight = fontSize + 4;
      const startY = -((lines.length - 1) * lineHeight) / 2;
      lines.forEach((l, li) => {
        // Draw text outline/stroke for readability
        ctx.strokeStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.lineWidth = 3;
        ctx.strokeText(l, 0, startY + li * lineHeight);
        ctx.fillText(l, 0, startY + li * lineHeight);
      });

      ctx.restore();
    });

    // Center circle
    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, radius * 0.15, 0, 2 * Math.PI);
    const centerGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, radius * 0.15);
    centerGrad.addColorStop(0, '#1a1a2e');
    centerGrad.addColorStop(1, '#0a0a14');
    ctx.fillStyle = centerGrad;
    ctx.fill();
    ctx.strokeStyle = 'rgba(0, 240, 255, 0.4)';
    ctx.lineWidth = 2;
    ctx.shadowColor = 'rgba(0, 240, 255, 0.5)';
    ctx.shadowBlur = 15;
    ctx.stroke();
    ctx.restore();

    // Center text
    ctx.save();
    ctx.font = `700 ${radius < 200 ? '8px' : '10px'} 'Orbitron', sans-serif`;
    ctx.fillStyle = 'rgba(0, 240, 255, 0.8)';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('SPIN', cx, cy);
    ctx.restore();
  }, [segments, segAngle, spinning]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    const ctx = canvas.getContext('2d');
    ctx.scale(dpr, dpr);

    drawWheel(ctx, rect.width, rect.height, rotation);
  }, [rotation, drawWheel]);

  // Resize handler
  useEffect(() => {
    const handleResize = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      const ctx = canvas.getContext('2d');
      ctx.scale(dpr, dpr);
      drawWheel(ctx, rect.width, rect.height, currentRotationRef.current);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [drawWheel]);

  const spin = () => {
    if (spinning) return;

    setSpinning(true);
    setShowResult(false);
    setWinner(null);

    const spinDuration = 4000 + Math.random() * 2000;
    const totalRotation = (8 + Math.random() * 6) * 2 * Math.PI;
    const startRotation = currentRotationRef.current;
    const startTime = performance.now();

    const easeOutQuart = (t) => 1 - Math.pow(1 - t, 4);

    const animate = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / spinDuration, 1);
      const easedProgress = easeOutQuart(progress);

      const currentRot = startRotation + totalRotation * easedProgress;
      currentRotationRef.current = currentRot;
      setRotation(currentRot);

      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate);
      } else {
        setSpinning(false);

        // Determine winner - the pointer is at the top (270 degrees / -PI/2)
        const normalizedRotation = ((currentRot % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI);
        const pointerAngle = (2 * Math.PI - normalizedRotation + 3 * Math.PI / 2) % (2 * Math.PI);
        const winnerIndex = Math.floor(pointerAngle / segAngle) % segCount;
        const selected = segments[winnerIndex];

        setWinner(selected);

        // Confetti burst
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.5, x: 0.5 },
          colors: [selected.color, '#00f0ff', '#a855f7', '#ffffff'],
          disableForReducedMotion: true,
        });

        setTimeout(() => {
          setShowResult(true);
          speakConcept(selected);
          if (onSpinEnd) onSpinEnd(selected);
        }, 300);
      }
    };

    animationRef.current = requestAnimationFrame(animate);
  };

  const getBestVoice = useCallback(() => {
    const voices = window.speechSynthesis.getVoices();
    // Prefer premium / natural-sounding voices on macOS & Chrome
    const preferredNames = [
      'Zoe (Premium',      // macOS premium
      'Samantha (Enhanced', // macOS enhanced
      'Karen (Premium',     // macOS premium AU
      'Daniel (Premium',    // macOS premium UK
      'Google UK English Female',
      'Google US English',
      'Samantha',
      'Karen',
      'Daniel',
      'Moira',
      'Tessa',
    ];
    for (const name of preferredNames) {
      const match = voices.find((v) => v.name.includes(name) && v.lang.startsWith('en'));
      if (match) return match;
    }
    // Fallback: any English voice that has "enhanced" or "premium" in name
    const enhanced = voices.find(
      (v) => v.lang.startsWith('en') && (/premium|enhanced|natural/i.test(v.name))
    );
    if (enhanced) return enhanced;
    // Last fallback: any English voice
    return voices.find((v) => v.lang.startsWith('en')) || null;
  }, []);

  const speakConcept = (concept) => {
    window.speechSynthesis.cancel();

    // Speak the title first with emphasis
    const titleUtterance = new SpeechSynthesisUtterance(concept.title);
    titleUtterance.rate = 0.85;
    titleUtterance.pitch = 1.15;
    titleUtterance.volume = 1;
    const voice = getBestVoice();
    if (voice) titleUtterance.voice = voice;

    // Then speak description at a conversational pace
    const descUtterance = new SpeechSynthesisUtterance(concept.description);
    descUtterance.rate = 0.95;
    descUtterance.pitch = 1.05;
    descUtterance.volume = 1;
    if (voice) descUtterance.voice = voice;

    window.speechSynthesis.speak(titleUtterance);
    window.speechSynthesis.speak(descUtterance);
  };

  // Load voices (some browsers load them async)
  useEffect(() => {
    window.speechSynthesis.getVoices();
    const handler = () => window.speechSynthesis.getVoices();
    window.speechSynthesis.onvoiceschanged = handler;
    return () => { window.speechSynthesis.onvoiceschanged = null; };
  }, []);

  return (
    <div className="wheel-container">
      {/* Pointer */}
      <div className="wheel-pointer">
        <svg width="32" height="40" viewBox="0 0 32 40" fill="none">
          <path
            d="M16 40L2 8C0.5 4.5 3 0 7 0H25C29 0 31.5 4.5 30 8L16 40Z"
            fill="url(#pointerGrad)"
            stroke="rgba(0,240,255,0.6)"
            strokeWidth="1.5"
          />
          <defs>
            <linearGradient id="pointerGrad" x1="16" y1="0" x2="16" y2="40">
              <stop stopColor="#00f0ff" />
              <stop offset="1" stopColor="#a855f7" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      <canvas
        ref={canvasRef}
        className={`wheel-canvas ${spinning ? 'spinning' : ''}`}
        onClick={spin}
      />

      <button
        className={`spin-button ${spinning ? 'disabled' : ''}`}
        onClick={spin}
        disabled={spinning}
      >
        <span className="spin-button-text">
          {spinning ? 'SPINNING...' : 'SPIN THE WHEEL'}
        </span>
        <span className="spin-button-glow" />
      </button>

      {/* Result Card */}
      {winner && showResult && (
        <div className="result-card" style={{ '--accent': winner.color }}>
          <div className="result-card-inner">
            <div className="result-badge">Grade {winner.grade}</div>
            <h2 className="result-title">{winner.title}</h2>
            <p className="result-formula">{winner.formula}</p>
            <p className="result-description">{winner.description}</p>
            <button
              className="result-replay"
              onClick={() => speakConcept(winner)}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
                <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
              </svg>
              Listen Again
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

function hexToRgba(hex, alpha) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export default SpinWheel;
