// THEME.JS - Handles light/dark mode

// Set theme and save to localStorage
window.setTheme = function(theme) {
  document.body.classList.remove('dark-mode', 'light-mode');
  document.body.classList.add(theme);
  localStorage.setItem('quizTheme', theme);
  
  const toggle = document.getElementById('themeToggle');
  if (toggle) {
    toggle.textContent = theme === 'dark-mode' ? '🌞' : '🌓';
  }
};

// Toggle between light and dark
window.toggleTheme = function() {
  const current = document.body.classList.contains('dark-mode') ? 'dark-mode' : 'light-mode';
  const newTheme = current === 'dark-mode' ? 'light-mode' : 'dark-mode';
  window.setTheme(newTheme);
};

// Load saved theme
window.initTheme = function() {
  const savedTheme = localStorage.getItem('quizTheme') || 'dark-mode';
  window.setTheme(savedTheme);
};