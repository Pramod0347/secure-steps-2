"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { animate, motion, useInView, useMotionValue, AnimatePresence } from "framer-motion";
import { Phone, Compass, X, HelpCircle, GraduationCap, Scroll } from "lucide-react";
import { useAuth } from "@/app/context/AuthContext";

const PARTICLE_COUNT = 9;
const PARTICLES_CONFIG = Array.from({ length: PARTICLE_COUNT }, (_, i) => {
  const seed3 = Math.sin(i + 3) * 10000;
  const seed4 = Math.sin(i + 4) * 10000;

  const size = (seed3 - Math.floor(seed3)) * 6 + 10; // 10px to 16px
  const delay = (seed4 - Math.floor(seed4)) * 3; // Staggered initial starts

  const typeIndex = i % 3;
  const type = typeIndex === 0 ? "star" : typeIndex === 1 ? "cap" : ("scroll" as "star" | "cap" | "scroll");

  let color = "";
  let shadow = "";
  if (type === "star") {
    color = "rgb(251, 191, 36)"; // Gold
    shadow = "rgba(251, 191, 36, 0.9)";
  } else if (type === "cap") {
    color = "rgb(236, 72, 153)"; // Pink
    shadow = "rgba(236, 72, 153, 0.85)";
  } else {
    const isGoldScroll = i % 2 === 0;
    if (isGoldScroll) {
      color = "rgb(251, 191, 36)"; // Gold
      shadow = "rgba(251, 191, 36, 0.9)";
    } else {
      color = "rgb(236, 72, 153)"; // Pink
      shadow = "rgba(236, 72, 153, 0.85)";
    }
  }

  return { type, size, delay, color, shadow };
});

interface FloatingParticleProps {
  type: "star" | "cap" | "scroll";
  color: string;
  shadow: string;
  size: number;
  delay: number;
}

const FloatingParticle = ({ type, color, shadow, size, delay: initialDelay }: FloatingParticleProps) => {
  const [key, setKey] = useState(0);

  const { coords, duration, delay } = React.useMemo(() => {
    // Generate organic trajectory on each mount cycle
    const angle = Math.random() * Math.PI * 2;
    const distance = Math.random() * 45 + 25; // Shorter spread radius: 25px to 70px
    return {
      coords: {
        x: Math.cos(angle) * distance,
        y: Math.sin(angle) * distance
      },
      duration: Math.random() * 1.5 + 2.5, // 2.5s to 4.0s duration
      delay: key === 0 ? initialDelay : Math.random() * 0.4 // delay on first start, quick restart thereafter
    };
  }, [key, initialDelay]);

  return (
    <motion.span
      key={key}
      className="absolute pointer-events-none z-0"
      style={{
        width: size,
        height: size,
        left: "50%",
        top: "50%",
        marginLeft: -size / 2,
        marginTop: -size / 2,
        color: color,
      }}
      initial={{ x: 0, y: 0, opacity: 0, scale: 0, rotate: 0 }}
      animate={{
        x: coords.x,
        y: coords.y,
        opacity: [0, 0.95, 0], // Grow opacity then fade away completely
        scale: [0, 1.15, 0],    // Scale up then shrink to 0
        rotate: [0, 180, 360],
      }}
      transition={{
        duration: duration,
        delay: delay,
        ease: "easeOut",
      }}
      onAnimationComplete={() => setKey(k => k + 1)}
    >
      {type === "star" && (
        <svg
          viewBox="0 0 24 24"
          className="w-full h-full fill-amber-300 text-amber-200"
          style={{
            filter: `drop-shadow(0 0 ${size * 0.6}px ${shadow}) drop-shadow(0 0 ${size * 1.5}px ${shadow})`
          }}
        >
          <path d="M12 0L14.6 9.4L24 12L14.6 14.6L12 24L9.4 14.6L0 12L9.4 9.4Z" />
        </svg>
      )}
      {type === "cap" && (
        <GraduationCap
          size={size}
          className="w-full h-full fill-current"
          style={{
            filter: `drop-shadow(0 0 ${size * 0.6}px ${shadow}) drop-shadow(0 0 ${size * 1.5}px ${shadow})`
          }}
        />
      )}
      {type === "scroll" && (
        <Scroll
          size={size}
          className="w-full h-full fill-current"
          style={{
            filter: `drop-shadow(0 0 ${size * 0.6}px ${shadow}) drop-shadow(0 0 ${size * 1.5}px ${shadow})`
          }}
        />
      )}
    </motion.span>
  );
};
const PHRASES = [
  { text: "Too many options?", isGradient: false },
  { text: "Too much pressure?", isGradient: false },
  { text: "Secure Steps got you.", isGradient: true }
];


