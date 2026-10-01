import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../Styles/Bookmarks.module.css';

const Bookmarks = () => {
  const [bookmarks, setBookmarks] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('gpe-bookmarks') || '[]');
    setBookmarks(saved);
  }, []);

  const removeBookmark = (username) => {
    const updated = bookmarks.filter(b => b !== username);
    setBookmarks(updated);
    localStorage.setItem('gpe-bookmarks', JSON.stringify(updated));
  };

  const clearAll = () => {
    setBookmarks([]);
    localStorage.removeItem('gpe-bookmarks');
  };

  return (
    <div className={`container ${styles.page}`}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.heading}>Bookmarks</h1>
          <p className={styles.subheading}>Your saved GitHub profiles</p>
        </div>
        {bookmarks.length > 0 && (
          <button className={styles.clearBtn} onClick={clearAll}>Clear all</button>
        )}
      </div>

      {bookmarks.length === 0 ? (
        <div className={styles.empty}>
          <span className={styles.emptyIcon}>☆</span>
          <p>No bookmarks yet</p>
          <span className={styles.emptyHint}>Save profiles by clicking the ☆ Save button on any profile page</span>
        </div>
      ) : (
        <div className={styles.grid}>
          {bookmarks.map(username => (
            <div key={username} className={styles.card}>
              <img
                src={`https://avatars.githubusercontent.com/${username}`}
                alt={username}
                className={styles.avatar}
                onClick={() => navigate(`/user/${username}`)}
              />
              <div className={styles.info} onClick={() => navigate(`/user/${username}`)}>
                <p className={styles.username}>@{username}</p>
                <p className={styles.hint}>View profile →</p>
              </div>
              <button
                className={styles.removeBtn}
                onClick={() => removeBookmark(username)}
                title="Remove bookmark"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Bookmarks;