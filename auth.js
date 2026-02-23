// AUTH.JS - Just name, no room

// Save player name
window.savePlayerName = function(name) {
  localStorage.setItem('playerName', name);
};

// Get player name
window.getPlayerName = function() {
  return localStorage.getItem('playerName') || 'Player';
};

// Clear player name
window.clearPlayerName = function() {
  localStorage.removeItem('playerName');
};