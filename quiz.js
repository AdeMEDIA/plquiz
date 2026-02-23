// QUIZ.JS - Complete with working Home button

(function() {
  // ===== STATE VARIABLES =====
  let currentQuestionIndex = 0;
  let playerScore = 0;
  let timerInterval = null;
  let timerSeconds = 15;
  let canAnswer = true;
  let gameFinished = false;
  let currentQuestions = [];
  
  // ===== DOM ELEMENTS =====
  const quizScreen = document.getElementById('quiz-screen');
  
  // ===== INITIALIZE QUIZ SCREEN HTML =====
  function buildQuizHTML() {
    quizScreen.innerHTML = `
      <div class="quiz-header">
        <div class="timer-container">
          <div class="timer-circle" id="timerDisplay">15</div>
          <span class="timer-label">seconds</span>
        </div>
      </div>

      <div class="player-name-badge" id="playerDisplay"></div>

      <div class="progress-container">
        <div class="progress-bar-bg">
          <div class="progress-fill" id="progressFill"></div>
        </div>
        <div class="question-counter" id="questionCount">1 / 8</div>
      </div>

      <div class="question-card">
        <h2 id="questionText">Loading...</h2>
      </div>

      <div class="options-grid" id="optionsContainer"></div>

      <div class="next-wrapper">
        <button class="btn-next" id="nextBtn">→ NEXT QUESTION</button>
      </div>
    `;
  }
  
  // ===== HELPER: Stop timer =====
  function clearGameTimer() {
    if (timerInterval) {
      clearInterval(timerInterval);
      timerInterval = null;
    }
  }
  
  // ===== HELPER: Play sound =====
  function playClickSound(type) {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      if (type === 'correct') {
        osc.frequency.value = 820;
        gain.gain.value = 0.1;
        osc.start();
        osc.stop(ctx.currentTime + 0.15);
      } else if (type === 'wrong') {
        osc.frequency.value = 320;
        gain.gain.value = 0.1;
        osc.start();
        osc.stop(ctx.currentTime + 0.12);
      } else {
        osc.frequency.value = 540;
        gain.gain.value = 0.06;
        osc.start();
        osc.stop(ctx.currentTime + 0.05);
      }
      if (ctx.state === 'suspended') ctx.resume();
    } catch (e) {}
  }
  
  // ===== START TIMER =====
  function startQuestionTimer() {
    timerSeconds = 15;
    const timerEl = document.getElementById('timerDisplay');
    if (timerEl) timerEl.textContent = timerSeconds;
    
    clearGameTimer();
    
    timerInterval = setInterval(() => {
      timerSeconds--;
      const timerEl = document.getElementById('timerDisplay');
      if (timerEl) timerEl.textContent = timerSeconds;
      
      if (timerSeconds <= 3) {
        if (timerEl) timerEl.style.color = '#FF5577';
      }
      
      if (timerSeconds <= 0) {
        clearGameTimer();
        if (canAnswer && !gameFinished) {
          canAnswer = false;
          playClickSound('wrong');
          
          const correctIdx = currentQuestions[currentQuestionIndex].correct;
          document.querySelectorAll('.option-btn').forEach((btn, idx) => {
            btn.disabled = true;
            if (idx === correctIdx) {
              btn.classList.add('correct-highlight');
            }
          });
          
          const nextBtn = document.getElementById('nextBtn');
          if (nextBtn) nextBtn.style.display = 'block';
        }
      }
    }, 1000);
  }
  
  // ===== DISPLAY QUESTION =====
  function displayQuestion(index) {
    if (!currentQuestions || currentQuestions.length === 0) return;
    
    if (index >= currentQuestions.length) {
      finishGameAndShowScoreCard();
      return;
    }
    
    canAnswer = true;
    gameFinished = false;
    
    const nextBtn = document.getElementById('nextBtn');
    if (nextBtn) nextBtn.style.display = 'none';
    
    const q = currentQuestions[index];
    
    const qText = document.getElementById('questionText');
    if (qText) qText.textContent = q.question;
    
    const progressFill = document.getElementById('progressFill');
    if (progressFill) {
      progressFill.style.width = ((index) / currentQuestions.length * 100) + '%';
    }
    
    const qCount = document.getElementById('questionCount');
    if (qCount) {
      qCount.textContent = `${index+1} / ${currentQuestions.length}`;
    }
    
    const letters = ['A', 'B', 'C', 'D'];
    let optionsHtml = '';
    q.options.forEach((opt, i) => {
      optionsHtml += `<button class="option-btn" data-option-index="${i}">
        <span class="prefix">${letters[i]}</span> ${opt}
      </button>`;
    });
    
    const optionsContainer = document.getElementById('optionsContainer');
    if (optionsContainer) {
      optionsContainer.innerHTML = optionsHtml;
    }
    
    document.querySelectorAll('.option-btn').forEach(btn => {
      btn.addEventListener('click', handleOptionClick);
      btn.classList.remove('correct-highlight', 'wrong-highlight');
      btn.disabled = false;
    });
    
    const timerEl = document.getElementById('timerDisplay');
    if (timerEl) timerEl.style.color = 'var(--text-primary)';
    startQuestionTimer();
  }
  
  // ===== HANDLE OPTION CLICK =====
  function handleOptionClick(e) {
    if (!canAnswer || gameFinished) return;
    
    const clickedBtn = e.currentTarget;
    const selectedIdx = parseInt(clickedBtn.dataset.optionIndex);
    const correctIdx = currentQuestions[currentQuestionIndex].correct;
    
    clearGameTimer();
    canAnswer = false;
    
    const isCorrect = (selectedIdx === correctIdx);
    playClickSound(isCorrect ? 'correct' : 'wrong');
    
    if (isCorrect) {
      playerScore++;
    }
    
    document.querySelectorAll('.option-btn').forEach((btn, idx) => {
      btn.disabled = true;
      if (idx === correctIdx) {
        btn.classList.add('correct-highlight');
      } else if (idx === selectedIdx && !isCorrect) {
        btn.classList.add('wrong-highlight');
      }
    });
    
    const nextBtn = document.getElementById('nextBtn');
    if (nextBtn) nextBtn.style.display = 'block';
  }
  
  // ===== NEXT QUESTION =====
  function advanceToNextQuestion() {
    currentQuestionIndex++;
    
    if (currentQuestionIndex < currentQuestions.length) {
      displayQuestion(currentQuestionIndex);
    } else {
      finishGameAndShowScoreCard();
    }
  }
  
  // ===== FINISH GAME AND SHOW SCORE CARD =====
  function finishGameAndShowScoreCard() {
    gameFinished = true;
    clearGameTimer();
    
    const playerName = window.getPlayerName();
    const totalQuestions = currentQuestions.length;
    const percentage = (playerScore / totalQuestions) * 100;
    
    // Determine remark based on performance
    let remark = '';
    let emoji = '';
    
    if (percentage === 100) {
      remark = 'QUIZ MASTER!';
      emoji = '🏆';
    } else if (percentage >= 80) {
      remark = 'QUIZ WHIZ!';
      emoji = '🌟';
    } else if (percentage >= 60) {
      remark = 'QUIZ SMART!';
      emoji = '📚';
    } else if (percentage >= 40) {
      remark = 'KEEP LEARNING!';
      emoji = '🌱';
    } else if (percentage >= 20) {
      remark = 'GOOD TRY!';
      emoji = '👍';
    } else {
      remark = 'KEEP PRACTICING!';
      emoji = '💪';
    }
    
    // Show score card
    quizScreen.innerHTML = `
      <div class="score-card-container">
        <div class="score-card">
          <div class="score-emoji">${emoji}</div>
          <h1 class="score-title">${remark}</h1>
          
          <div class="score-circle">
            <span class="score-number">${playerScore}</span>
            <span class="score-total">/${totalQuestions}</span>
          </div>
          
          <div class="score-details">
            <p>You got <strong>${playerScore}</strong> out of <strong>${totalQuestions}</strong> correct!</p>
            <p class="score-percentage">${Math.round(percentage)}%</p>
          </div>
          
          <div class="score-player">
            <span class="player-icon">👤</span>
            <span class="player-name">${playerName}</span>
          </div>
          
          <div class="score-actions">
            <button class="btn btn-primary" id="playAgainBtn">▶ PLAY AGAIN</button>
            <button class="btn btn-secondary" id="homeBtn">🏠 HOME</button>
          </div>
        </div>
      </div>
    `;
    
    // Play Again button
    document.getElementById('playAgainBtn').addEventListener('click', function() {
      restartQuiz();
    });
    
    // Home button - goes back to start screen
    document.getElementById('homeBtn').addEventListener('click', function() {
      goHome();
    });
  }
  
  // ===== RESTART QUIZ =====
  function restartQuiz() {
    // Reset all state
    currentQuestionIndex = 0;
    playerScore = 0;
    gameFinished = false;
    clearGameTimer();
    
    // Get fresh shuffled questions
    if (typeof window.getShuffledQuestions === 'function') {
      currentQuestions = window.getShuffledQuestions();
    } else {
      currentQuestions = [...window.questionBank];
    }
    
    // Rebuild quiz screen
    buildQuizHTML();
    
    // Update player name
    const playerEl = document.getElementById('playerDisplay');
    if (playerEl) playerEl.innerHTML = `👤 ${window.getPlayerName()}`;
    
    // Load first question
    displayQuestion(0);
    
    // Re-attach next button handler
    const nextBtn = document.getElementById('nextBtn');
    if (nextBtn) {
      nextBtn.replaceWith(nextBtn.cloneNode(true));
      document.getElementById('nextBtn').addEventListener('click', advanceToNextQuestion);
    }
  }
  
  // ===== GO HOME (to start screen) =====
  function goHome() {
    // Clear game state
    clearGameTimer();
    gameFinished = false;
    
    // Hide quiz screen, show start screen
    quizScreen.classList.remove('active');
    document.getElementById('start-screen').classList.add('active');
  }
  
  // ===== RESET GAME STATE =====
  function resetGameState() {
    currentQuestionIndex = 0;
    playerScore = 0;
    gameFinished = false;
    clearGameTimer();
    
    if (typeof window.getShuffledQuestions === 'function') {
      currentQuestions = window.getShuffledQuestions();
    } else {
      currentQuestions = [...window.questionBank];
    }
  }
  
  // ===== PUBLIC API =====
  window.startQuiz = function() {
    buildQuizHTML();
    resetGameState();
    
    const playerName = window.getPlayerName();
    const playerEl = document.getElementById('playerDisplay');
    
    if (playerEl) playerEl.innerHTML = `👤 ${playerName}`;
    
    displayQuestion(0);
    
    const nextBtn = document.getElementById('nextBtn');
    if (nextBtn) {
      nextBtn.replaceWith(nextBtn.cloneNode(true));
      document.getElementById('nextBtn').addEventListener('click', advanceToNextQuestion);
      nextBtn.disabled = false;
      nextBtn.textContent = '→ NEXT QUESTION';
    }
    
    quizScreen.classList.add('active');
  };
  
  // Make functions available globally
  window.restartQuiz = restartQuiz;
  window.goHome = goHome;
})();