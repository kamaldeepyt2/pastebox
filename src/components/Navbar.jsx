import { useEffect, useState } from 'react'
import { NavLink } from 'react-router-dom'

const Navbar = () => {
  const [isDark, setIsDark] = useState(() => localStorage.getItem('theme') === 'dark');

  useEffect(() => {
    document.documentElement.dataset.theme = isDark ? 'dark' : 'light';
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  }, [isDark]);

  return (
    <header className="topbar">
      <NavLink to="/" className="brand">
        <span className="brand-mark"><span>P</span><i aria-hidden="true">✦</i></span>
        <span>Pastebox</span>
      </NavLink>

      <nav className="nav-links" aria-label="Main navigation">
        <NavLink to="/" className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>
          New paste
        </NavLink>

        <NavLink to="/pastes" className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>
          Library
        </NavLink>
      </nav>

      <div className="studio-note">
        <span className="studio-icon" aria-hidden="true">◈</span>
        <span>Local-first workspace</span>
        <button className="theme-toggle" onClick={() => setIsDark((value) => !value)} aria-label="Toggle dark mode">
          {isDark ? '☀' : '☾'}
        </button>
      </div>
    </header>
  )
}

export default Navbar
