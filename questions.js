// QUESTION BANK - Updated with Perle Labs questions
window.questionBank = [
  {
    question: "What is the primary mission of Perle Labs?",
    options: [
      "Build trading bots",
      "Create a decentralized exchange", 
      "Enable expert-verified AI data contribution and validation",
      "Launch an AI that does human tasks"
    ],
    correct: 2  // C
  },
  {
    question: "Who out of these people isn't a mod in the Perle Labs Discord?",
    options: [
      "Super Dad Eazy",
      "Cute Simba", 
      "Big Daddy Vinex",
      "Beautiful Dahlia"
    ],
    correct: 3  // D
  },
  {
    question: "Who should ideally complete specialized tasks on Perle Labs?",
    options: [
      "Anyone looking to earn fast rewards",
      "Verified contributors with relevant expertise",
      "Automated bots",
      "Anonymous users without review"
    ],
    correct: 1  // B
  },
  {
    question: "Which day of the week does the Perle open mic event occur?",
    options: [
      "Thursday",
      "Wednesday",
      "Friday", 
      "Tuesday"
    ],
    correct: 0  // A
  },
  {
    question: "Which of these roles is not acquirable in the Perle Labs Discord server?",
    options: [
      "Perle Voyager",
      "Perle Explorer",
      "Perle Contributor", 
      "Perle Navigator"
    ],
    correct: 2  // C
  },
  {
    question: "Which industries benefit most from expert-validated AI data?",
    options: [
      "Healthcare",
      "Legal",
      "Finance",
      "All of the above"
    ],
    correct: 3  // D
  },
  {
    question: "Who is the first community member to be invited to speak in the Perle Labs open mic session live on Discord?",
    options: [
      "Wellstine",
      "Miss J",
      "Simba",
      "Thai"
    ],
    correct: 0  // A
  },
  {
    question: "What determines a contributor's reputation on Perle?",
    options: [
      "Number of referrals",
      "Social media followers",
      "Accuracy, consistency, and quality of completed tasks",
      "Wallet balance"
    ],
    correct: 2  // C
  }
];

// Shuffle array (keeping your existing helper functions)
window.shuffleArray = function(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

// Get shuffled questions
window.getShuffledQuestions = function() {
  let shuffled = window.shuffleArray([...window.questionBank]);
  
  return shuffled.map(q => {
    let optionsWithIndex = q.options.map((opt, idx) => ({
      text: opt,
      originalIndex: idx
    }));
    
    let shuffledOptions = window.shuffleArray([...optionsWithIndex]);
    
    let newCorrectIndex = shuffledOptions.findIndex(
      opt => opt.originalIndex === q.correct
    );
    
    return {
      question: q.question,
      options: shuffledOptions.map(opt => opt.text),
      correct: newCorrectIndex
    };
  });
};

// Answer key reference (for your verification)
window.answerKey = {
  1: "C - Enable expert-verified AI data contribution and validation",
  2: "D - Beautiful Dahlia",
  3: "B - Verified contributors with relevant expertise",
  4: "A - Thursday",
  5: "C - Perle Contributor",
  6: "D - All of the above",
  7: "A - Wellstine",
  8: "C - Accuracy, consistency, and quality of completed tasks"
};

console.log("✅ Perle Labs questions loaded!");
