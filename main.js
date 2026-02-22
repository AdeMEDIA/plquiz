// MAIN.JS - Complete version

document.addEventListener('DOMContentLoaded', function() {
  
  // Initialize theme
  if (typeof window.initTheme === 'function') {
    window.initTheme();
  }
  
  // Theme toggle button
  const themeToggle = document.getElementById('themeToggle');
  if (themeToggle) {
    themeToggle.addEventListener('click', function() {
      if (typeof window.toggleTheme === 'function') {
        window.toggleTheme();
      }
    });
  }
  
  // ===== START SCREEN LOGIC =====
  const startScreen = document.getElementById('start-screen');
  const instructionsScreen = document.getElementById('instructions-screen');
  
  const playerNameInput = document.getElementById('playerName');
  const roomCodeInput = document.getElementById('roomCode');
  const newRoomSpan = document.getElementById('newRoomCode');
  const joinBtn = document.getElementById('joinBtn');
  const newRoomBtn = document.getElementById('newRoomBtn');
  
  // Generate initial room code
  let currentRoomCode = '1234';
  if (typeof window.generateRoomCode === 'function') {
    currentRoomCode = window.generateRoomCode();
  }
  if (newRoomSpan) newRoomSpan.textContent = currentRoomCode;
  if (roomCodeInput) roomCodeInput.value = currentRoomCode;
  
  // New room button
  if (newRoomBtn) {
    newRoomBtn.addEventListener('click', function() {
      if (typeof window.generateRoomCode === 'function') {
        currentRoomCode = window.generateRoomCode();
      } else {
        currentRoomCode = Math.floor(1000 + Math.random() * 9000).toString();
      }
      if (newRoomSpan) newRoomSpan.textContent = currentRoomCode;
      if (roomCodeInput) roomCodeInput.value = currentRoomCode;
      playSound(540);
    });
  }
  
  // Join button
  if (joinBtn) {
    joinBtn.addEventListener('click', function() {
      let name = playerNameInput ? playerNameInput.value.trim() : '';
      let room = roomCodeInput ? roomCodeInput.value.trim() : '';
      
      if (!name) {
        alert('Please enter your name!');
        return;
      }
      
      if (!room) {
        room = currentRoomCode;
      }
      
      // Save player info
      if (typeof window.savePlayerInfo === 'function') {
        window.savePlayerInfo(name, room);
      }
      
      playSound(720);
      
      // Switch to instructions screen
      startScreen.classList.remove('active');
      if (typeof window.showInstructions === 'function') {
        window.showInstructions();
      }
    });
  }
  
  // Helper function for sounds
  function playSound(freq) {
    try {
      const ctx = new(window.AudioContext || window.webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      gain.gain.value = 0.08;
      osc.frequency.value = freq;
      osc.start();
      osc.stop(ctx.currentTime + 0.1);
      if (ctx.state === 'suspended') ctx.resume();
    } catch (e) {}
  }
});