// ===========================================
// JSONbin - SIMPLE AND RELIABLE
// ===========================================

/*
  GET YOUR FREE API KEY:
  1. Go to https://jsonbin.io/
  2. Sign up (free, 30 seconds)
  3. Go to API Keys section
  4. Copy your "X-Master-Key" (starts with $2a$10$...)
  5. Paste it below
*/

const JSONBIN_API_KEY = "$2a$10$sAOGMz4xF4d1P5/n1gY4uuL4uvMpATy.UUNx843Rq8nMH.V9oYJ1a"; // ← PASTE YOUR KEY HERE

// Your bin ID (auto-saved)
let BIN_ID = localStorage.getItem('jsonbin_id');

// Simple headers
function getHeaders(method = 'GET') {
  let headers = {
    'Content-Type': 'application/json',
  };
  
  if (JSONBIN_API_KEY && JSONBIN_API_KEY !== "YOUR-API-KEY-HERE") {
    headers['X-Master-Key'] = JSONBIN_API_KEY;
  }
  
  if (method === 'POST') {
    headers['X-Bin-Name'] = 'quiz-scores';
    headers['X-Bin-Private'] = 'false';
  }
  
  return headers;
}

// SAVE A SCORE
window.saveScore = async function(playerName, score, roomCode) {
  console.log('💾 Saving:', playerName, score, roomCode);
  
  try {
    // Get existing data
    let allData = [];
    if (BIN_ID) {
      try {
        let res = await fetch(`https://api.jsonbin.io/v3/b/${BIN_ID}/latest`, {
          headers: getHeaders('GET')
        });
        if (res.ok) {
          let data = await res.json();
          allData = data.record || [];
        }
      } catch (e) {
        console.log('No existing bin yet');
      }
    }
    
    // Add new score
    allData.push({
      name: playerName,
      score: score,
      room: roomCode,
      time: Date.now()
    });
    
    // Save to JSONbin
    let url = 'https://api.jsonbin.io/v3/b';
    let method = 'POST';
    
    if (BIN_ID) {
      url = `https://api.jsonbin.io/v3/b/${BIN_ID}`;
      method = 'PUT';
    }
    
    let res = await fetch(url, {
      method: method,
      headers: getHeaders(method),
      body: JSON.stringify(allData)
    });
    
    let data = await res.json();
    
    if (!BIN_ID && data.metadata?.id) {
      BIN_ID = data.metadata.id;
      localStorage.setItem('jsonbin_id', BIN_ID);
      console.log('✅ New bin created:', BIN_ID);
    }
    
    console.log('✅ Score saved!');
    return true;
    
  } catch (error) {
    console.error('❌ Error:', error);
    return false;
  }
};

// GET SCORES FOR A ROOM
window.getScores = async function(roomCode) {
  console.log('📊 Getting scores for room:', roomCode);
  
  if (!BIN_ID) {
    console.log('No bin ID yet');
    return [];
  }
  
  try {
    let res = await fetch(`https://api.jsonbin.io/v3/b/${BIN_ID}/latest`, {
      headers: getHeaders('GET')
    });
    
    if (!res.ok) {
      console.log('Failed to fetch');
      return [];
    }
    
    let data = await res.json();
    let allData = data.record || [];
    
    // Filter by room
    let roomScores = allData.filter(s => s.room === roomCode);
    
    // Sort by score (highest first)
    roomScores.sort((a, b) => b.score - a.score);
    
    console.log(`Found ${roomScores.length} scores`);
    return roomScores;
    
  } catch (error) {
    console.error('❌ Error:', error);
    return [];
  }
};

// GET PLAYERS IN A ROOM (based on who has scores)
window.getPlayers = async function(roomCode) {
  let scores = await window.getScores(roomCode);
  let players = [...new Set(scores.map(s => s.name))];
  console.log('Players in room:', players);
  return players;
};

// REGISTER PLAYER (save a 0 score to show they're here)
window.registerPlayer = async function(playerName, roomCode) {
  return await window.saveScore(playerName, 0, roomCode);
};

console.log('✅ JSONbin ready!');