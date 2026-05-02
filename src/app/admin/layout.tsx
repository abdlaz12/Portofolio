import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { signOut } from "@/lib/auth";
import { LayoutDashboard, FolderKanban, Settings, LogOut } from "lucide-react";
import Link from "next/link";
import styles from "@/app/admin.module.css";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  return (
    <div className={styles.adminLayout}>
      {/* Sidebar */}
      <aside className={styles.sidebar}>
        <div className={styles.sidebarBrand}>
          <div className={styles.brandDot} />
          <span>Portfolio CMS</span>
        </div>

        <nav className={styles.sidebarNav}>
          <Link href="/admin" className={styles.navLink}>
            <LayoutDashboard size={18} />
            Dashboard
          </Link>
          <Link href="/admin/projects" className={styles.navLink}>
            <FolderKanban size={18} />
            Projects
          </Link>
          <Link href="/admin/settings" className={styles.navLink}>
            <Settings size={18} />
            Settings
          </Link>
        </nav>

        <div className={styles.sidebarFooter}>
          <div className={styles.userInfo}>
            <div className={styles.userAvatar}>
              {session?.user?.name?.charAt(0) ?? "A"}
            </div>
            <div className={styles.userDetails}>
              <span className={styles.userName}>{session?.user?.name}</span>
              <span className={styles.userEmail}>{session?.user?.email}</span>
            </div>
          </div>
          <form
            action={async () => {
              "use server";
              await signOut({ redirectTo: "/login" });
            }}
          >
            <button type="submit" className={styles.logoutBtn} title="Sign out">
              <LogOut size={16} />
            </button>
          </form>
        </div>
      </aside>

      {/* Main Content */}
      <main className={styles.adminMain}>{children}</main>
    </div>
  );
}
