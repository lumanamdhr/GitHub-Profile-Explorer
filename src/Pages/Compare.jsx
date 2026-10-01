import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import styles from '../Styles/Compare.module.css';

const githubHeaders = { headers: { Accept: 'application/vnd.github+json' } };

const statItems = [
  { label: 'Public Repos', key: 'public_repos' },
  { label: 'Followers',    key: 'followers'     },
  { label: 'Following',    key: 'following'      },
  { label: 'Public Gists', key: 'public_gists'  },
];

const avatarStyle = {
  width: '28px',
  height: '28px',
  minWidth: '28px',
  minHeight: '28px',
  maxWidth: '28px',
  maxHeight: '28px',
  borderRadius: '50%',
  objectFit: 'cover',
  display: 'block',
  flexShrink: 0,
};

const dropdownStyle = {
  position: 'absolute',
  top: 'calc(100% + 6px)',
  left: 0,
  right: 0,
  backgroundColor: 'var(--bg-card)',
  border: '1px solid var(--border)',
  borderRadius: '12px',
  listStyle: 'none',
  boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
  zIndex: 9999,
  maxHeight: '260px',
  overflowY: 'auto',
  overflowX: 'hidden',
  padding: 0,
  margin: 0,
};

const dropItemStyle = {
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  gap: '10px',
  padding: '8px 14px',
  cursor: 'pointer',
  borderBottom: '1px solid var(--border)',
};

