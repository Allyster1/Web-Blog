import styles from "./Footer.module.css";
import ContainerLayout from "../../layouts/ContainerLayout";
import HeaderLogo from "../ui/HeaderLogo";
import { Link } from "react-router";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import { useAuth } from "../../hooks/useAuth";

export default function Footer() {
  const { isAuthenticated } = useAuth();

  return (
    <footer className={styles.footer}>
      <ContainerLayout className="py-12 md:py-16">
        <div className={styles.footerContent}>
          {/* Logo & Brand Section */}
          <div className={styles.footerSection}>
            <HeaderLogo />
            <div className={styles.contactInfo}>
              <p>Sofia, Bulgaria</p>
              <a href="mailto:myemail" className={styles.contactLink}>
                ovardovslav@gmail.com
              </a>
            </div>
          </div>

          {/* Quick Links Section */}
          <div className={styles.footerSection}>
            <h3 className={styles.sectionTitle}>Quick Links</h3>
            <nav className={styles.navLinks}>
              <Link to="/" className={styles.link}>
                Home
              </Link>
              {isAuthenticated && (
                <Link to="/blog/write" className={styles.link}>
                  Write
                </Link>
              )}
            </nav>
          </div>

          {/* Connect Section */}
          <div className={styles.footerSection}>
            <h3 className={styles.sectionTitle}>Social Links</h3>
            <div className={styles.socialLinks}>
              <a
                href="https://github.com/Allyster1"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.socialLink}
                aria-label="GitHub"
              >
                <FaGithub />
              </a>
              <a
                href="https://www.linkedin.com/in/slavi-ovardov/"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.socialLink}
                aria-label="LinkedIn"
              >
                <FaLinkedin />
              </a>
            </div>
            <p className={styles.socialText}>
              Follow us for updates and insights
            </p>
          </div>
        </div>
      </ContainerLayout>

      {/* Bottom Copyright Section */}
      <div className={styles.copyrightSection}>
        <ContainerLayout className="py-4">
          <p className={styles.copyrightText}>
            © {new Date().getFullYear()} Allyster1. All rights reserved.
          </p>
        </ContainerLayout>
      </div>
    </footer>
  );
}
