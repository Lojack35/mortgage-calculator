// This component is responsible for rendering the theme toggle switch.
function ThemeToggle({ isDarkMode, toggleTheme }) {
  return (
    <div className="theme-toggle-inline">
      <label className="switch">
        <input type="checkbox" checked={isDarkMode} onChange={toggleTheme} />
        <span className="slider round"></span>
      </label>
      <span className="theme-label">
        {isDarkMode ? "Dark Mode" : "Light Mode"}
      </span>
    </div>
  );
}

export default ThemeToggle;
