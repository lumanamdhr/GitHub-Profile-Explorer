import { useParams, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import useFetch from '../hooks/useFetch';
import Loader from '../Components/Loader';
import RepoCard from '../Components/RepoCard';
import styles from '../Styles/UserProfile.module.css';

const COLORS = ['#58a6ff', '#3fb950', '#bc8cff', '#d29922', '#f85149', '#79b8ff', '#56d364'];

const UserProfile = () => {
  const { username } = useParams();
  const [bookmarks, setBookmarks] = useState(() => JSON.parse(localStorage.getItem('gpe-bookmarks') || '[]'));
  const [langData, setLangData] = useState([]);

  const { data: user, loading, error } = useFetch(`https://api.github.com/users/${username}`);
  const { data: repos } = useFetch(`https://api.github.com/users/${username}/repos?per_page=100&sort=stars`);

  useEffect(() => {
    if (!repos) return;
    const langCount = {};
    repos.forEach(repo => {
      if (repo.language) {
        langCount[repo.language] = (langCount[repo.language] || 0) + 1;
      }
    });
    const sorted = Object.entries(langCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 7)
      .map(([name, value]) => ({ name, value }));
    setLangData(sorted);
  }, [repos]);

  const isBookmarked = bookmarks.includes(username);

  const toggleBookmark = () => {
    let updated;
    if (isBookmarked) {
      updated = bookmarks.filter(b => b !== username);
    } else {
      updated = [username, ...bookmarks];
    }
    setBookmarks(updated);
    localStorage.setItem('gpe-bookmarks', JSON.stringify(updated));
  };

  if (loading) return <Loader />;
  if (error) return (
    <div className="container">
      <div className={styles.errorBox}>
        <span>⚠</span> {error}
        <Link to="/" className={styles.backLink}>← Back to Home</Link>
      </div>
    </div>
  );
  if (!user) return null;

  const topRepos = repos ? [...repos].sort((a, b) => b.stargazers_count - a.stargazers_count).slice(0, 6) : [];

  return (
    <div className={`container ${styles.page}`}>
      {/* Back */}
      <Link to="/" className={styles.backLink}>← Back</Link>

      {/* Profile Card */}
      <div className={styles.profileCard}>
        <div className={styles.avatarWrapper}>
          <img src={user.avatar_url} alt={user.login} className={styles.avatar} />
          <div className={styles.avatarGlow}></div>
        </div>
        <div className={styles.profileInfo}>
          <div className={styles.nameRow}>
            <div>
              <h1 className={styles.name}>{user.name || user.login}</h1>
              <a href={user.html_url} target="_blank" rel="noreferrer" className={styles.login}>
                @{user.login} ↗
              </a>
            </div>
            <button
              className={`${styles.bookmarkBtn} ${isBookmarked ? styles.bookmarked : ''}`}
              onClick={toggleBookmark}
            >
              {isBookmarked ? '★ Saved' : '☆ Save'}
            </button>
          </div>
          {user.bio && <p className={styles.bio}>{user.bio}</p>}
          <div className={styles.metaRow}>
            {user.location && <span className={styles.meta}>📍 {user.location}</span>}
            {user.blog && (
              <a href={user.blog} target="_blank" rel="noreferrer" className={styles.meta}>
                🔗 {user.blog}
              </a>
            )}
            {user.company && <span className={styles.meta}>🏢 {user.company}</span>}
            {user.twitter_username && (
              <a href={`https://twitter.com/${user.twitter_username}`} target="_blank" rel="noreferrer" className={styles.meta}>
                𝕏 @{user.twitter_username}
              </a>
            )}
          </div>
          <div className={styles.statsRow}>
            <div className={styles.stat}>
              <span className={styles.statNum}>{user.public_repos}</span>
              <span className={styles.statLabel}>Repos</span>
            </div>
            <div className={styles.stat}>
              <span className={styles.statNum}>{user.followers}</span>
              <span className={styles.statLabel}>Followers</span>
            </div>
            <div className={styles.stat}>
              <span className={styles.statNum}>{user.following}</span>
              <span className={styles.statLabel}>Following</span>
            </div>
            <div className={styles.stat}>
              <span className={styles.statNum}>{user.public_gists}</span>
              <span className={styles.statLabel}>Gists</span>
            </div>
          </div>
        </div>
      </div>

      {/* Language Chart */}
      {langData.length > 0 && (
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Language Distribution</h2>
          <div className={styles.chartCard}>
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie data={langData} cx="50%" cy="50%" innerRadius={70} outerRadius={110} paddingAngle={3} dataKey="value">
                  {langData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '8px', fontFamily: 'var(--font-mono)', fontSize: '0.8rem' }}
                  itemStyle={{ color: 'var(--text-primary)' }}
                />
                <Legend wrapperStyle={{ fontFamily: 'var(--font-mono)', fontSize: '0.78rem' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Top Repos */}
      {topRepos.length > 0 && (
        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Top Repositories</h2>
            <Link to={`/user/${username}/repos`} className={styles.viewAll}>
              View all {user.public_repos} repos →
            </Link>
          </div>
          <div className={styles.reposGrid}>
            {topRepos.map(repo => <RepoCard key={repo.id} repo={repo} />)}
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfile;