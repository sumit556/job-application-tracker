import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { applyTheme, getInitialTheme, saveTheme } from "../utils/theme";

function Header() {
  const [theme, setTheme] = useState(getInitialTheme);

  useEffect(() => {
    applyTheme(theme);
    saveTheme(theme);
  }, [theme]);

  const nextTheme = theme === "dark" ? "light" : "dark";

  return (
    <header className="app-header">
      <div className="app-header__inner">
        <Link to="/" className="brand">
          <span className="brand__mark" aria-hidden="true">
            JT
          </span>
          <span className="brand__text">Job Application Tracker</span>
        </Link>
        <div className="app-header__actions">
          <button
            type="button"
            className="button button-secondary button-small"
            aria-label={`Switch to ${nextTheme} mode`}
            onClick={() => setTheme(nextTheme)}
          >
            {nextTheme === "dark" ? "Dark mode" : "Light mode"}
          </button>
          <Link to="/add" className="button button-primary">
            Add application
          </Link>
        </div>
      </div>
    </header>
  );
}

export default Header;