const HeroSection = () => {
  const [studentCount, setStudentCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const { isAuthenticated } = useAuth();
  const sectionRef = React.useRef<HTMLElement | null>(null);
  const canvasRef = React.useRef<HTMLCanvasElement | null>(null);
  const iframeRef = React.useRef<HTMLIFrameElement | null>(null);
  const hasAnimatedRef = React.useRef(false);
  const isInView = useInView(sectionRef, { amount: 0.35, once: true });
  const countMotionValue = useMotionValue(0);
  const [phraseIndex, setPhraseIndex] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setPhraseIndex((prev) => (prev + 1) % PHRASES.length);
    }, 2200);
    return () => clearTimeout(timer);
  }, [phraseIndex]);





  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    interface Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      alpha: number;
      decay: number;
      color: string;
      type: 'star' | 'circle';
      rot: number;
      rotSpeed: number;
    }

    let particles: Particle[] = [];
    let lastX: number | null = null;
    let lastY: number | null = null;
    const colors = [
      'rgba(236,72,153,',  // Pink
      'rgba(217,119,6,',   // Amber/Gold
      'rgba(255,255,255,', // White
      'rgba(244,63,94,'    // Rose
    ];

    const isMobile = window.innerWidth < 700;
    const MAX_PARTICLES = isMobile ? 40 : 80;

    const resize = () => {
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;
    };
    resize();
    window.addEventListener('resize', resize);

    const spawnParticles = (clientX: number, clientY: number) => {
      const rect = canvas.getBoundingClientRect();
      const x = clientX - rect.left;
      const y = clientY - rect.top;

      let count = 0;
      if (lastX === null || lastY === null) {
        count = 1;
      } else {
        const dx = x - lastX;
        const dy = y - lastY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist > 3) {
          count = Math.min(4, Math.floor(dist / 6) + 1);
        }
      }

      if (count === 0) return;

      lastX = x;
      lastY = y;

      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 0.7 + 0.2;

        particles.push({
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - 0.1,
          size: Math.random() * 5 + 2,
          alpha: 1.0,
          decay: Math.random() * 0.016 + 0.012,
          color: colors[Math.floor(Math.random() * colors.length)],
          type: Math.random() > 0.4 ? 'star' : 'circle',
          rot: Math.random() * Math.PI,
          rotSpeed: (Math.random() - 0.5) * 0.08
        });
      }

      if (particles.length > MAX_PARTICLES) {
        particles.splice(0, particles.length - MAX_PARTICLES);
      }
    };

    const container = sectionRef.current;
    const handlePointerMove = (e: PointerEvent) => {
      if (e.pointerType === 'touch' || window.innerWidth < 768) return;
      spawnParticles(e.clientX, e.clientY);
    };

    const handlePointerLeave = () => {
      lastX = null;
      lastY = null;
    };

    if (container) {
      container.addEventListener('pointermove', handlePointerMove);
      container.addEventListener('pointerleave', handlePointerLeave);
    }

    const handleMessage = (e: MessageEvent) => {
      if (window.innerWidth < 768) return;
      if (e.data && e.data.type === 'globe-pointermove') {
        const iframe = iframeRef.current;
        if (!iframe) return;

        const iframeRect = iframe.getBoundingClientRect();
        const pageX = iframeRect.left + e.data.clientX;
        const pageY = iframeRect.top + e.data.clientY;

        spawnParticles(pageX, pageY);
      }
    };
    window.addEventListener('message', handleMessage);

    function drawStar(ctx: CanvasRenderingContext2D, outerRadius: number, innerRadius: number, color: string, alpha: number) {
      const rInner = innerRadius * 0.7071;
      
      ctx.fillStyle = color + (alpha * 0.22) + ')';
      ctx.beginPath();
      ctx.moveTo(0, -outerRadius * 1.8);
      ctx.lineTo(rInner * 1.8, -rInner * 1.8);
      ctx.lineTo(outerRadius * 1.8, 0);
      ctx.lineTo(rInner * 1.8, rInner * 1.8);
      ctx.lineTo(0, outerRadius * 1.8);
      ctx.lineTo(-rInner * 1.8, rInner * 1.8);
      ctx.lineTo(-outerRadius * 1.8, 0);
      ctx.lineTo(-rInner * 1.8, -rInner * 1.8);
      ctx.closePath();
      ctx.fill();

      ctx.fillStyle = color + alpha + ')';
      ctx.beginPath();
      ctx.moveTo(0, -outerRadius);
      ctx.lineTo(rInner, -rInner);
      ctx.lineTo(outerRadius, 0);
      ctx.lineTo(rInner, rInner);
      ctx.lineTo(0, outerRadius);
      ctx.lineTo(-rInner, rInner);
      ctx.lineTo(-outerRadius, 0);
      ctx.lineTo(-rInner, -rInner);
      ctx.closePath();
      ctx.fill();
    }

    let animationFrameId: number;
    const loop = () => {
      animationFrameId = requestAnimationFrame(loop);
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vx *= 0.97;
        p.vy *= 0.97;
        p.alpha -= p.decay;
        p.size *= 0.985;
        p.rot += p.rotSpeed;

        if (p.alpha <= 0 || p.size < 0.5) {
          particles.splice(i, 1);
        }
      }

      ctx.lineWidth = 0.75;
      const maxDist = 75;
      const maxDistSq = maxDist * maxDist;

      for (let i = 0; i < particles.length; i++) {
        const p1 = particles[i];
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const distSq = dx * dx + dy * dy;

          if (distSq < maxDistSq) {
            const dist = Math.sqrt(distSq);
            const lineAlpha = Math.min(p1.alpha, p2.alpha) * (1 - dist / maxDist) * 0.45;
            if (lineAlpha > 0.01) {
              ctx.beginPath();
              ctx.moveTo(p1.x, p1.y);
              ctx.lineTo(p2.x, p2.y);
              ctx.strokeStyle = p1.color + lineAlpha + ')';
              ctx.stroke();
            }
          }
        }
      }

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        if (p.type === 'star') {
          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate(p.rot);
          drawStar(ctx, p.size, p.size * 0.25, p.color, p.alpha);
          ctx.restore();
        } else {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size * 1.2, 0, Math.PI * 2);
          ctx.fillStyle = p.color + (p.alpha * 0.25) + ')';
          ctx.fill();

          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size * 0.5, 0, Math.PI * 2);
          ctx.fillStyle = p.color + p.alpha + ')';
          ctx.fill();
        }
      }
    };
    loop();

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('message', handleMessage);
      cancelAnimationFrame(animationFrameId);
      if (container) {
        container.removeEventListener('pointermove', handlePointerMove);
        container.removeEventListener('pointerleave', handlePointerLeave);
      }
    };
  }, [sectionRef]);

  useEffect(() => {
    if (!isInView || hasAnimatedRef.current) {
      return;
    }

    hasAnimatedRef.current = true;
    const unsubscribe = countMotionValue.on("change", (latest) => {
      setStudentCount(Math.min(847, Math.floor(latest)));
    });

    const controls = animate(countMotionValue, 847, {
      duration: 2.8,
      ease: [0.12, 0.82, 0.2, 1],
      onComplete: () => {
        setStudentCount(847);
      },
    });

    return () => {
      unsubscribe();
      controls.stop();
    };
  }, [countMotionValue, isInView]);

  return (
    <section ref={sectionRef} className="relative min-h-[75vh] w-full overflow-hidden bg-pink-100 sm:min-h-[90vh]">
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none z-[5]"
      />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.98),_rgba(252,231,243,0.66)_34%,_rgba(249,168,212,0.46)_68%,_rgba(241,207,248,0.28)_100%)]" />
      <div className="absolute left-1/2 top-8 h-72 w-[28rem] -translate-x-1/2 rounded-full bg-white/55 blur-[120px] sm:h-96 sm:w-[34rem]" />
      <div className="absolute left-[8%] top-24 h-64 w-64 rounded-full bg-pink-200/35 blur-[120px]" />
      <div className="absolute right-[8%] top-20 h-72 w-72 rounded-full bg-rose-200/30 blur-[120px]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_42%,rgba(244,114,182,0.18)_0%,rgba(244,114,182,0.12)_18%,transparent_42%),radial-gradient(circle_at_80%_44%,rgba(147,197,253,0.22)_0%,rgba(196,181,253,0.12)_22%,transparent_46%),radial-gradient(circle_at_50%_42%,rgba(249,168,212,0.22)_0%,rgba(252,231,243,0.2)_26%,rgba(255,255,255,0.72)_58%,rgba(255,255,255,0.96)_100%)]" />

      {/* Adding pointer-events-none so click/drag pass through the title overlay text */}
      <div className="relative z-20 w-full px-4 sm:px-6 lg:px-8 pt-24 sm:pt-28 lg:pt-32 pointer-events-none">
        {/* Trust Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex justify-center mb-6"
        >
          <div className="inline-flex items-center gap-2 bg-white/50 backdrop-blur-sm border border-white/60 rounded-full px-5 py-2.5 shadow-sm">
            <span className="text-gray-800 text-sm font-medium">
              Counselled <span className="inline-block tabular-nums">{studentCount}+</span> Students
            </span>
          </div>
        </motion.div>

        {/* Main Heading */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-center"
        >
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-semibold leading-[1.15] tracking-tight px-2" style={{ fontFamily: "'Clash Display', sans-serif" }}>
            <span className="text-gray-900">Because the Right </span>
            <span className="relative inline-block">
              <span className="relative z-10 text-white italic hero-glow" style={{ fontFamily: "'Orpheus Pro', serif" }}>Education</span>
              {/* Floating sparkle particles */}
              {PARTICLES_CONFIG.map((particle, i) => (
                <FloatingParticle
                  key={i}
                  type={particle.type}
                  color={particle.color}
                  shadow={particle.shadow}
                  size={particle.size}
                  delay={particle.delay}
                />
              ))}
            </span>
            <span className="text-gray-900"> Matters.</span>
          </h1>
        </motion.div>

        {/* Subtitle - Desktop (Static) */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="hidden sm:block mt-6 text-base sm:text-lg text-gray-700 text-center max-w-2xl mx-auto leading-relaxed px-4"
        >
          Too many options. Too many opinions. Too much pressure.
          We simplify the noise and help you design a clear path that fits who you are and where you want to go.
        </motion.p>

        {/* Subtitle - Mobile (Animated Slideshow) */}
        <div className="block sm:hidden mt-6 min-h-[36px] flex items-center justify-center pointer-events-none">
          <AnimatePresence mode="wait">
            <motion.p
              key={phraseIndex}
              initial={{ opacity: 0, y: 10, filter: "blur(6px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -10, filter: "blur(6px)" }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="text-base text-center max-w-2xl mx-auto leading-relaxed px-4 font-medium"
            >
              {PHRASES[phraseIndex].isGradient ? (
                <span className="bg-gradient-to-r from-pink-500 via-rose-500 to-amber-500 bg-clip-text text-transparent font-bold text-lg hero-glow">
                  {PHRASES[phraseIndex].text}
                </span>
              ) : (
                <span className="text-gray-600">
                  {PHRASES[phraseIndex].text}
                </span>
              )}
            </motion.p>
          </AnimatePresence>
        </div>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4 pointer-events-auto"
        >
          <Link
            href="/quizform"
            className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-3.5 bg-gradient-to-r from-pink-500 via-rose-500 to-amber-500 text-white font-semibold rounded-full shadow-[0_4px_20px_rgba(236,72,153,0.3)] hover:shadow-[0_6px_24px_rgba(236,72,153,0.45)] transition-all duration-300 hover:scale-[1.03] text-base"
          >
            Consult Now
          </Link>
          <Link
            href="https://personalityassessmentv1.vercel.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-3.5 bg-white/80 hover:bg-white border border-pink-200 text-gray-800 font-semibold rounded-full shadow-[0_4px_15px_rgba(0,0,0,0.04)] hover:shadow-[0_6px_20px_rgba(236,72,153,0.1)] transition-all duration-300 hover:scale-[1.03] text-base"
          >
            Try Out Personality Test
          </Link>
        </motion.div>
      </div>

      {/* Interactive 3D Spinning Globe */}
      <div
        className="absolute bottom-[-50px] sm:bottom-[-200px] left-0 right-0 z-0 w-full h-[280px] sm:h-[720px] pointer-events-none sm:pointer-events-auto select-none opacity-70 sm:opacity-100"
      >
        <iframe
          ref={iframeRef}
          src="/spinning-globe.html"
          className="w-full h-full border-none pointer-events-none sm:pointer-events-auto"
          title="3D Globe"
        />
      </div>

      {/* Screen-Edge Cloud Overlays (Left/Right Sides of the Screen Viewport) */}
      <div className="absolute left-[-100px] bottom-[-100px] w-[350px] sm:w-[600px] h-[350px] sm:h-[600px] bg-gradient-to-tr from-white/95 via-pink-100/40 to-transparent rounded-full blur-[80px] sm:blur-[130px] z-10 pointer-events-none" />
      <div className="absolute right-[-100px] bottom-[-100px] w-[350px] sm:w-[600px] h-[350px] sm:h-[600px] bg-gradient-to-tl from-white/95 via-pink-100/40 to-transparent rounded-full blur-[80px] sm:blur-[130px] z-10 pointer-events-none" />

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-white via-white/80 to-transparent z-10 pointer-events-none" />

      {/* Backdrop blur overlay when FAB is open */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-black/10 backdrop-blur-[6px] z-40 pointer-events-auto"
          />
        )}
      </AnimatePresence>

      {/* Floating Action Button (FAB) */}
      <div className="fixed bottom-8 right-8 z-50 w-[71px] h-[71px]">
        {/* Main Floating Trigger */}
        <motion.button
          onClick={() => setIsOpen(!isOpen)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="absolute inset-0 z-50 flex items-center justify-center rounded-full bg-white/95 text-pink-500 shadow-[0_4px_25px_rgba(236,72,153,0.18)] border border-pink-100 hover:bg-pink-50/50 transition-colors duration-200"
        >
          <motion.div
            initial={false}
            animate={{ rotate: isOpen ? 90 : 0 }}
            transition={{ duration: 0.2 }}
            className="flex items-center justify-center"
          >
            {isOpen ? <X size={30} /> : <Compass size={30} />}
          </motion.div>
        </motion.button>

        {/* Floating Menu Items */}
        <AnimatePresence>
          {isOpen && (
            <>
              {/* Button 1: Know who you are (Flyout Left) */}
              <motion.div
                initial={{ opacity: 0, scale: 0, x: 0, y: 0 }}
                animate={{ opacity: 1, scale: 1, x: -160, y: 0 }}
                exit={{ opacity: 0, scale: 0, x: 0, y: 0 }}
                transition={{ type: "spring", stiffness: 450, damping: 28 }}
                className="absolute right-0 bottom-0 z-40"
              >
                <Link
                  href="https://personalityassessmentv1.vercel.app/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-violet-500 via-purple-500 to-fuchsia-500 text-white font-medium rounded-full shadow-lg shadow-purple-500/30 transition-all duration-200 hover:scale-105 whitespace-nowrap text-sm"
                >
                  <Compass size={14} />
                  Know who you are
                </Link>
              </motion.div>

              {/* Button 2: What's next after college? (Flyout Up-Left) */}
              <motion.div
                initial={{ opacity: 0, scale: 0, x: 0, y: 0 }}
                animate={{ opacity: 1, scale: 1, x: -120, y: -75 }}
                exit={{ opacity: 0, scale: 0, x: 0, y: 0 }}
                transition={{ type: "spring", stiffness: 450, damping: 28, delay: 0.03 }}
                className="absolute right-0 bottom-0 z-40"
              >
                <Link
                  href={isAuthenticated ? "/profile" : "/quizform"}
                  className="flex items-center gap-2 px-5 py-2.5 bg-pink-100 hover:bg-pink-200 text-pink-900 font-medium rounded-full border border-pink-200/40 shadow-lg transition-all duration-200 hover:scale-105 whitespace-nowrap text-sm"
                >
                  <HelpCircle size={14} />
                  What&apos;s next after college?
                </Link>
              </motion.div>

              {/* Button 3: Contact Us (Flyout Up) */}
              <motion.div
                initial={{ opacity: 0, scale: 0, x: 0, y: 0 }}
                animate={{ opacity: 1, scale: 1, x: 0, y: -125 }}
                exit={{ opacity: 0, scale: 0, x: 0, y: 0 }}
                transition={{ type: "spring", stiffness: 450, damping: 28, delay: 0.06 }}
                className="absolute right-0 bottom-0 z-40"
              >
                <Link
                  href="tel:+917093568336"
                  className="flex items-center gap-2 px-5 py-2.5 bg-white hover:bg-pink-50 text-pink-500 font-medium rounded-full border border-pink-200/30 shadow-lg transition-all duration-200 hover:scale-105 whitespace-nowrap text-sm"
                >
                  <Phone size={14} />
                  Contact Us
                </Link>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};

export default HeroSection;
