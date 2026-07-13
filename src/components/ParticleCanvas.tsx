import { useRef, useEffect } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  baseAlpha: number;
  pulseOffset: number;
}

const PARTICLE_COUNT = 80;
const CONNECTION_DISTANCE = 120;
const MAX_CONNECTIONS = 3;
const MOUSE_RADIUS = 150;

const COLORS = [
  '99, 102, 241',   // sapphire
  '20, 184, 166',   // teal
  '139, 92, 246',   // violet
];

export default function ParticleCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const mouseRef = useRef({ x: -1000, y: -1000, active: false });
  const rafRef = useRef<number>(0);
  const timeRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let W = window.innerWidth;
    let H = window.innerHeight;

    function resize() {
      W = window.innerWidth;
      H = window.innerHeight;
      canvas!.width = W;
      canvas!.height = H;
      initParticles();
    }

    function initParticles() {
      particlesRef.current = [];
      for (let i = 0; i < PARTICLE_COUNT; i++) {
        const color = COLORS[Math.floor(Math.random() * COLORS.length)];
        particlesRef.current.push({
          x: Math.random() * W,
          y: Math.random() * H,
          vx: (Math.random() - 0.5) * 0.6,
          vy: (Math.random() - 0.5) * 0.6,
          size: Math.random() * 1.5 + 1,
          color,
          baseAlpha: Math.random() * 0.4 + 0.3,
          pulseOffset: Math.random() * Math.PI * 2,
        });
      }
    }

    function updateParticles(_dt: number, time: number) {
      const mouse = mouseRef.current;

      particlesRef.current.forEach(p => {
        // Gentle drift
        p.x += p.vx;
        p.y += p.vy;

        // Mouse attraction
        if (mouse.active) {
          const dx = mouse.x - p.x;
          const dy = mouse.y - p.y;
          const dist = Math.hypot(dx, dy);
          if (dist < MOUSE_RADIUS && dist > 0) {
            const force = (1 - dist / MOUSE_RADIUS) * 0.02;
            p.vx += (dx / dist) * force;
            p.vy += (dy / dist) * force;
          }
        }

        // Dampen
        p.vx *= 0.98;
        p.vy *= 0.98;

        // Wrap around
        if (p.x < -50) p.x = W + 50;
        if (p.x > W + 50) p.x = -50;
        if (p.y < -50) p.y = H + 50;
        if (p.y > H + 50) p.y = -50;

        // Pulse
        const pulse = Math.sin(time * 1.5 + p.pulseOffset) * 0.5 + 0.5;
        const currentAlpha = p.baseAlpha * (0.5 + pulse * 0.5);

        // Draw
        const glowSize = p.size * 4;
        const grad = ctx!.createRadialGradient(p.x, p.y, 0, p.x, p.y, glowSize);
        grad.addColorStop(0, `rgba(${p.color}, ${currentAlpha * 0.6})`);
        grad.addColorStop(1, `rgba(${p.color}, 0)`);
        ctx!.fillStyle = grad;
        ctx!.beginPath();
        ctx!.arc(p.x, p.y, glowSize, 0, Math.PI * 2);
        ctx!.fill();

        ctx!.fillStyle = `rgba(${p.color}, ${currentAlpha * 1.5})`;
        ctx!.beginPath();
        ctx!.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx!.fill();
      });
    }

    function drawConnections() {
      const particles = particlesRef.current;
      for (let i = 0; i < particles.length; i++) {
        let connections = 0;
        for (let j = i + 1; j < particles.length; j++) {
          if (connections >= MAX_CONNECTIONS) break;
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.hypot(dx, dy);
          if (dist < CONNECTION_DISTANCE) {
            const alpha = (1 - dist / CONNECTION_DISTANCE) * 0.12;
            ctx!.strokeStyle = `rgba(99, 102, 241, ${alpha})`;
            ctx!.lineWidth = 0.5;
            ctx!.beginPath();
            ctx!.moveTo(particles[i].x, particles[i].y);
            ctx!.lineTo(particles[j].x, particles[j].y);
            ctx!.stroke();
            connections++;
          }
        }
      }
    }

    function drawVignette() {
      const grad = ctx!.createRadialGradient(W * 0.5, H * 0.5, H * 0.3, W * 0.5, H * 0.5, H * 0.9);
      grad.addColorStop(0, 'rgba(9, 9, 11, 0)');
      grad.addColorStop(1, 'rgba(9, 9, 11, 0.6)');
      ctx!.fillStyle = grad;
      ctx!.fillRect(0, 0, W, H);
    }

    let lastTime = 0;
    function animate(timestamp: number) {
      const dt = Math.min((timestamp - lastTime) / 1000, 0.05);
      lastTime = timestamp;
      timeRef.current += dt;

      ctx!.clearRect(0, 0, W, H);

      // Fill background
      ctx!.fillStyle = '#09090B';
      ctx!.fillRect(0, 0, W, H);

      updateParticles(dt, timeRef.current);
      drawConnections();
      drawVignette();

      rafRef.current = requestAnimationFrame(animate);
    }

    // Mouse tracking
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.x = e.clientX;
      mouseRef.current.y = e.clientY;
      mouseRef.current.active = true;
    };

    const handleMouseLeave = () => {
      mouseRef.current.active = false;
    };

    resize();
    rafRef.current = requestAnimationFrame(animate);

    window.addEventListener('resize', resize);
    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseleave', handleMouseLeave);

    // Use IntersectionObserver to pause when off-screen
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (!rafRef.current) {
            rafRef.current = requestAnimationFrame(animate);
          }
        } else {
          cancelAnimationFrame(rafRef.current);
          rafRef.current = 0;
        }
      },
      { threshold: 0.1 }
    );
    observer.observe(canvas);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener('resize', resize);
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mouseleave', handleMouseLeave);
      observer.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="particle-canvas"
      style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0 }}
    />
  );
}
