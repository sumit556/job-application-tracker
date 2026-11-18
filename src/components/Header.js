import { Link } from "react-router-dom";

function Header() {
  return (
    <header className="app-header">
      <div className="app-header__inner">
        <Link to="/" className="brand">
          <span className="brand__mark" aria-hidden="true">
            JT
          </span>
          <span className="brand__text">Job Application Tracker</span>
        </Link>
        <Link to="/add" className="button button-primary">
          Add application
        </Link>
      </div>
    </header>
  );
}

export default Header;
