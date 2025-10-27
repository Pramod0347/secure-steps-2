'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

const ScrollAnimation = () => {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      gsap.registerPlugin(ScrollTrigger);
    }

    const section = sectionRef.current;
    if (!section) return;

    // Get panels and texts using the section ref
    const panels = gsap.utils.toArray(section.querySelectorAll('.panel:not(.purple)')) as HTMLElement[];
    const texts = gsap.utils.toArray(section.querySelectorAll('.panel-text')) as HTMLElement[];

    // Set initial z-index
    gsap.set(section.querySelectorAll(".panel"), { 
      zIndex: (i, _, targets) => targets.length - i 
    });
    
    gsap.set(section.querySelectorAll(".panel-text"), { 
      zIndex: (i, _, targets) => targets.length - i 
    });

    // Panel animations
    panels.forEach((panel, i) => {
      gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: () => "top -" + (window.innerHeight * (i + 0.5)),
          end: () => "+=" + window.innerHeight,
          scrub: true,
          toggleActions: "play none reverse none",
          invalidateOnRefresh: true,
        }
      }).to(panel, { height: 0 });
    });

    // Text animations
    texts.forEach((text, i) => {
      gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: () => "top -" + (window.innerHeight * i),
          end: () => "+=" + window.innerHeight,
          scrub: true,
          toggleActions: "play none reverse none",
          invalidateOnRefresh: true,
        }
      })
      .to(text, { duration: 0.33, opacity: 1, y: "50%" })
      .to(text, { duration: 0.33, opacity: 0, y: "0%" }, 0.66);
    });

    // Main scroll trigger
    ScrollTrigger.create({
      trigger: section,
      scrub: true,
      markers: true,
      pin: true,
      start: "top top",
      end: () => "+=" + ((panels.length + 1) * window.innerHeight),
      invalidateOnRefresh: true,
    });

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  return (
    <main className="min-h-screen">
      <div ref={sectionRef} className="flex h-screen items-center justify-around">
        <div className="relative h-[80vh] w-[450px] overflow-hidden">
          <div className="panel-text blue-text absolute inset-0 z-[1] h-full w-full text-center text-4xl font-black uppercase text-blue-600 opacity-0 translate-y-full">Blue</div>
          <div className="panel-text red-text absolute inset-0 z-[1] h-full w-full text-center text-4xl font-black uppercase text-red-600 opacity-0 translate-y-full">Red</div>
          <div className="panel-text orange-text absolute inset-0 z-[1] h-full w-full text-center text-4xl font-black uppercase text-orange-500 opacity-0 translate-y-full">Orange</div>
          <div className="panel-text purple-text absolute inset-0 z-[1] h-full w-full text-center text-4xl font-black uppercase text-purple-600 opacity-0 translate-y-full">Purple</div>
        </div>
        
        <div className="relative h-[80vh] w-[450px] overflow-hidden">
          <div className="panel blue absolute inset-0 z-[1] h-full w-full bg-cover bg-center bg-no-repeat" style={{ backgroundImage: "url('/images/5ed12171d9d512cb2feead83_5.jpg')" }}></div>
          <div className="panel red absolute inset-0 z-[1] h-full w-full bg-red-600"></div>
          <div className="panel orange absolute inset-0 z-[1] h-full w-full bg-[#cf5d00]"></div>
          <div className="panel purple absolute inset-0 z-[1] h-full w-full bg-[#808]"></div>
        </div>
      </div>
    </main>
  );
};

export default ScrollAnimation;