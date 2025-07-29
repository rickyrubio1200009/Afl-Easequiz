let questions = [];
let currentQuestion = 0;
let score = 0;
let timer;
let timeLeft = 15;

const queryParams = new URLSearchParams(window.location.search);
const mode = queryParams.get('mode');

function loadQuestions() {
  let script = document.createElement('script');
  let src = '';

  if (!mode) {
    alert('No quiz mode specified');
    return;
  }

  if (mode.startsWith('clubs/')) {
    let clubName = mode.split('/')[1];
    src = `js/clubs/${clubName}.js`;
  } else {
    src = `js/questions-${mode}.js`;
  }

  script.src = src;
  script.onload = () => {
    if (!questions || questions.length === 0) {
      alert('No questions found for this quiz.');
      return;
    }
    questions = shuffle(questions).slice(0, 200);
    showQuestion();
    startTimer();
  };
  script.onerror = () => alert('Failed to load questions file: ' + src);
  document.body.appendChild(script);
}

function shuffle(array) {
  return array.sort(() => Math.random() - 0.5);
}

function showQuestion() {
  document.body.innerHTML = `
    <h2>${questions[currentQuestion].question}</h2>
    <input type="text" id="answer" />
    <button onclick="submitAnswer()">Submit</button>
    <p>Time left: <span id="timer">${timeLeft}</span>s</p>
    <p>Score: ${score}</p>
  `;
}

function startTimer() {
  timeLeft = 15;
  document.getElementById("timer").textContent = timeLeft;
  clearInterval(timer);
  timer = setInterval(() => {
    timeLeft--;
    document.getElementById("timer").textContent = timeLeft;
    if (timeLeft <= 0) {
      clearInterval(timer);
      wrongAnswer();
    }
  }, 1000);
}

function submitAnswer() {
  const answer = document.getElementById("answer").value.trim().toLowerCase();
  const correct = questions[currentQuestion].answer.trim().toLowerCase();

  if (answer === correct) {
    score++;
    currentQuestion++;
    if (currentQuestion >= questions.length) {
      alert("Quiz complete!");
      window.location.href = "index.html";
    } else {
      showQuestion();
      startTimer();
    }
  } else {
    wrongAnswer();
  }
}

function wrongAnswer() {
  alert("Incorrect. Restarting quiz...");
  window.location.href = "quiz.html?mode=" + mode;
}

window.onload = loadQuestions;
