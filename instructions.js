// INSTRUCTIONS.JS - Simple and reliable

(function() {
  const instructionsScreen = document.getElementById('instructions-screen');
  let countdownInterval = null;
  let countdownSeconds = 10;
  let gameReady = false;
  let playerCheckerInterval = null;
  let currentPlayers = [];
  
  window.showInstructions = function() {
    let player = window.getPlayerInfo();
    
    console.log('📱 Player joined:', player.name, 'Room:', player.room);
    
    // Update UI
    document.getElementById('instructionRoomCode').innerHTML = `ROOM: ${player.room}`;
    document.getElementById('instructionPlayerName').innerHTML = player.name;
    document.getElementById('countdownNumber').innerHTML = '∞';
    document.getElementById('countdownStatus').innerHTML = 'waiting for players...';
    document.getElementById('startGameBtn').style.display = 'none';
    document.getElementById('skipHint').innerHTML = 'Need at least 2 players to start';
    
    // Show screen
    instructionsScreen.classList.add('active');
    
    // Register this player
    if (typeof window.registerPlayer === 'function') {
      window.registerPlayer(player.name, player.room);
    }
    
    // Start checking for players
    startChecking();
  };
  
  function startChecking() {
    if (playerCheckerInterval) clearInterval(playerCheckerInterval);
    
    // Check every 3 seconds
    playerCheckerInterval = setInterval(checkPlayers, 3000);
    
    // Check immediately
    setTimeout(checkPlayers, 1000);
  }
  
  async function checkPlayers() {
    let room = window.getPlayerInfo().room;
    let currentPlayer = window.getPlayerInfo().name;
    
    if (typeof window.getPlayers === 'function') {
      let players = await window.getPlayers(room);
      
      // Make sure current player is included
      if (!players.includes(currentPlayer)) {
        players.push(currentPlayer);
      }
      
      currentPlayers = players;
      updatePlayerList();
      
      // Check if we have 2 or more players
      if (players.length >= 2 && !gameReady) {
        console.log('✅ 2 players found! Starting countdown...');
        gameReady = true;
        startCountdown();
      }
    }
  }
  
  function updatePlayerList() {
    let listDiv = document.getElementById('playersList');
    let waitingDiv = document.getElementById('waitingPlayers');
    let currentPlayer = window.getPlayerInfo().name;
    
    let html = '';
    currentPlayers.forEach(p => {
      let isYou = p === currentPlayer;
      html += `<span class="player-dot">${isYou ? '👤' : '👥'} ${p}${isYou ? ' (You)' : ''}</span>`;
    });
    
    if (currentPlayers.length < 2) {
      waitingDiv.innerHTML = `
        <p>⏳ Waiting for ${2 - currentPlayers.length} more player... (${currentPlayers.length}/2)</p>
        <div class="players-list" id="playersList">${html}</div>
      `;
    } else {
      waitingDiv.innerHTML = `
        <p style="color: #4CAF50;">✅ READY! ${currentPlayers.length} players joined</p>
        <div class="players-list" id="playersList">${html}</div>
      `;
    }
  }
  
  function startCountdown() {
    countdownSeconds = 10;
    
    document.getElementById('countdownNumber').innerHTML = countdownSeconds;
    document.getElementById('countdownStatus').innerHTML = 'game starting...';
    document.getElementById('startGameBtn').style.display = 'block';
    document.getElementById('skipHint').innerHTML = 'Starting in <span id="autoTimer">10</span>s';
    
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
    clearInterval(playerCheckerInterval);
    clearInterval(countdownInterval);
    instructionsScreen.classList.remove('active');
    
    if (typeof window.startQuiz === 'function') {
      window.startQuiz();
    }
  }
  
  // Manual start
  document.addEventListener('click', function(e) {
    if (e.target.id === 'startGameBtn' && gameReady) {
      startGame();
    }
  });
  
})();