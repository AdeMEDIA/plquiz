// MAIN.JS - Simplified with just name

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
  
  const playerNameInput = document.getElementById('playerName');
  const startBtn = document.getElementById('startBtn');
  
  // Start button
  if (startBtn) {
    startBtn.addEventListener('click', function() {
      let name = playerNameInput ? playerNameInput.value.trim() : '';
      
      if (!name) {
        alert('Please enter your name!');
        return;
      }
      
      // Save player name
      if (typeof window.savePlayerName === 'function') {
        window.savePlayerName(name);
      }
      
      playSound(720);
      
      // Switch to instructions screen
      startScreen.classList.remove('active');
      if (typeof window.showInstructions === 'function') {
        window.showInstructions();
      }
    });
  }
  
  // Play sound function
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