import styles from '../Styles/RepoCard.module.css';

const languageColors = {
  JavaScript: '#f1e05a',
  TypeScript: '#3178c6',
  Python: '#3572A5',
  Java: '#b07219',
  CSS: '#563d7c',
  HTML: '#e34c26',
  Go: '#00ADD8',
  Rust: '#dea584',
  C: '#555555',
  'C++': '#f34b7d',
  Ruby: '#701516',
  PHP: '#4F5D95',
  Swift: '#F05138',
  Kotlin: '#A97BFF',
  Dart: '#00B4AB',
};

const RepoCard = ({ repo }) => {
  const langColor = languageColors[repo.language] || '#8b949e';

  return (
    <a href={repo.html_url} target="_blank" rel="noreferrer" className={styles.card}>
      <div className={styles.top}>
        <span className={styles.repoIcon}>⎔</span>
        <h3 className={styles.name}>{repo.name}</h3>
        {repo.fork && <span className={styles.forkBadge}>Fork</span>}
      </div>
      {repo.description && (
        <p className={styles.description}>{repo.description}</p>
      )}
      <div className={styles.meta}>
        {repo.language && (
          <span className={styles.lang}>
            <span className={styles.langDot} style={{ background: langColor }}></span>
            {repo.language}
          </span>
        )}
        <span className={styles.stat}>⭐ {repo.stargazers_count}</span>
        <span className={styles.stat}>⑂ {repo.forks_count}</span>
      </div>
    </a>
  );
};

export default RepoCard;