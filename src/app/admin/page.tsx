import { auth } from "@/lib/auth";
import { FolderKanban, Eye, Settings, PlusCircle } from "lucide-react";
import Link from "next/link";
import styles from "@/app/admin.module.css";

export default async function AdminDashboard() {
  const session = await auth();

  const stats = [
    { label: "Total Projects", value: "0", icon: FolderKanban, color: "#6366f1", bg: "rgba(99,102,241,0.1)" },
    { label: "Published", value: "0", icon: Eye, color: "#22c55e", bg: "rgba(34,197,94,0.1)" },
    { label: "Drafts", value: "0", icon: Settings, color: "#f59e0b", bg: "rgba(245,158,11,0.1)" },
  ];

  return (
    <div className={styles.dashboard}>
      {/* Header */}
      <div className={styles.dashHeader}>
        <div>
          <h1 className={styles.dashTitle}>Dashboard</h1>
          <p className={styles.dashSubtitle}>
            Welcome back, {session?.user?.name ?? "Admin"}!
          </p>
        </div>
        <Link href="/admin/projects/new" id="new-project-btn" className={styles.ctaBtn}>
          <PlusCircle size={16} />
          New Project
        </Link>
      </div>

      {/* Stats */}
      <div className={styles.statsGrid}>
        {stats.map((stat) => (
          <div key={stat.label} className={styles.statCard}>
            <div
              className={styles.statIcon}
              style={{ background: stat.bg, color: stat.color }}
            >
              <stat.icon size={20} />
            </div>
            <div className={styles.statInfo}>
              <span className={styles.statValue}>{stat.value}</span>
              <span className={styles.statLabel}>{stat.label}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Quick links */}
      <div>
        <h2 className={styles.sectionTitle}>Quick Actions</h2>
        <div className={styles.linksGrid}>
          <Link href="/admin/projects/new" className={styles.quickLinkCard}>
            <PlusCircle size={22} />
            <span>Add New Project</span>
          </Link>
          <Link href="/admin/projects" className={styles.quickLinkCard}>
            <FolderKanban size={22} />
            <span>Manage Projects</span>
          </Link>
          <Link href="/admin/settings" className={styles.quickLinkCard}>
            <Settings size={22} />
            <span>Theme Settings</span>
          </Link>
          <Link href="/" target="_blank" className={styles.quickLinkCard}>
            <Eye size={22} />
            <span>View Public Site</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
