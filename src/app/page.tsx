import dbConnect from "@/lib/mongodb";
import Project from "@/models/Project";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import Image from "next/image";
import styles from "./home.module.css";
import { ArrowRight, Code2, Layers, Sparkles, ExternalLink } from "lucide-react";

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

const CATEGORY_ICONS: Record<string, typeof Code2> = {
  "Web Development": Code2,
  "Mobile App": Layers,
  "UI/UX Design": Sparkles,
  "Data Science": Layers,
  "Other": Code2,
};

export default async function HomePage() {
  const projects = await getPublishedProjects();

  // Get unique categories
  const categories = ["All", ...Array.from(new Set(projects.map((p) => p.category)))];

  return (
    <>
      <Navbar />
      <main className={styles.main}>
        {/* ── Hero Section ── */}
        <section className={styles.hero} id="about">
          {/* Animated background orbs */}
          <div className={styles.orb1} />
          <div className={styles.orb2} />
          <div className={styles.orb3} />

          {/* Grid overlay */}
          <div className={styles.grid} />

          <div className={`container ${styles.heroContent}`}>
            {/* Badge */}
            <div className={styles.heroBadge}>
              <span className={styles.badgeDot} />
              Available for opportunities
            </div>

            <h1 className={styles.heroTitle}>
              Building Digital
              <br />
              <span className="gradient-text">Experiences</span>
            </h1>

            <p className={styles.heroSubtitle}>
              Full-Stack Developer crafting modern web applications with clean code,
              thoughtful design, and a passion for solving real problems.
            </p>

            <div className={styles.heroCtas}>
              <a href="#projects" className={styles.primaryCta}>
                View Projects
                <ArrowRight size={16} />
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
        </section>

        {/* ── Projects Section ── */}
        <section className={styles.projectsSection} id="projects">
          <div className="container">
            {/* Section header */}
            <div className={styles.sectionHeader}>
              <span className={styles.sectionTag}>Portfolio</span>
              <h2 className={styles.sectionTitle}>Featured Projects</h2>
              <p className={styles.sectionSub}>
                A selection of my work — from concept to deployment.
              </p>
            </div>

            {/* Category filter pills (visual, no JS filtering needed for SSR) */}
            {categories.length > 1 && (
              <div className={styles.filterBar}>
                {categories.map((cat) => (
                  <span key={cat} className={`${styles.filterPill} ${cat === "All" ? styles.filterActive : ""}`}>
                    {cat}
                  </span>
                ))}
              </div>
            )}

            {/* Project Grid */}
            {projects.length === 0 ? (
              <div className={styles.emptyProjects}>
                <Code2 size={40} />
                <h3>No projects published yet.</h3>
                <p>Check back soon — great things are coming!</p>
              </div>
            ) : (
              <div className={styles.projectGrid}>
                {projects.map((project, i) => {
                  const Icon = CATEGORY_ICONS[project.category] ?? Code2;
                  return (
                    <article
                      key={project._id}
                      className={`${styles.projectCard} ${i === 0 ? styles.featured : ""}`}
                    >
                      {/* Cover Image */}
                      <div className={styles.cardImage}>
                        {project.coverImage ? (
                          <Image
                            src={project.coverImage}
                            alt={project.title}
                            fill
                            style={{ objectFit: "cover" }}
                          />
                        ) : (
                          <div className={styles.cardImagePlaceholder}>
                            <Icon size={36} />
                          </div>
                        )}
                        <div className={styles.cardOverlay} />
                        {/* Category badge on image */}
                        <span className={styles.cardCategory}>{project.category}</span>
                      </div>

                      {/* Card body */}
                      <div className={styles.cardBody}>
                        <h3 className={styles.cardTitle}>{project.title}</h3>
                        <p className={styles.cardExcerpt}>{project.excerpt}</p>

                        {/* Tech stack */}
                        {project.techStack.length > 0 && (
                          <div className={styles.techList}>
                            {project.techStack.slice(0, 4).map((tech) => (
                              <span key={tech} className={styles.techTag}>{tech}</span>
                            ))}
                            {project.techStack.length > 4 && (
                              <span className={styles.techMore}>
                                +{project.techStack.length - 4}
                              </span>
                            )}
                          </div>
                        )}

                        {/* Links */}
                        <div className={styles.cardLinks}>
                          <Link
                            href={`/projects/${project.slug}`}
                            className={styles.cardReadMore}
                          >
                            Read Case Study
                            <ArrowRight size={14} />
                          </Link>
                          <div className={styles.cardIconLinks}>
                            {project.githubUrl && (
                              <a
                                href={project.githubUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={styles.iconLink}
                                title="View on GitHub"
                              >
                                <Code2 size={16} />
                              </a>
                            )}
                            {project.liveUrl && (
                              <a
                                href={project.liveUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={styles.iconLink}
                                title="View Live"
                              >
                                <ExternalLink size={16} />
                              </a>
                            )}
                          </div>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </div>
        </section>

        {/* ── Contact Section ── */}
        <section className={styles.contactSection} id="contact">
          <div className="container">
            <div className={styles.contactCard}>
              <div className={styles.contactOrb} />
              <span className={styles.sectionTag}>Let&apos;s Talk</span>
              <h2 className={styles.contactTitle}>Have a project in mind?</h2>
              <p className={styles.contactSub}>
                I&apos;m always open to new opportunities and interesting challenges.
                Drop me a message and let&apos;s build something great.
              </p>
              <a
                href="mailto:hello@portfolio.com"
                className={styles.contactCta}
                id="contact-email-btn"
              >
                Send Me an Email
                <ArrowRight size={16} />
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
