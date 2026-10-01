import { useNavigate } from 'react-router-dom';
import styles from '../Styles/UserCard.module.css';

const UserCard = ({ user }) => {
  const navigate = useNavigate();

  return (
    <div className={styles.card} onClick={() => navigate(`/user/${user.login}`)}>
      <img src={user.avatar_url} alt={user.login} className={styles.avatar} />
      <div className={styles.info}>
        <p className={styles.username}>@{user.login}</p>
        <p className={styles.type}>{user.type}</p>
      </div>
      <span className={styles.arrow}>→</span>
    </div>
  );
};

export default UserCard;