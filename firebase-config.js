// ===========================================
// JSONbin.io - WITH API KEY (1000 requests/day!)
// ===========================================

/*
  STEP 1: GET YOUR FREE API KEY (30 seconds)
  - Go to https://jsonbin.io/
  - Click "Sign Up" (top right)
  - Use any email + password
  - Verify email
  - Go to "API Keys" section
  - Copy your "X-Master-Key"
  
  STEP 2: PASTE YOUR KEY BELOW
*/

// 🔑 PASTE YOUR JSONbin API KEY HERE:
const JSONBIN_API_KEY = "$2a$10$sAOGMz4xF4d1P5/n1gY4uuL4uvMpATy.UUNx843Rq8nMH.V9oYJ1a"; // ← GET THIS!

// Your bin ID (auto-saved)
let BIN_ID = localStorage.getItem('jsonbin_id');

// Headers for authenticated requests (1000 requests/day!)
function getHeaders(method = 'GET') {
  const headers = {
    'Content-Type': 'application/json',
  };
  
  // Add API key if available (for 1000 requests!)
  if (JSONBIN_API_KEY && !JSONBIN_API_KEY.includes('your-actual')) {
    headers['X-Master-Key'] = JSONBIN_API_KEY;
    console.log('🔑 Using API key - 1000 requests/day!');
  } else {
    console.log('⚠️ No API key - 10 requests/hour limit');
  }
  
  if (method === 'POST') {
    headers['X-Bin-Name'] = 'quiz-scores';
    headers['X-Bin-Private'] = 'false';
  }
  
  return headers;
}

// Save score to JSONbin
window.saveScoreToJSONbin = async function(playerName, score, roomCode) {
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
      } catch (e) {
        console.log('Creating new bin...');
      }
    }
    
    // Add new score
    allScores.push({
      name: playerName,
      score: score,
      room: roomCode,
      time: new Date().toISOString()
    });
    
    // Keep only last 500 scores (for many users!)
    const roomScores = allScores.filter(s => s.room === roomCode);
    if (roomScores.length > 500) {
      // Keep highest scores only
      roomScores.sort((a, b) => b.score - a.score);
      const toKeep = roomScores.slice(0, 500);
      allScores = allScores.filter(s => s.room !== roomCode).concat(toKeep);
    }
    
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
    
    const data = await response.json();
    
    if (!BIN_ID && data.metadata?.id) {
      BIN_ID = data.metadata.id;
      localStorage.setItem('jsonbin_id', BIN_ID);
    }
    
    console.log(`✅ Score saved! ${playerName}: ${score}/8`);
    return true;
    
  } catch (error) {
    console.error('Save error:', error);
    return false;
  }
};

// Load scores
window.loadScoresFromJSONbin = async function(roomCode) {
  try {
    BIN_ID = localStorage.getItem('jsonbin_id');
    
    if (!BIN_ID) {
      return [];
    }
    
    const response = await fetch(`https://api.jsonbin.io/v3/b/${BIN_ID}/latest`, {
      headers: getHeaders('GET')
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch');
    }
    
    const data = await response.json();
    const allScores = data.record || [];
    
    // Filter by room
    let roomScores = allScores.filter(s => s.room === roomCode);
    
    // Sort by score (highest first!)
    roomScores.sort((a, b) => {
      if (b.score !== a.score) {
        return b.score - a.score;
      }
      return new Date(a.time) - new Date(b.time);
    });
    
    return roomScores;
    
  } catch (error) {
    console.error('Load error:', error);
    return [];
  }
};

// Show status
if (JSONBIN_API_KEY && !JSONBIN_API_KEY.includes('your-actual')) {
  console.log('✅ JSONbin PRO mode: 1000 requests/day! Perfect for many users!');
} else {
  console.log('ℹ️ JSONbin FREE mode: 10 requests/hour (add API key for more)');
  console.log('📝 Get free API key at: https://jsonbin.io/');
}