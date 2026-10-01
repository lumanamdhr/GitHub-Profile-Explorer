import { useState } from 'react';
import axios from 'axios';
import RepoCard from '../Components/RepoCard';
import Loader from '../Components/Loader';
import styles from '../Styles/RepoSearch.module.css';

const RepoSearch = () => {
  const [query, setQuery] = useState('');
  const [language, setLanguage] = useState('');
  const [sort, setSort] = useState('stars');
  const [repos, setRepos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searched, setSearched] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setError(null);
    setSearched(true);

    try {
      let q = query;
      if (language) q += `+language:${language}`;
      const res = await axios.get(
        `https://api.github.com/search/repositories?q=${q}&sort=${sort}&per_page=30`,
        { headers: { Accept: 'application/vnd.github+json' } }
      );
      setRepos(res.data.items || []);
    } catch (err) {
      setError('Failed to fetch repositories. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`container ${styles.page}`}>
      <h1 className={styles.heading}>Repository Search</h1>
      <p className={styles.subheading}>Search across all public GitHub repositories</p>

      <form onSubmit={handleSearch} className={styles.form}>
        <input
          type="text"
          placeholder="Search repositories (e.g. react dashboard)"
          value={query}
          onChange={e => setQuery(e.target.value)}
          className={styles.input}
        />
        <select value={language} onChange={e => setLanguage(e.target.value)} className={styles.select}>
          <option value="">All Languages</option>
          {['JavaScript', 'TypeScript', 'Python', 'Java', 'Go', 'Rust', 'C++', 'Ruby', 'PHP', 'Swift', 'Kotlin', 'Dart'].map(l => (
            <option key={l} value={l}>{l}</option>
          ))}
        </select>
        <select value={sort} onChange={e => setSort(e.target.value)} className={styles.select}>
          <option value="stars">Most Stars</option>
          <option value="forks">Most Forks</option>
          <option value="updated">Recently Updated</option>
          <option value="help-wanted-issues">Help Wanted</option>
        </select>
        <button type="submit" className={styles.btn}>Search</button>
      </form>

      {loading && <Loader />}

      {!loading && error && <p className={styles.error}>{error}</p>}

      {!loading && searched && repos.length === 0 && !error && (
        <p className={styles.empty}>No repositories found. Try different keywords.</p>
      )}

      {!loading && repos.length > 0 && (
        <>
          <p className={styles.resultCount}>{repos.length} repositories found</p>
          <div className={styles.grid}>
            {repos.map(repo => <RepoCard key={repo.id} repo={repo} />)}
          </div>
        </>
      )}

      {!searched && !loading && (
        <div className={styles.placeholder}>
          <span className={styles.placeholderIcon}>⎔</span>
          <p>Enter a keyword to search repositories</p>
        </div>
      )}
    </div>
  );
};

export default RepoSearch;