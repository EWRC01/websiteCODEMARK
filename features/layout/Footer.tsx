"use client";
import { useEffect, useRef } from "react";
import Link from "next/link";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLanguage } from "@/features/i18n/LanguageProvider";
import { socialLinks } from "./socialLinks";

gsap.registerPlugin(ScrollTrigger);

export default function Footer() {
  const footerRef = useRef<HTMLElement>(null);
  const particlesRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const { t } = useLanguage();
  const text = t.footer;
  const currentYear = new Date().getFullYear();

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Animate vertical entrance without changing opacity.
      gsap.from(footerRef.current, {
        y: 50,
        duration: 1,
        scrollTrigger: {
          trigger: footerRef.current,
          start: "top bottom",
        },
      });
    }, footerRef);

    return () => ctx.revert();
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!footerRef.current) return;
      const rect = footerRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      if (glowRef.current) {
        gsap.to(glowRef.current, {
          x: x,
          y: y,
          duration: 0.8,
          ease: "power2.out",
        });
      }
    };

    const footer = footerRef.current;
    footer?.addEventListener("mousemove", handleMouseMove);
    return () => footer?.removeEventListener("mousemove", handleMouseMove);
  }, []);

  useEffect(() => {
    // SSR/Next.js safe
    if (typeof window === "undefined" || !particlesRef.current) return;

    // Clear old particles before adding new ones
    particlesRef.current.innerHTML = "";

    const particles = Array.from({ length: 30 }).map(() => {
      const particle = document.createElement("div");
      particle.className = "absolute w-1 h-1 bg-primary/20 rounded-full";
      return particle;
    });

    particles.forEach((particle) => {
      particlesRef.current?.appendChild(particle);
      gsap.set(particle, {
        x: Math.random() * window.innerWidth,
        y: Math.random() * 500,
        scale: Math.random() * 0.5 + 0.5,
      });
      animateParticle(particle);
    });

    function animateParticle(particle: HTMLElement) {
      gsap.to(particle, {
        y: "+=100",
        x: "+=50",
        duration: Math.random() * 2 + 2,
        repeat: -1,
        ease: "none",
        yoyo: true,
      });
    }

    // Cleanup
    return () => {
      if (particlesRef.current) {
        particlesRef.current.innerHTML = "";
      }
    };
  }, []);

  return (
    <footer
      ref={footerRef}
      className="relative bg-card text-card-foreground py-8 px-6 overflow-hidden isolation-isolate"
    >
      {/* Animated particles */}
      <div
        ref={particlesRef}
        className="absolute inset-0 pointer-events-none z-10"
      ></div>

      {/* Glow effect */}
      <div
        ref={glowRef}
        className="absolute w-[200px] h-[200px] bg-radial-gradient from-primary/10 to-transparent rounded-full pointer-events-none z-0 -translate-x-1/2 -translate-y-1/2"
      ></div>

      <div className="relative max-w-6xl mx-auto z-20">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-col gap-2 flex-1 text-center md:text-left">
            <h2 className="text-2xl font-bold text-primary">CodeMark</h2>
            <p className="text-muted-foreground">{text.tagline}</p>
          </div>

          <div className="social-links flex gap-4 justify-center md:justify-end flex-1 order-2 md:order-3">
            {socialLinks.map(({ Icon, href, label }) => (
              <Link
                key={label}
                href={href}
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border/70 bg-background/40 text-foreground transition-colors duration-300 hover:border-primary hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60"
                aria-label={label}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Icon className="h-5 w-5" />
              </Link>
            ))}
          </div>

          <div className="text-muted-foreground text-sm text-center flex-1 order-3 md:order-2">
            <p>
              {text.rights} &copy; {currentYear} CodeMark
            </p>
          </div>
        </div>
      </div>

      {/* Global radial gradient for the glow */}
      <style jsx global>{`
        .bg-radial-gradient {
          background: radial-gradient(
            circle,
            var(--tw-gradient-from) 0%,
            var(--tw-gradient-to) 70%
          );
        }
      `}</style>
    </footer>
  );
}
