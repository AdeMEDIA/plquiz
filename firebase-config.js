// ===========================================
// JSONbin.io - COMPLETE FIXED VERSION
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
const JSONBIN_API_KEY = "$2a$10$sAOGMz4xF4d1P5/n1gY4uuL4uvMpATy.UUNx843Rq8nMH.V9oYJ1a"; // ← Replace with your actual key

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

// SAVE PLAYER PRESENCE (so others know you're in the room)
window.savePlayerPresence = async function(playerName, roomCode) {
  console.log('👤 Saving presence for:', playerName, 'in room', roomCode);
  
  try {
    // Get existing scores
    let allScores = [];
    
    if (BIN_ID) {
      try {
        const response = await fetch(`https://api.jsonbin.io/v3/b/${BIN_ID}/latest`, {
          headers: getHeaders('GET')
        });
        if (response.ok) {
          const data = await response.json();
          allScores = data.record || [];
          console.log('📥 Loaded existing data:', allScores.length, 'entries');
        }
      } catch (e) {
        console.log('No existing bin yet');
      }
    }
    
    // Add presence marker
    allScores.push({
      name: playerName,
      score: -1, // Special marker for presence
      room: roomCode,
      time: new Date().toISOString(),
      timestamp: Date.now(),
      type: 'presence'
    });
    
    // Keep only last 100 entries total
    if (allScores.length > 100) {
      allScores = allScores.slice(-100);
    }
    
    // Save to JSONbin
    let url = 'https://api.jsonbin.io/v3/b';
    let method = 'POST';
    
    if (BIN_ID) {
      url = `https://api.jsonbin.io/v3/b/${BIN_ID}`;
      method = 'PUT';
    }
    
    console.log('📤 Saving to JSONbin...');
    const response = await fetch(url, {
      method: method,
      headers: getHeaders(method),
      body: JSON.stringify(allScores)
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (!BIN_ID && data.metadata?.id) {
      BIN_ID = data.metadata.id;
      localStorage.setItem('jsonbin_id', BIN_ID);
      console.log('✅ New bin created with ID:', BIN_ID);
    }
    
    console.log('✅ Presence saved!');
    return true;
    
  } catch (error) {
    console.error('❌ Presence error:', error);
    return false;
  }
};

// GET ALL PLAYERS IN A ROOM
window.getPlayersInRoom = async function(roomCode) {
  console.log('🔍 Getting players for room:', roomCode);
  
  try {
    BIN_ID = localStorage.getItem('jsonbin_id');
    
    if (!BIN_ID) {
      console.log('ℹ️ No bin ID yet');
      return [window.getPlayerInfo().name];
    }
    
    const response = await fetch(`https://api.jsonbin.io/v3/b/${BIN_ID}/latest`, {
      headers: getHeaders('GET')
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    const allEntries = data.record || [];
    console.log('📊 Total entries in bin:', allEntries.length);
    
    // Get unique players from last 30 seconds (for testing)
    const thirtySecsAgo = Date.now() - 30 * 1000;
    const activePlayers = new Set();
    
    allEntries.forEach(entry => {
      if (entry.room === roomCode) {
        const entryTime = entry.timestamp || new Date(entry.time).getTime();
        if (entryTime > thirtySecsAgo) {
          activePlayers.add(entry.name);
          console.log('✅ Active player:', entry.name, 'time:', new Date(entryTime).toLocaleTimeString());
        }
      }
    });
    
    const players = Array.from(activePlayers);
    console.log('👥 Active players found:', players);
    
    return players;
    
  } catch (error) {
    console.error('❌ Error getting players:', error);
    return [window.getPlayerInfo().name];
  }
};

// SAVE SCORE TO JSONBIN
window.saveScoreToJSONbin = async function(playerName, score, roomCode) {
  console.log('📝 Saving score:', { playerName, score, roomCode });
  
  try {
    // Get existing scores
    let allScores = [];
    
    if (BIN_ID) {
      try {
        const response = await fetch(`https://api.jsonbin.io/v3/b/${BIN_ID}/latest`, {
          headers: getHeaders('GET')
        });
        if (response.ok) {
          const data = await response.json();
          allScores = data.record || [];
        }
      } catch (e) {}
    }
    
    // Add new score
    allScores.push({
      name: playerName,
      score: score,
      room: roomCode,
      time: new Date().toISOString(),
      timestamp: Date.now(),
      type: 'score'
    });
    
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
    
    if (!BIN_ID && data.metadata?.id) {
      BIN_ID = data.metadata.id;
      localStorage.setItem('jsonbin_id', BIN_ID);
    }
    
    console.log('✅ Score saved!');
    return true;
    
  } catch (error) {
    console.error('❌ Save error:', error);
    return false;
  }
};

// LOAD SCORES FROM JSONBIN
window.loadScoresFromJSONbin = async function(roomCode) {
  console.log('📊 Loading scores for room:', roomCode);
  
  try {
    BIN_ID = localStorage.getItem('jsonbin_id');
    
    if (!BIN_ID) {
      return [];
    }
    
    const response = await fetch(`https://api.jsonbin.io/v3/b/${BIN_ID}/latest`, {
      headers: getHeaders('GET')
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    const allEntries = data.record || [];
    
    // Filter scores (not presence markers) and by room
    let roomScores = allEntries.filter(s =>
      s.room === roomCode && s.type === 'score' && s.score >= 0
    );
    
    // Sort by score (highest first)
    roomScores.sort((a, b) => {
      if (b.score !== a.score) {
        return b.score - a.score;
      }
      return new Date(a.time) - new Date(b.time);
    });
    
    console.log('📊 Scores found:', roomScores.length);
    return roomScores;
    
  } catch (error) {
    console.error('❌ Load error:', error);
    return [];
  }
};

console.log('🚀 JSONbin helper loaded!');