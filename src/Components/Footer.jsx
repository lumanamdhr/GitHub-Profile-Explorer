import styles from '../Styles/Footer.module.css';

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.footerInner}`}>
        <p className={styles.left}>
          <span className={styles.icon}>⬡</span> GitExplorer — Built with React & GitHub API
        </p>
        <p className={styles.right}>
          <a href="https://docs.github.com/en/rest" target="_blank" rel="noreferrer">
            GitHub REST API Docs ↗
          </a>
        </p>
      </div>
    </footer>
  );
};

export default Footer;