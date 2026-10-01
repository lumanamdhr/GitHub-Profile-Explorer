import { useParams, Link } from 'react-router-dom';
import { useState } from 'react';
import useFetch from '../hooks/useFetch';
import Loader from '../Components/Loader';
import RepoCard from '../Components/RepoCard';
import styles from '../Styles/Repositories.module.css';

const Repositories = () => {
  const { username } = useParams();
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('stars');
  const [language, setLanguage] = useState('All');

  const { data: repos, loading, error } = useFetch(
    `https://api.github.com/users/${username}/repos?per_page=100&sort=${sort}`
  );

  const languages = repos
    ? ['All', ...new Set(repos.map(r => r.language).filter(Boolean))]
    : ['All'];

  const filtered = repos
    ? repos.filter(r => {
        const matchesSearch = r.name.toLowerCase().includes(search.toLowerCase());
        const matchesLang = language === 'All' || r.language === language;
        return matchesSearch && matchesLang;
      })
    : [];

  if (loading) return <Loader />;
  if (error) return (
    <div className="container">
      <p className={styles.error}>{error}</p>
    </div>
  );

  return (
    <div className={`container ${styles.page}`}>
      <Link to={`/user/${username}`} className={styles.backLink}>← Back to @{username}</Link>
      <h1 className={styles.heading}>Repositories <span className={styles.count}>({filtered.length})</span></h1>

      <div className={styles.controls}>
        <input
          type="text"
          placeholder="Filter repositories..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className={styles.filterInput}
        />
        <select value={sort} onChange={e => setSort(e.target.value)} className={styles.select}>
          <option value="stars">Sort: Stars</option>
          <option value="updated">Sort: Updated</option>
          <option value="created">Sort: Created</option>
          <option value="full_name">Sort: Name</option>
        </select>
        <select value={language} onChange={e => setLanguage(e.target.value)} className={styles.select}>
          {languages.map(l => <option key={l} value={l}>{l}</option>)}
        </select>
      </div>

      {filtered.length === 0 ? (
        <p className={styles.empty}>No repositories match your filters.</p>
      ) : (
        <div className={styles.grid}>
          {filtered.map(repo => <RepoCard key={repo.id} repo={repo} />)}
        </div>
      )}
    </div>
  );
};

export default Repositories;