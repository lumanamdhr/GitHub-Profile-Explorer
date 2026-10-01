import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import styles from '../Styles/SearchBar.module.css';

const SearchBar = ({ placeholder = 'Search GitHub username...' }) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const debounceRef = useRef(null);
  const wrapperRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fetchSuggestions = async (searchQuery) => {
    if (!searchQuery.trim()) {
      setSuggestions([]);
      return;
    }
    setLoading(true);
    try {
      const res = await axios.get(
        `https://api.github.com/search/users?q=${searchQuery}&per_page=10`,
        { headers: { Accept: 'application/vnd.github+json' } }
      );
      setSuggestions(res.data.items || []);
    } catch {
      setSuggestions([]);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    setShowSuggestions(true);

    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      fetchSuggestions(value);
    }, 400);
  };

  const handleSelect = (username) => {
    setQuery(username);
    setShowSuggestions(false);
    saveToRecent(username);
    navigate(`/user/${username}`);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    setShowSuggestions(false);
    saveToRecent(query.trim());
    navigate(`/user/${query.trim()}`);
  };

  const saveToRecent = (username) => {
    const prev = JSON.parse(localStorage.getItem('gpe-recent') || '[]');
    const updated = [username, ...prev.filter(u => u !== username)].slice(0, 6);
    localStorage.setItem('gpe-recent', JSON.stringify(updated));
  };

  return (
    <div className={styles.wrapper} ref={wrapperRef}>
      <form onSubmit={handleSubmit} className={styles.form}>
        <span className={styles.searchIcon}>⌕</span>
        <input
          type="text"
          value={query}
          onChange={handleChange}
          onFocus={() => query && setShowSuggestions(true)}
          placeholder={placeholder}
          className={styles.input}
          autoComplete="off"
        />
        <button type="submit" className={styles.btn}>Search</button>
      </form>

      {showSuggestions && (query.length > 0) && (
        <ul className={styles.suggestions}>
          {loading && (
            <li className={styles.loadingItem}>Searching...</li>
          )}
          {!loading && suggestions.length === 0 && (
            <li className={styles.noResult}>No users found</li>
          )}
          {!loading && suggestions.map(user => (
            <li key={user.id} className={styles.suggestionItem} onClick={() => handleSelect(user.login)}>
              <img src={user.avatar_url} alt={user.login} className={styles.avatar} />
              <span className={styles.username}>{user.login}</span>
              <span className={styles.arrow}>→</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SearchBar;