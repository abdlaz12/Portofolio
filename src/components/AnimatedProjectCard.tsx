"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Code2, Layers, Sparkles, ExternalLink } from "lucide-react";
import styles from "./AnimatedProjectCard.module.css";

const CATEGORY_ICONS: Record<string, typeof Code2> = {
  "Web Development": Code2,
  "Mobile App": Layers,
  "UI/UX Design": Sparkles,
  "Data Science": Layers,
  "Other": Code2,
};

interface ProjectCardProps {
  id: string;
  title: string;
  slug: string;
  category: string;
  excerpt: string;
  coverImage: string;
  techStack: string[];
  githubUrl?: string;
  liveUrl?: string;
  index: number;
  isFeatured?: boolean;
}

export default function AnimatedProjectCard({
  id,
  title,
  slug,
  category,
  excerpt,
  coverImage,
  techStack,
  githubUrl,
  liveUrl,
  index,
  isFeatured = false,
}: ProjectCardProps) {
  const cardRef = useRef<HTMLElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const [revealed, setRevealed] = useState(false);

  const Icon = CATEGORY_ICONS[category] ?? Code2;

  // ── Scroll Reveal ──
  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Stagger delay based on index
            const delay = (index % 3) * 120;
            setTimeout(() => setRevealed(true), delay);
            observer.disconnect();
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -60px 0px" }
    );

    observer.observe(card);
    return () => observer.disconnect();
  }, [index]);

  // ── 3D Tilt on Mouse Move ──
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLElement>) => {
    const card = cardRef.current;
    const inner = innerRef.current;
    const glow = glowRef.current;
    if (!card || !inner || !glow) return;

    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    // Tilt: max ±8deg
    const rotateX = ((y - centerY) / centerY) * -8;
    const rotateY = ((x - centerX) / centerX) * 8;

    inner.style.transform = `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;

    // Move glow to mouse position
    const glowX = (x / rect.width) * 100;
    const glowY = (y / rect.height) * 100;
    glow.style.background = `radial-gradient(200px circle at ${glowX}% ${glowY}%, rgba(255,255,255,0.06), transparent 70%)`;
  }, []);

  const handleMouseLeave = useCallback(() => {
    const inner = innerRef.current;
    const glow = glowRef.current;
    if (!inner || !glow) return;

    inner.style.transform = `perspective(900px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
    glow.style.background = "transparent";
  }, []);

  return (
    <article
      ref={cardRef}
      id={`project-card-${id}`}
      className={`
        ${styles.card}
        ${isFeatured ? styles.featured : ""}
        ${revealed ? styles.revealed : ""}
      `}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      data-cursor="hover"
    >
      {/* Tilt inner wrapper */}
      <div ref={innerRef} className={styles.cardInner}>

        {/* Glow overlay — follows mouse */}
        <div ref={glowRef} className={styles.glow} />

        {/* ── Cover Image ── */}
        <div className={styles.imageWrap}>
          {coverImage ? (
            <Image
              src={coverImage}
              alt={title}
              fill
              style={{ objectFit: "cover" }}
              className={styles.image}
            />
          ) : (
            <div className={styles.imagePlaceholder}>
              <Icon size={32} />
            </div>
          )}
          <div className={styles.imageOverlay} />

          {/* Category tag */}
          <span className={styles.categoryTag}>{category}</span>

          {/* Reveal shimmer line */}
          <div className={styles.shimmer} />
        </div>

        {/* ── Card Body ── */}
        <div className={styles.body}>
          {/* Index number */}
          <span className={styles.indexNum}>
            {String(index + 1).padStart(2, "0")}
          </span>

          <h3 className={styles.title}>{title}</h3>
          <p className={styles.excerpt}>{excerpt}</p>

          {/* Tech stack */}
          {techStack.length > 0 && (
            <div className={styles.techList}>
              {techStack.slice(0, 4).map((tech) => (
                <span key={tech} className={styles.techTag}>{tech}</span>
              ))}
              {techStack.length > 4 && (
                <span className={styles.techMore}>+{techStack.length - 4}</span>
              )}
            </div>
          )}

          {/* Links */}
          <div className={styles.links}>
            <Link href={`/projects/${slug}`} className={styles.readMore}>
              Case Study
              <ArrowRight size={13} />
            </Link>
            <div className={styles.iconLinks}>
              {githubUrl && (
                <a
                  href={githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.iconLink}
                  title="View on GitHub"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Code2 size={14} />
                </a>
              )}
              {liveUrl && (
                <a
                  href={liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.iconLink}
                  title="View Live"
                  onClick={(e) => e.stopPropagation()}
                >
                  <ExternalLink size={14} />
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Bottom progress bar — animates on reveal */}
        <div className={styles.progressBar}>
          <div className={styles.progressFill} />
        </div>
      </div>
    </article>
  );
}