// ---------- reusable suggestion input ----------
const UserSearchInput = ({ placeholder, value, onChange, onSelect }) => {
  const [suggestions, setSuggestions] = useState([]);
  const [showDrop,    setShowDrop]    = useState(false);
  const [loadingSug,  setLoadingSug]  = useState(false);
  const debounceRef = useRef(null);
  const wrapperRef  = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setShowDrop(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fetchSuggestions = async (query) => {
    if (!query.trim()) { setSuggestions([]); return; }
    setLoadingSug(true);
    try {
      const res = await axios.get(
        `https://api.github.com/search/users?q=${query}&per_page=6`,
        githubHeaders
      );
      setSuggestions(res.data.items || []);
    } catch {
      setSuggestions([]);
    } finally {
      setLoadingSug(false);
    }
  };

  const handleChange = (e) => {
    const val = e.target.value;
    onChange(val);
    setShowDrop(true);
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => fetchSuggestions(val), 400);
  };

  const handleSelect = (username) => {
    onSelect(username);
    setShowDrop(false);
    setSuggestions([]);
  };

  return (
    <div style={{ position: 'relative', flex: 1, minWidth: '160px' }} ref={wrapperRef}>
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={handleChange}
        onFocus={() => value && setShowDrop(true)}
        className={styles.input}
        autoComplete="off"
      />
      {showDrop && value.length > 0 && (
        <ul style={dropdownStyle}>
          {loadingSug && (
            <li style={{ padding: '12px 16px', fontSize: '0.82rem', color: 'var(--text-muted)', textAlign: 'center' }}>
              Searching...
            </li>
          )}
          {!loadingSug && suggestions.length === 0 && (
            <li style={{ padding: '12px 16px', fontSize: '0.82rem', color: 'var(--text-muted)', textAlign: 'center' }}>
              No users found
            </li>
          )}
          {!loadingSug && suggestions.map((user, index) => (
            <li
              key={user.id}
              style={{
                ...dropItemStyle,
                borderBottom: index === suggestions.length - 1 ? 'none' : '1px solid var(--border)',
              }}
              onClick={() => handleSelect(user.login)}
              onMouseEnter={e => e.currentTarget.style.backgroundColor = 'var(--bg-hover)'}
              onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
            >
              <img src={user.avatar_url} alt={user.login} style={avatarStyle} />
              <span style={{ flex: 1, fontSize: '0.85rem', color: 'var(--text-primary)' }}>
                {user.login}
              </span>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>→</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

// ---------- main Compare component ----------
const Compare = () => {
  const [inputA,  setInputA]  = useState('');
  const [inputB,  setInputB]  = useState('');
  const [userA,   setUserA]   = useState(null);
  const [userB,   setUserB]   = useState(null);
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState(null);

  const fetchUser = async (username) => {
    const res = await axios.get(`https://api.github.com/users/${username}`, githubHeaders);
    return res.data;
  };

  const handleCompare = async (e) => {
    e.preventDefault();
    if (!inputA.trim() || !inputB.trim()) return;
    setLoading(true);
    setError(null);
    setUserA(null);
    setUserB(null);
    try {
      const [a, b] = await Promise.all([fetchUser(inputA.trim()), fetchUser(inputB.trim())]);
      setUserA(a);
      setUserB(b);
    } catch {
      setError('One or both usernames were not found. Please check and try again.');
    } finally {
      setLoading(false);
    }
  };

  const getWinner = (key) => {
    if (!userA || !userB) return null;
    if (userA[key] > userB[key]) return 'A';
    if (userB[key] > userA[key]) return 'B';
    return 'tie';
  };

  const getOverallWinner = () => {
    let scoreA = 0;
    let scoreB = 0;
    statItems.forEach(({ key }) => {
      const w = getWinner(key);
      if (w === 'A') scoreA++;
      if (w === 'B') scoreB++;
    });
    if (scoreA > scoreB) return userA;
    if (scoreB > scoreA) return userB;
    return null;
  };

  return (
    <div className={`container ${styles.page}`}>
      <h1 className={styles.heading}>Compare Users</h1>
      <p className={styles.subheading}>Search and select two GitHub users to compare their stats</p>

      <form onSubmit={handleCompare} className={styles.form}>
        <UserSearchInput
          placeholder="First username"
          value={inputA}
          onChange={setInputA}
          onSelect={setInputA}
        />
        <span className={styles.vs}>VS</span>
        <UserSearchInput
          placeholder="Second username"
          value={inputB}
          onChange={setInputB}
          onSelect={setInputB}
        />
        <button type="submit" className={styles.btn} disabled={loading}>
          {loading ? 'Comparing...' : 'Compare'}
        </button>
      </form>

      {error && <p className={styles.error}>{error}</p>}

      {userA && userB && (
        <div className={styles.results}>
          <div className={styles.profileRow}>
            <Link to={`/user/${userA.login}`} className={styles.profileCard}>
              <img src={userA.avatar_url} alt={userA.login} className={styles.avatar} />
              <p className={styles.name}>{userA.name || userA.login}</p>
              <p className={styles.login}>@{userA.login}</p>
            </Link>
            <div className={styles.vsBadge}>VS</div>
            <Link to={`/user/${userB.login}`} className={styles.profileCard}>
              <img src={userB.avatar_url} alt={userB.login} className={styles.avatar} />
              <p className={styles.name}>{userB.name || userB.login}</p>
              <p className={styles.login}>@{userB.login}</p>
            </Link>
          </div>

          <div className={styles.statsTable}>
            {statItems.map(({ label, key }) => {
              const winner = getWinner(key);
              return (
                <div key={key} className={styles.statRow}>
                  <span className={`${styles.statVal} ${winner === 'A' ? styles.winner : ''}`}>
                    {userA[key].toLocaleString()}
                  </span>
                  <span className={styles.statLabel}>{label}</span>
                  <span className={`${styles.statVal} ${styles.statValRight} ${winner === 'B' ? styles.winner : ''}`}>
                    {userB[key].toLocaleString()}
                  </span>
                </div>
              );
            })}
          </div>

          <div className={styles.banner}>
            {getOverallWinner()
              ? <><strong>@{getOverallWinner().login}</strong> wins overall!</>
              : <>It is a tie!</>
            }
          </div>
        </div>
      )}

      {!userA && !userB && !loading && !error && (
        <div className={styles.placeholder}>
          <p>Search and select two users above to start comparing</p>
        </div>
      )}
    </div>
  );
};

export default Compare;
