import { Link } from 'react-router-dom';
import styles from '../Styles/NotFound.module.css';

const NotFound = () => {
  return (
    <div className={styles.page}>
      <div className={styles.code}>404</div>
      <h1 className={styles.heading}>Page Not Found</h1>
      <p className={styles.sub}>
        The page you're looking for doesn't exist or the GitHub user was not found.
      </p>
      <Link to="/" className={styles.btn}>← Back to Home</Link>
    </div>
  );
};

export default NotFound;