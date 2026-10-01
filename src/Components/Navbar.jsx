import { Link, NavLink } from "react-router-dom";
import { useTheme } from "../Context/ThemeContext";
import styles from "../Styles/Navbar.module.css";

const Navbar = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <nav className={styles.navbar}>
      <div className={`container ${styles.navInner}`}>
        <Link to="/" className={styles.logo}>
          <span className={styles.logoIcon}>⬡</span>
          <span className={styles.logoText}>GitExplorer</span>
        </Link>

        <ul className={styles.navLinks}>
          <li>
            <NavLink
              to="/"
              end
              className={({ isActive }) => (isActive ? styles.active : "")}
            >
              Home
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/search"
              className={({ isActive }) => (isActive ? styles.active : "")}
            >
              Repos
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/bookmarks"
              className={({ isActive }) => (isActive ? styles.active : "")}
            >
              Bookmarks
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/compare"
              className={({ isActive }) => (isActive ? styles.active : "")}
            >
              Compare
            </NavLink>
          </li>
        </ul>

        <button
          className={styles.themeBtn}
          onClick={toggleTheme}
          aria-label="Toggle theme"
        >
          {theme === "dark" ? "☀" : "☾"}
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
