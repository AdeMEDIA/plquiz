// AUTH.JS - Handles player names and room codes

// Generate random 4-digit room code
window.generateRoomCode = function() {
  return Math.floor(1000 + Math.random() * 9000).toString();
};

// Save player info to localStorage
window.savePlayerInfo = function(name, room) {
  localStorage.setItem('playerName', name);
  localStorage.setItem('roomCode', room);
};

// Get player info from localStorage
window.getPlayerInfo = function() {
  return {
    name: localStorage.getItem('playerName') || 'Player',
    room: localStorage.getItem('roomCode') || '0000'
  };
};

// Clear player info
window.clearPlayerInfo = function() {
  localStorage.removeItem('playerName');
  localStorage.removeItem('roomCode');
};