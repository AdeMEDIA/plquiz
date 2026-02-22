// LEADERBOARD.JS - Auto-refresh for many users!

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
    
    // Add styles
    const style = document.createElement('style');
    style.textContent = `
      .stats-panel {
        display: flex;
        gap: 0.5rem;
        margin-bottom: 1rem;
        flex-wrap: wrap;
      }
      .stats-box {
        flex: 2;
        background: var(--feature-bg);
        padding: 0.8rem;
        border-radius: 2rem;
        text-align: center;
        color: var(--accent-glow);
        font-weight: 500;
      }
      .auto-refresh-indicator {
        flex: 1;
        background: var(--option-bg);
        padding: 0.8rem;
        border-radius: 2rem;
        text-align: center;
        color: #4CAF50;
        font-size: 0.9rem;
        border: 1px solid #4CAF50;
      }
      .button-panel {
        display: flex;
        gap: 1rem;
        justify-content: center;
        margin: 2rem 0 1rem;
      }
      .btn-secondary {
        background: transparent;
        border: 2px solid var(--accent-glow);
        color: var(--text-primary);
        padding: 0.8rem 2rem;
        border-radius: 3rem;
        cursor: pointer;
        font-size: 1rem;
      }
      .btn-secondary:hover {
        background: var(--accent-glow);
        color: white;
      }
      .player-count {
        text-align: center;
        color: var(--text-secondary);
        font-size: 0.9rem;
        margin-top: 0.5rem;
      }
    `;
    document.head.appendChild(style);
    
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
    
    // Auto-refresh every 30 seconds
    refreshInterval = setInterval(loadScores, 30000);
  };
  
  async function loadScores() {
    const player = window.getPlayerInfo();
    const container = document.getElementById('scoresContainer');
    const statsBox = document.getElementById('statsBox');
    const refreshIndicator = document.getElementById('refreshIndicator');
    const playerCount = document.getElementById('playerCount');
    
    // Update indicator
    refreshIndicator.innerHTML = '🔄 Refreshing...';
    
    // Load from JSONbin
    let jsonbinScores = [];
    if (typeof window.loadScoresFromJSONbin === 'function') {
      jsonbinScores = await window.loadScoresFromJSONbin(player.room);
    }
    
    // Display scores
    displayScores(jsonbinScores, statsBox, playerCount);
    
    // Update indicator
    refreshIndicator.innerHTML = '🔄 Auto-refresh: ON';
  }
  
  function displayScores(scores, statsBox, playerCountEl) {
    const container = document.getElementById('scoresContainer');
    const totalQuestions = window.questionBank?.length || 8;
    
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
    statsBox.innerHTML = `📊 ${uniqueScores.length} players • Top: ${topScore}/${totalQuestions}`;
    
    if (playerCountEl) {
      playerCountEl.innerHTML = `👥 ${uniqueScores.length} player${uniqueScores.length !== 1 ? 's' : ''} in this room`;
    }
    
    if (uniqueScores.length === 0) {
      container.innerHTML = '<div class="no-scores">No scores yet! Be the first 🎯</div>';
      return;
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
      } else if (i < 10) {
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
    
    // Show champion
    if (uniqueScores[0]) {
      console.log(`🏆 Champion: ${uniqueScores[0].name} (${uniqueScores[0].score}/${totalQuestions})`);
    }
  }
})();