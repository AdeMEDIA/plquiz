// QUESTION BANK - Add or edit questions here
window.questionBank = [
  {
    question: "Which element has the highest melting point?",
    options: ["Tungsten", "Carbon", "Iron", "Platinum"],
    correct: 0
  },
  {
    question: "What is the rarest M&M color?",
    options: ["Brown", "Blue", "Red", "Green"],
    correct: 0
  },
  {
    question: "Who painted 'The Starry Night'?",
    options: ["Monet", "Van Gogh", "Picasso", "Rembrandt"],
    correct: 1
  },
  {
    question: "What is the fastest land animal?",
    options: ["Lion", "Cheetah", "Peregrine Falcon", "Pronghorn"],
    correct: 1
  },
  {
    question: "Which planet has the most moons?",
    options: ["Jupiter", "Saturn", "Uranus", "Neptune"],
    correct: 1
  },
  {
    question: "In what year was the first iPhone released?",
    options: ["2005", "2006", "2007", "2008"],
    correct: 2
  },
  {
    question: "What is the chemical symbol for gold?",
    options: ["Go", "Gd", "Au", "Ag"],
    correct: 2
  },
  {
    question: "Which country invented pizza?",
    options: ["France", "Italy", "Greece", "USA"],
    correct: 1
  }
];

// HELPER FUNCTION: Shuffle array (Fisher-Yates)
window.shuffleArray = function(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

// HELPER FUNCTION: Get shuffled questions with shuffled options
window.getShuffledQuestions = function() {
  // First, shuffle the questions order
  let shuffled = window.shuffleArray([...window.questionBank]);
  
  // Then for each question, shuffle its options BUT track the correct answer
  return shuffled.map(q => {
    // Create array of options with their original indices
    const optionsWithIndex = q.options.map((opt, idx) => ({
      text: opt,
      originalIndex: idx
    }));
    
    // Shuffle the options
    const shuffledOptions = window.shuffleArray([...optionsWithIndex]);
    
    // Find where the correct answer moved to
    const newCorrectIndex = shuffledOptions.findIndex(
      opt => opt.originalIndex === q.correct
    );
    
    // Return new question with shuffled options and updated correct index
    return {
      question: q.question,
      options: shuffledOptions.map(opt => opt.text),
      correct: newCorrectIndex
    };
  });
};