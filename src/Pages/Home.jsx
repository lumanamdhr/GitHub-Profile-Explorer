import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SearchBar from '../Components/SearchBar';
import styles from '../Styles/Home.module.css';

const stats = [
  { label: 'Repositories', value: '420M+' },
  { label: 'Developers', value: '100M+' },
  { label: 'Countries', value: '190+' },
];

const Home = () => {
  const [recentSearches, setRecentSearches] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const recent = JSON.parse(localStorage.getItem('gpe-recent') || '[]');
    setRecentSearches(recent);
  }, []);

  const clearRecent = () => {
    localStorage.removeItem('gpe-recent');
    setRecentSearches([]);
  };

  return (
    <div className={styles.page}>
      {/* Hero */}
      <section className={styles.hero}>
        <div className={styles.heroBg}>
          <div className={styles.gridOverlay}></div>
          <div className={styles.glow}></div>
        </div>
        <div className={`container ${styles.heroContent}`}>
          <div className={styles.badge}>GitHub REST API v3</div>
          <h1 className={styles.heading}>
            Explore GitHub <br />
            <span className={styles.accent}>Profiles & Repos</span>
          </h1>
          <p className={styles.subheading}>
            Search any GitHub user, dive into their repositories, stats, and activity — all in one place.
          </p>
          <div className={styles.searchWrapper}>
            <SearchBar placeholder="Search any GitHub username..." />
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className={styles.statsSection}>
        <div className="container">
          <div className={styles.statsGrid}>
            {stats.map(stat => (
              <div key={stat.label} className={styles.statCard}>
                <span className={styles.statValue}>{stat.value}</span>
                <span className={styles.statLabel}>{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Recent Searches */}
      {recentSearches.length > 0 && (
        <section className={styles.recentSection}>
          <div className="container">
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>Recent Searches</h2>
              <button className={styles.clearBtn} onClick={clearRecent}>Clear all</button>
            </div>
            <div className={styles.recentGrid}>
              {recentSearches.map(username => (
                <button
                  key={username}
                  className={styles.recentChip}
                  onClick={() => navigate(`/user/${username}`)}
                >
                  <span className={styles.chipAt}>@</span>{username}
                </button>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Features */}
      <section className={styles.featuresSection}>
        <div className="container">
          <h2 className={styles.sectionTitle}>What you can explore</h2>
          <div className={styles.featuresGrid}>
            {[
              { icon: '◎', title: 'User Profiles', desc: 'View avatar, bio, followers, location and more.' },
              { icon: '⎔', title: 'Repositories', desc: 'Browse all public repos with stars, forks and languages.' },
              { icon: '◈', title: 'Language Stats', desc: 'Visual chart of most used programming languages.' },
              { icon: '◉', title: 'Bookmarks', desc: 'Save favourite profiles to revisit anytime.' },
            ].map(f => (
              <div key={f.title} className={styles.featureCard}>
                <span className={styles.featureIcon}>{f.icon}</span>
                <h3 className={styles.featureTitle}>{f.title}</h3>
                <p className={styles.featureDesc}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;