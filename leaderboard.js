// LEADERBOARD.JS - Simple and reliable

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
    let player = window.getPlayerInfo();
    let container = document.getElementById('scoresContainer');
    let statsBox = document.getElementById('statsBox');
    let refreshIndicator = document.getElementById('refreshIndicator');
    let playerCount = document.getElementById('playerCount');
    
    refreshIndicator.innerHTML = '🔄 Refreshing...';
    
    // Get scores from JSONbin
    let scores = [];
    if (typeof window.getScores === 'function') {
      scores = await window.getScores(player.room);
    }
    
    // If no scores, try local
    if (scores.length === 0) {
      scores = JSON.parse(localStorage.getItem('quizScores') || '[]')
        .filter(s => s.room === player.room);
    }
    
    if (scores.length === 0) {
      container.innerHTML = '<div class="no-scores">No scores yet! Be the first 🎯</div>';
      statsBox.innerHTML = '📊 0 players';
      if (playerCount) playerCount.innerHTML = '👥 0 players';
      refreshIndicator.innerHTML = '🔄 Auto-refresh: ON';
      return;
    }
    
    // Get best score per player
    let best = {};
    scores.forEach(s => {
      if (!best[s.name] || s.score > best[s.name].score) {
        best[s.name] = s;
      }
    });
    
    let finalScores = Object.values(best);
    finalScores.sort((a, b) => b.score - a.score);
    
    statsBox.innerHTML = `📊 ${finalScores.length} players • Top: ${finalScores[0].score}/8`;
    if (playerCount) playerCount.innerHTML = `👥 ${finalScores.length} players`;
    
    let html = '';
    finalScores.slice(0, 10).forEach((s, i) => {
      let rankClass = '';
      let medal = '';
      
      if (i === 0) {
        rankClass = 'top1';
        medal = '🥇';
      } else if (i === 1) {
        rankClass = 'top2';
        medal = '🥈';
      } else if (i === 2) {
        rankClass = 'top3';
        medal = '🥉';
      } else {
        medal = '📌';
      }
      
      html += `
        <div class="score-row ${rankClass}">
          <span class="rank">#${i+1}</span>
          <span class="name">${medal} ${s.name}</span>
          <span class="score">${s.score}/8</span>
        </div>
      `;
    });
    
    container.innerHTML = html;
    refreshIndicator.innerHTML = '🔄 Auto-refresh: ON';
  }
})();