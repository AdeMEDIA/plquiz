// ===========================================
// LOCAL STORAGE ONLY - No cloud needed!
// ===========================================

// Save score locally (keeping for compatibility)
window.saveScore = function(playerName, score, roomCode) {
  // We don't need to save scores anymore since we removed leaderboard
  console.log('🎮 Game completed!', playerName, score, roomCode);
  return true;
};

console.log('✅ Ready to play!');