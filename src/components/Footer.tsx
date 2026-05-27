import Link from "next/link";
import styles from "./Footer.module.css";

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.footerInner}`}>
        <div className={styles.footerBrand}>
          <span className={styles.monogram}>AZ1</span>
        </div>
        <p className={styles.footerText}>
          Built with Next.js &amp; MongoDB.{" "}
          <Link href="/admin" className={styles.footerLink}>Admin</Link>
        </p>
        <p className={styles.copyright}>© {year} All rights reserved.</p>
      </div>
    </footer>
  );
}
