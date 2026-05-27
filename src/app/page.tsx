import dbConnect from "@/lib/mongodb";
import Project from "@/models/Project";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CustomCursor from "@/components/CustomCursor";
import AnimatedProjectCard from "@/components/AnimatedProjectCard";
import styles from "./home.module.css";
import { ArrowRight, User } from "lucide-react";

interface ProjectData {
  _id: string;
  title: string;
  slug: string;
  category: string;
  excerpt: string;
  coverImage: string;
  techStack: string[];
  githubUrl?: string;
  liveUrl?: string;
}

async function getPublishedProjects(): Promise<ProjectData[]> {
  try {
    await dbConnect();
    const projects = await Project.find({ isPublished: true })
      .sort({ createdAt: -1 })
      .select("-contentHTML")
      .lean();
    return JSON.parse(JSON.stringify(projects));
  } catch {
    return [];
  }
}

export default async function HomePage() {
  const projects = await getPublishedProjects();
  const categories = ["All", ...Array.from(new Set(projects.map((p) => p.category)))];

  return (
    <>
      {/* Custom cursor — public interface only */}
      <CustomCursor />

      <Navbar />
      <main className={styles.main}>

        {/* ── Hero Section ── */}
        <section className={styles.hero} id="about">

          {/* LEFT COLUMN — Content */}
          <div className={styles.heroLeft}>

            {/* Status badge */}
            <div className={styles.heroBadge}>
              <span className={styles.badgeDot} />
              Available for opportunities
            </div>

            {/* Display headline */}
            <h1 className={styles.heroTitle}>
              <span className={styles.titleLine}>Full-Stack</span>
              <span className={styles.titleLine}>Developer</span>
              <span className={styles.titleLineAlt}>&amp; Designer</span>
            </h1>

            <p className={styles.heroSubtitle}>
              Crafting modern web applications with clean code, thoughtful design,
              and a relentless pursuit of perfection. Based in Indonesia.
            </p>

            <div className={styles.heroCtas}>
              <a href="#projects" className={styles.primaryCta}>
                View Projects
                <ArrowRight size={15} />
              </a>
              <a href="#contact" className={styles.secondaryCta}>
                Get In Touch
              </a>
            </div>

            {/* Stats */}
            <div className={styles.heroStats}>
              <div className={styles.stat}>
                <span className={styles.statNum}>{projects.length}+</span>
                <span className={styles.statLabel}>Projects</span>
              </div>
              <div className={styles.statDivider} />
              <div className={styles.stat}>
                <span className={styles.statNum}>3+</span>
                <span className={styles.statLabel}>Years Exp.</span>
              </div>
              <div className={styles.statDivider} />
              <div className={styles.stat}>
                <span className={styles.statNum}>10+</span>
                <span className={styles.statLabel}>Tech Stack</span>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN — Photo Placeholder */}
          <div className={styles.heroRight}>
            <div className={styles.photoFrame} id="profile-photo-frame">
              {/*
                ╔═════════════════════════════════════╗
                ║  PHOTO PLACEHOLDER                  ║
                ║  Replace <div> below with:          ║
                ║  <Image                             ║
                ║    src="/your-photo.jpg"            ║
                ║    alt="Your Name"                  ║
                ║    fill                             ║
                ║    style={{ objectFit: "cover" }}   ║
                ║    priority                         ║
                ║  />                                 ║
                ╚═════════════════════════════════════╝
              */}
              <div className={styles.photoPlaceholder}>
                <User size={48} />
                <span className={styles.photoLabel}>Your Photo Here</span>
              </div>
            </div>
          </div>

        </section>

        {/* ── Section Divider ── */}
        <div className={styles.sectionDivider} />

        {/* ── Projects Section ── */}
        <section className={styles.projectsSection} id="projects">
          <div className="container">

            {/* Section header */}
            <div className={styles.sectionHeader}>
              <div className={styles.sectionLeft}>
                <span className={styles.sectionTag}>Portfolio</span>
                <h2 className={styles.sectionTitle}>
                  Selected<br />Works
                </h2>
              </div>
              <p className={styles.sectionSub}>
                A curated selection of projects — from concept to deployment.
              </p>
            </div>

            {/* Category filter pills */}
            {categories.length > 1 && (
              <div className={styles.filterBar}>
                {categories.map((cat) => (
                  <span
                    key={cat}
                    className={`${styles.filterPill} ${cat === "All" ? styles.filterActive : ""}`}
                  >
                    {cat}
                  </span>
                ))}
              </div>
            )}

            {/* ── Animated Project Grid ── */}
            {projects.length === 0 ? (
              <div className={styles.emptyProjects}>
                <div className={styles.emptyIcon}>{ }</div>
                <h3>No projects published yet.</h3>
                <p>Check back soon — great things are coming!</p>
              </div>
            ) : (
              <div className={styles.projectGrid}>
                {projects.map((project, i) => (
                  <AnimatedProjectCard
                    key={project._id}
                    id={project._id}
                    title={project.title}
                    slug={project.slug}
                    category={project.category}
                    excerpt={project.excerpt}
                    coverImage={project.coverImage}
                    techStack={project.techStack}
                    githubUrl={project.githubUrl}
                    liveUrl={project.liveUrl}
                    index={i}
                    isFeatured={i === 0}
                  />
                ))}
              </div>
            )}
          </div>
        </section>

        {/* ── Section Divider ── */}
        <div className={styles.sectionDivider} />

        {/* ── Contact Section ── */}
        <section className={styles.contactSection} id="contact">
          <div className="container">
            <div className={styles.contactInner}>
              <span className={styles.contactOverline}>Let&apos;s Talk</span>
              <h2 className={styles.contactTitle}>
                Have a project<br />in mind?
              </h2>
              <div className={styles.contactRow}>
                <p className={styles.contactSub}>
                  I&apos;m always open to new opportunities and interesting challenges.
                  Drop me a message and let&apos;s build something great together.
                </p>
                <a
                  href="mailto:ajishartanto45@gmail.com"
                  className={styles.contactCta}
                  id="contact-email-btn"
                >
                  Send Me an Email
                  <ArrowRight size={16} />
                </a>
              </div>
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}
