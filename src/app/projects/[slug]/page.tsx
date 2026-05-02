import dbConnect from "@/lib/mongodb";
import Project from "@/models/Project";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Code2, ExternalLink, ArrowLeft, Calendar, Tag } from "lucide-react";
import styles from "./project.module.css";

interface PageProps {
  params: Promise<{ slug: string }>;
}

async function getProject(slug: string) {
  try {
    await dbConnect();
    const project = await Project.findOne({ slug, isPublished: true }).lean();
    if (!project) return null;
    return JSON.parse(JSON.stringify(project));
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProject(slug);
  if (!project) return { title: "Project Not Found" };
  return {
    title: project.title,
    description: project.excerpt,
    openGraph: {
      title: project.title,
      description: project.excerpt,
      images: project.coverImage ? [project.coverImage] : [],
    },
  };
}

export default async function ProjectDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const project = await getProject(slug);

  if (!project) notFound();

  return (
    <>
      <Navbar />
      <main className={styles.main}>
        {/* Background */}
        <div className={styles.heroBg}>
          {project.coverImage && (
            <Image
              src={project.coverImage}
              alt={project.title}
              fill
              style={{ objectFit: "cover" }}
              className={styles.heroImg}
              priority
            />
          )}
          <div className={styles.heroOverlay} />
        </div>

        <div className="container">
          {/* Back link */}
          <div className={styles.backRow}>
            <Link href="/#projects" className={styles.backLink}>
              <ArrowLeft size={16} />
              Back to Projects
            </Link>
          </div>

          {/* Article */}
          <article className={styles.article}>
            {/* Header */}
            <header className={styles.articleHeader}>
              <span className={styles.categoryTag}>{project.category}</span>
              <h1 className={styles.articleTitle}>{project.title}</h1>
              <p className={styles.articleExcerpt}>{project.excerpt}</p>

              {/* Meta */}
              <div className={styles.articleMeta}>
                <span className={styles.metaItem}>
                  <Calendar size={14} />
                  {new Date(project.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
                {project.category && (
                  <span className={styles.metaItem}>
                    <Tag size={14} />
                    {project.category}
                  </span>
                )}
              </div>

              {/* Tech stack */}
              {project.techStack?.length > 0 && (
                <div className={styles.techStack}>
                  {project.techStack.map((tech: string) => (
                    <span key={tech} className={styles.techBadge}>
                      {tech}
                    </span>
                  ))}
                </div>
              )}

              {/* Action links */}
              <div className={styles.actionLinks}>
                {project.githubUrl && (
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.actionBtn}
                  >
                    <Code2 size={16} />
                    View on GitHub
                  </a>
                )}
                {project.liveUrl && (
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`${styles.actionBtn} ${styles.actionBtnPrimary}`}
                  >
                    <ExternalLink size={16} />
                    Live Demo
                  </a>
                )}
              </div>
            </header>

            {/* Divider */}
            <hr className={styles.divider} />

            {/* Rich text content */}
            <div
              className={`prose ${styles.content}`}
              dangerouslySetInnerHTML={{ __html: project.contentHTML }}
            />
          </article>
        </div>
      </main>
      <Footer />
    </>
  );
}
