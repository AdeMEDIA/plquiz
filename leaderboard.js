// LEADERBOARD.JS - Shows scores from JSONbin

(function() {
  const leaderboardScreen = document.getElementById('leaderboard-screen');
  let refreshInterval = null;
  
  window.loadLeaderboard = function() {
    const player = window.getPlayerInfo();
    
    // Clear any existing interval
    if (refreshInterval) {
      clearInterval(refreshInterval);
    }
    
    leaderboardScreen.innerHTML = `
      <div class="leaderboard-container">
        <h1 class="leaderboard-title">🏆 LEADERBOARD</h1>
        <p class="leaderboard-sub">room ${player.room}</p>
        
        <div class="stats-panel">
          <div class="stats-box" id="statsBox">
            📊 Loading...
          </div>
          <div class="auto-refresh-indicator" id="refreshIndicator">
            🔄 Auto-refresh: ON
          </div>
        </div>
        
        <div id="scoresContainer" class="scores-container">
          <div class="no-scores">Loading scores...</div>
        </div>
        
        <div class="debug-info" id="debugInfo"></div>
        
        <div class="button-panel">
          <button class="btn-restart" id="restartBtn">← PLAY AGAIN</button>
          <button class="btn-secondary" id="refreshBtn">🔄 REFRESH NOW</button>
        </div>
        
        <div class="player-count" id="playerCount"></div>
      </div>
    `;
    
    // Buttons
    document.getElementById('restartBtn').addEventListener('click', () => {
      if (refreshInterval) clearInterval(refreshInterval);
      leaderboardScreen.classList.remove('active');
      document.getElementById('start-screen').classList.add('active');
    });
    
    document.getElementById('refreshBtn').addEventListener('click', () => {
      loadScores();
    });
    
    // Load scores immediately
    loadScores();
    
    // Auto-refresh every 10 seconds
    refreshInterval = setInterval(loadScores, 10000);
  };
  
  async function loadScores() {
    const player = window.getPlayerInfo();
    const container = document.getElementById('scoresContainer');
    const statsBox = document.getElementById('statsBox');
    const refreshIndicator = document.getElementById('refreshIndicator');
    const playerCount = document.getElementById('playerCount');
    const debugInfo = document.getElementById('debugInfo');
    
    refreshIndicator.innerHTML = '🔄 Refreshing...';
    debugInfo.innerHTML = '🔍 Fetching scores...';
    
    // Load from JSONbin
    let scores = [];
    if (typeof window.loadScoresFromJSONbin === 'function') {
      scores = await window.loadScoresFromJSONbin(player.room);
    }
    
    // Also get local scores as backup
    const localScores = JSON.parse(localStorage.getItem('quizScores') || '[]')
      .filter(s => s.room === player.room);
    
    // Merge scores
    if (scores.length === 0 && localScores.length > 0) {
      scores = localScores;
      debugInfo.innerHTML = `🔍 Using ${localScores.length} local scores`;
    } else {
      debugInfo.innerHTML = `🔍 Found ${scores.length} scores in cloud`;
    }
    
    // Display scores
    displayScores(scores, statsBox, playerCount, debugInfo);
    
    refreshIndicator.innerHTML = '🔄 Auto-refresh: ON';
  }
  
  function displayScores(scores, statsBox, playerCountEl, debugInfo) {
    const container = document.getElementById('scoresContainer');
    const totalQuestions = window.questionBank?.length || 8;
    
    if (scores.length === 0) {
      container.innerHTML = '<div class="no-scores">No scores yet! Be the first 🎯</div>';
      statsBox.innerHTML = `📊 0 players • Top score: 0/${totalQuestions}`;
      if (playerCountEl) playerCountEl.innerHTML = '👥 0 players in this room';
      return;
    }
    
    // Get unique best scores per player
    const bestPerPerson = {};
    scores.forEach(s => {
      if (!bestPerPerson[s.name] || s.score > bestPerPerson[s.name].score) {
        bestPerPerson[s.name] = s;
      }
    });
    
    // Convert to array and sort (HIGHEST FIRST!)
    let uniqueScores = Object.values(bestPerPerson);
    uniqueScores.sort((a, b) => {
      if (b.score !== a.score) {
        return b.score - a.score;
      }
      return new Date(a.time) - new Date(b.time);
    });
    
    // Update stats
    const topScore = uniqueScores[0]?.score || 0;
    statsBox.innerHTML = `📊 ${uniqueScores.length} players • Top score: ${topScore}/${totalQuestions}`;
    
    if (playerCountEl) {
      playerCountEl.innerHTML = `👥 ${uniqueScores.length} player${uniqueScores.length !== 1 ? 's' : ''} in this room`;
    }
    
    let html = '';
    uniqueScores.slice(0, 20).forEach((s, i) => {
      let rankClass = '';
      let medal = '';
      
      if (i === 0) {
        rankClass = 'top1';
        medal = '🥇 ';
      } else if (i === 1) {
        rankClass = 'top2';
        medal = '🥈 ';
      } else if (i === 2) {
        rankClass = 'top3';
        medal = '🥉 ';
      } else {
        medal = '📌 ';
      }
      
      html += `
        <div class="score-row ${rankClass}">
          <span class="rank">#${i+1}</span>
          <span class="name">${medal}${s.name}</span>
          <span class="score">${s.score}/${totalQuestions}</span>
        </div>
      `;
    });
    
    container.innerHTML = html;
  }
})();