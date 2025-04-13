let currentQuestion = 0;
let score = 0;
let questions = [];
let timerDuration = 150;
let timerInterval;


const titleMusic = document.getElementById("title-music");
const gameMusic = document.getElementById("game-music");
const endMusic = document.getElementById("end-music");


function playTitleMusic() {
  titleMusic.play();
}


function playGameMusic() {
  titleMusic.pause();
  gameMusic.play();
}


function playEndMusic() {
  gameMusic.pause(); 
  endMusic.play();
}


async function prepareQuiz() {
  const response = await fetch('questions.json');
  questions = await response.json();
  

  shuffleQuestions();
}

prepareQuiz();


function shuffleQuestions() {
  for (let i = questions.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [questions[i], questions[j]] = [questions[j], questions[i]]; 
  }
}


function startQuiz() {
  document.getElementById("start-screen").style.display = "none";
  document.getElementById("quiz-container").style.display = "block";
  document.getElementById("timer").style.display = "block";
  document.getElementById("remaining-questions").style.display = "block";

  playGameMusic();
  startTimer();
  showQuestion();
  updateRemainingQuestions();
}

document.getElementById("start-btn").addEventListener("click", async () => {
  await prepareQuiz();
  startQuiz();
});

function startTimer() {
  updateTimerDisplay(timerDuration);
  timerInterval = setInterval(() => {
    timerDuration--;
    updateTimerDisplay(timerDuration);

    if (timerDuration <= 0) {
      clearInterval(timerInterval);
      endQuiz();
    }
  }, 1000);
}

function updateTimerDisplay(seconds) {
  const min = Math.floor(seconds / 60);
  const sec = seconds % 60;
  document.getElementById("timer").textContent = `${min}:${sec < 10 ? '0' : ''}${sec}`;
}

function showQuestion() {
  const q = questions[currentQuestion];
  document.getElementById("question").textContent = q.question;

  const optionsContainer = document.getElementById("options");
  optionsContainer.innerHTML = "";

  q.options.forEach(option => {
    const btn = document.createElement("button");
    btn.textContent = option;
    btn.addEventListener("click", () => selectAnswer(btn, q.answer));
    optionsContainer.appendChild(btn);
  });

  updateRemainingQuestions();
}


function updateRemainingQuestions() {
  const remainingQuestions = questions.length - currentQuestion - 1;
  document.getElementById("remaining-questions").textContent = `Kalan Sorular: ${remainingQuestions}`;
}

function selectAnswer(button, correctAnswer) {
  const buttons = document.querySelectorAll("#options button");
  buttons.forEach(btn => {
    btn.disabled = true;
    if (btn.textContent === correctAnswer) {
      btn.classList.add("correct");
    } else {
      btn.classList.add("wrong");
    }
  });

  if (button.textContent === correctAnswer) {
    score++;
  }
}

document.getElementById("next-btn").addEventListener("click", () => {
  currentQuestion++;
  if (currentQuestion < questions.length) {
    showQuestion();
  } else {
    endQuiz();
  }
});

function endQuiz() {
  clearInterval(timerInterval);
  document.getElementById("quiz-container").style.display = "none";
  document.getElementById("end-screen").style.display = "block";
  document.getElementById("final-score").textContent = `Puanın: ${score}/${questions.length}`;

  if (timerDuration <= 0) {
    document.getElementById("final-message").textContent = "Süre doldu";
  } else {
    document.getElementById("final-message").textContent = "Tüm soruları çözdün";
  }

  playEndMusic();
}


function toggleMusic() {
  if (titleMusic.paused && gameMusic.paused && endMusic.paused) {
    gameMusic.play();
  } else {
    titleMusic.pause();
    gameMusic.pause();
    endMusic.pause();
  }
}

function retryQuiz() {
  location.reload();
}
