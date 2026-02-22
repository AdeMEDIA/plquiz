// ===========================================
// JSONbin.io - COMPLETE CONFIGURATION
// ===========================================

/*
  GET YOUR FREE API KEY:
  1. Go to https://jsonbin.io/
  2. Sign up (free, takes 30 seconds)
  3. Go to API Keys section
  4. Copy your "X-Master-Key"
  5. Paste it below
*/

// 🔑 PASTE YOUR JSONbin API KEY HERE:
const JSONBIN_API_KEY = "YOUR-API-KEY-HERE"; // ← Replace with your actual key

// Your bin ID (will be created automatically)
let BIN_ID = localStorage.getItem('jsonbin_id');

// Headers for requests
function getHeaders(method = 'GET') {
  const headers = {
    'Content-Type': 'application/json',
  };
  
  // Add API key if available
  if (JSONBIN_API_KEY && JSONBIN_API_KEY !== "YOUR-API-KEY-HERE") {
    headers['X-Master-Key'] = JSONBIN_API_KEY;
    console.log('🔑 Using API key');
  }
  
  if (method === 'POST') {
    headers['X-Bin-Name'] = 'quiz-scores';
    headers['X-Bin-Private'] = 'false';
  }
  
  return headers;
}

// SAVE SCORE TO JSONBIN
window.saveScoreToJSONbin = async function(playerName, score, roomCode) {
  console.log('📝 Saving score:', { playerName, score, roomCode });
  
  try {
    // Get existing scores
    let allScores = [];
    
    // Try to fetch existing bin
    if (BIN_ID) {
      try {
        const response = await fetch(`https://api.jsonbin.io/v3/b/${BIN_ID}/latest`, {
          headers: getHeaders('GET')
        });
        
        if (response.ok) {
          const data = await response.json();
          allScores = data.record || [];
          console.log('📥 Loaded existing scores:', allScores.length);
        } else {
          console.log('❌ Failed to fetch bin, will create new');
          BIN_ID = null;
          localStorage.removeItem('jsonbin_id');
        }
      } catch (e) {
        console.log('⚠️ Error fetching bin:', e);
        BIN_ID = null;
        localStorage.removeItem('jsonbin_id');
      }
    }
    
    // Add new score
    allScores.push({
      name: playerName,
      score: score,
      room: roomCode,
      time: new Date().toISOString(),
      timestamp: Date.now()
    });
    
    console.log('➕ Added new score. Total scores:', allScores.length);
    
    // Save to JSONbin
    let url = 'https://api.jsonbin.io/v3/b';
    let method = 'POST';
    
    if (BIN_ID) {
      url = `https://api.jsonbin.io/v3/b/${BIN_ID}`;
      method = 'PUT';
    }
    
    const response = await fetch(url, {
      method: method,
      headers: getHeaders(method),
      body: JSON.stringify(allScores)
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Save bin ID for future use
    if (!BIN_ID && data.metadata?.id) {
      BIN_ID = data.metadata.id;
      localStorage.setItem('jsonbin_id', BIN_ID);
      console.log('✅ New bin created with ID:', BIN_ID);
    }
    
    // Also save to localStorage as backup
    let localScores = JSON.parse(localStorage.getItem('quizScores') || '[]');
    localScores.push({
      name: playerName,
      score: score,
      room: roomCode,
      time: new Date().toISOString()
    });
    localStorage.setItem('quizScores', JSON.stringify(localScores));
    
    console.log('✅ Score saved successfully!');
    return true;
    
  } catch (error) {
    console.error('❌ Save error:', error);
    
    // Fallback to localStorage only
    let localScores = JSON.parse(localStorage.getItem('quizScores') || '[]');
    localScores.push({
      name: playerName,
      score: score,
      room: roomCode,
      time: new Date().toISOString()
    });
    localStorage.setItem('quizScores', JSON.stringify(localScores));
    console.log('💾 Saved to localStorage only');
    
    return false;
  }
};

// LOAD SCORES FROM JSONBIN
window.loadScoresFromJSONbin = async function(roomCode) {
  console.log('📊 Loading scores for room:', roomCode);
  
  try {
    BIN_ID = localStorage.getItem('jsonbin_id');
    
    if (!BIN_ID) {
      console.log('ℹ️ No bin ID yet, using localStorage');
      return loadFromLocalStorage(roomCode);
    }
    
    const response = await fetch(`https://api.jsonbin.io/v3/b/${BIN_ID}/latest`, {
      headers: getHeaders('GET')
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    const allScores = data.record || [];
    
    // Filter by room
    let roomScores = allScores.filter(s => s.room === roomCode);
    
    // Sort by score (highest first)
    roomScores.sort((a, b) => {
      if (b.score !== a.score) {
        return b.score - a.score;
      }
      return new Date(a.time) - new Date(b.time);
    });
    
    return roomScores;
    
  } catch (error) {
    console.error('❌ Load error:', error);
    return loadFromLocalStorage(roomCode);
  }
};

// GET UNIQUE PLAYERS IN A ROOM
window.getPlayersInRoom = async function(roomCode) {
  try {
    const scores = await window.loadScoresFromJSONbin(roomCode);
    const players = [...new Set(scores.map(s => s.name))];
    return players;
  } catch (error) {
    console.error('Error getting players:', error);
    return [];
  }
};

// Fallback to localStorage
function loadFromLocalStorage(roomCode) {
  console.log('💾 Loading from localStorage');
  const localScores = JSON.parse(localStorage.getItem('quizScores') || '[]');
  let roomScores = localScores.filter(s => s.room === roomCode);
  
  roomScores.sort((a, b) => {
    if (b.score !== a.score) {
      return b.score - a.score;
    }
    return new Date(a.time) - new Date(b.time);
  });
  
  return roomScores;
}

console.log('🚀 JSONbin helper loaded!');