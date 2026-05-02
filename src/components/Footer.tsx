import Link from "next/link";
import styles from "./Footer.module.css";

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.footerInner}`}>
        <div className={styles.footerBrand}>
          <span className={styles.dot} />
          <span className={styles.brandName}>Portfolio</span>
        </div>
        <p className={styles.footerText}>
          Built with Next.js, MongoDB & TipTap.{" "}
          <Link href="/admin" className={styles.footerLink}>Admin</Link>
        </p>
        <p className={styles.copyright}>© {year} All rights reserved.</p>
      </div>
    </footer>
  );
}
