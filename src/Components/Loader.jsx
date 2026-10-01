import styles from '../Styles/Loader.module.css';

const Loader = () => {
  return (
    <div className={styles.wrapper}>
      <div className={styles.spinner}></div>
      <p className={styles.text}>Fetching from GitHub...</p>
    </div>
  );
};

export default Loader;