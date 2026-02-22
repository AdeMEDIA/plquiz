// INSTRUCTIONS.JS - Requires minimum 2 players to start!

(function() {
  const instructionsScreen = document.getElementById('instructions-screen');
  let countdownInterval = null;
  let countdownSeconds = 10;
  let gameStartTimeout = null;
  let gameReady = false;
  let playerCheckerInterval = null;
  
  // Track players in room
  let playersInRoom = [];
  
  // Get room code
  function getCurrentRoom() {
    return window.getPlayerInfo().room;
  }
  
  window.showInstructions = function() {
    const player = window.getPlayerInfo();
    
    // Reset state
    countdownSeconds = 10;
    gameReady = false;
    
    // Update UI
    document.getElementById('instructionRoomCode').innerHTML = `ROOM: ${player.room}`;
    document.getElementById('instructionPlayerName').innerHTML = player.name;
    document.getElementById('countdownNumber').innerHTML = countdownSeconds;
    
    // Add current player to list
    playersInRoom = [player.name];
    updatePlayersList();
    
    // Show waiting message
    updateReadyStatus();
    
    // Start checking for other players
    startPlayerChecker();
    
    // Show instructions screen
    instructionsScreen.classList.add('active');
  };
  
  // Check for other players in the same room
  function startPlayerChecker() {
    // Clear any existing checker
    if (playerCheckerInterval) {
      clearInterval(playerCheckerInterval);
    }
    
    // Check every 3 seconds for new players
    playerCheckerInterval = setInterval(() => {
      checkForOtherPlayers();
    }, 3000);
    
    // Also check immediately
    checkForOtherPlayers();
  }
  
  async function checkForOtherPlayers() {
    const currentRoom = getCurrentRoom();
    
    // Load all scores for this room from JSONbin
    if (typeof window.getPlayersInRoom === 'function') {
      const players = await window.getPlayersInRoom(currentRoom);
      
      // Add current player if not in list
      const currentPlayer = window.getPlayerInfo().name;
      if (!players.includes(currentPlayer)) {
        players.push(currentPlayer);
      }
      
      // Update players list
      playersInRoom = players;
      updatePlayersList();
      
      // Check if we have minimum 2 players
      if (playersInRoom.length >= 2 && !gameReady) {
        gameReady = true;
        startCountdown();
      }
    }
  }
  
  function startCountdown() {
    // Clear existing intervals
    if (countdownInterval) clearInterval(countdownInterval);
    if (gameStartTimeout) clearTimeout(gameStartTimeout);
    
    // Show ready message
    const waitingDiv = document.getElementById('waitingPlayers');
    waitingDiv.innerHTML = `
      <p style="color: #4CAF50; font-weight: bold;">✅ READY! ${playersInRoom.length} players joined</p>
      <div class="players-list" id="playersList"></div>
    `;
    updatePlayersList();
    
    // Update countdown display
    document.getElementById('countdownNumber').innerHTML = countdownSeconds;
    document.getElementById('countdownStatus').innerHTML = 'game starting...';
    
    // Show start button
    document.getElementById('startGameBtn').style.display = 'block';
    document.getElementById('skipHint').innerHTML = 'Starting in <span id="autoTimer">10</span>s';
    
    // Start countdown
    countdownInterval = setInterval(() => {
      countdownSeconds--;
      
      // Update displays
      document.getElementById('countdownNumber').innerHTML = countdownSeconds;
      document.getElementById('autoTimer').innerHTML = countdownSeconds;
      
      // Circle color change when low
      const circle = document.getElementById('countdownCircle');
      if (countdownSeconds <= 3) {
        circle.style.borderColor = '#FF5577';
        circle.style.boxShadow = '0 0 40px #FF5577';
      }
      
      // When countdown reaches 0
      if (countdownSeconds <= 0) {
        clearInterval(countdownInterval);
        startGame();
      }
    }, 1000);
    
    // Auto-start after 10 seconds
    gameStartTimeout = setTimeout(startGame, 10000);
  }
  
  function startGame() {
    // Clean up
    if (countdownInterval) clearInterval(countdownInterval);
    if (gameStartTimeout) clearTimeout(gameStartTimeout);
    if (playerCheckerInterval) clearInterval(playerCheckerInterval);
    
    // Hide instructions, show quiz
    instructionsScreen.classList.remove('active');
    
    if (typeof window.startQuiz === 'function') {
      window.startQuiz();
    }
  }
  
  function updatePlayersList() {
    const listContainer = document.getElementById('playersList');
    if (!listContainer) return;
    
    let html = '';
    playersInRoom.forEach((player, index) => {
      const isYou = player === window.getPlayerInfo().name;
      html += `<span class="player-dot">${isYou ? '👤' : '👥'} ${player}${isYou ? ' (You)' : ''}</span>`;
    });
    
    listContainer.innerHTML = html;
    
    // Update waiting message based on player count
    const waitingDiv = document.getElementById('waitingPlayers');
    if (playersInRoom.length < 2) {
      waitingDiv.innerHTML = `
        <p>⏳ Waiting for ${2 - playersInRoom.length} more player${(2 - playersInRoom.length) > 1 ? 's' : ''}... (${playersInRoom.length}/2)</p>
        <div class="players-list" id="playersList"></div>
      `;
      document.getElementById('playersList').innerHTML = html;
      
      // Add waiting dots
      for (let i = 0; i < (2 - playersInRoom.length); i++) {
        html += `<span class="player-dot" style="opacity:0.5;">⏳ Waiting...</span>`;
      }
      document.getElementById('playersList').innerHTML = html;
    }
  }
  
  function updateReadyStatus() {
    const waitingDiv = document.getElementById('waitingPlayers');
    const html = `
      <p>⏳ Waiting for players... (${playersInRoom.length}/2 minimum)</p>
      <div class="players-list" id="playersList"></div>
    `;
    waitingDiv.innerHTML = html;
    updatePlayersList();
  }
  
  // Manual start button
  document.addEventListener('click', function(e) {
    if (e.target.id === 'startGameBtn' && gameReady) {
      startGame();
    }
  });
  
})();