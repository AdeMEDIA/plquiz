// INSTRUCTIONS.JS - Single player with 10s timer

(function() {
  const instructionsScreen = document.getElementById('instructions-screen');
  let countdownInterval = null;
  let countdownSeconds = 10;
  
  window.showInstructions = function() {
    let playerName = window.getPlayerName();
    
    // Update UI
    document.getElementById('instructionPlayerName').innerHTML = playerName;
    document.getElementById('countdownNumber').innerHTML = countdownSeconds;
    document.getElementById('countdownStatus').innerHTML = 'get ready...';
    document.getElementById('startGameBtn').style.display = 'block';
    document.getElementById('skipHint').innerHTML = 'Game starts in <span id="autoTimer">10</span>s';
    
    // Show player
    let playersList = document.getElementById('playersList');
    playersList.innerHTML = `<span class="player-dot">👤 ${playerName}</span>`;
    
    // Show instructions screen
    instructionsScreen.classList.add('active');
    
    // Start countdown
    startCountdown();
  };
  
  function startCountdown() {
    if (countdownInterval) clearInterval(countdownInterval);
    
    countdownInterval = setInterval(() => {
      countdownSeconds--;
      document.getElementById('countdownNumber').innerHTML = countdownSeconds;
      let timer = document.getElementById('autoTimer');
      if (timer) timer.innerHTML = countdownSeconds;
      
      if (countdownSeconds <= 0) {
        clearInterval(countdownInterval);
        startGame();
      }
    }, 1000);
  }
  
  function startGame() {
    clearInterval(countdownInterval);
    instructionsScreen.classList.remove('active');
    
    if (typeof window.startQuiz === 'function') {
      window.startQuiz();
    }
  }
  
  // Manual start button
  document.addEventListener('click', function(e) {
    if (e.target.id === 'startGameBtn') {
      startGame();
    }
  });
  
})();