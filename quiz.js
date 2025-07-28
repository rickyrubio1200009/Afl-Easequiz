let questions = [];
let score = 0;
let timer;
let currentIndex = 0;
let timeLeft = 15;

const queryParams = new URLSearchParams(window.location.search);
const mode = queryParams.get('mode');

function loadQuestions() {
  let script = document.createElement('script');
  script.src = `js/questions-${mode}.js`;
  script.onload = () => {
    questions = shuffle(questions).slice(0, 200);
    showQuestion();
    startTimer();
  };
  document.body.appendChild(script);
}

function shuffle(array) {
  return array.sort(() => Math.random() - 0.5);
}

function showQuestion() {
  if (currentIndex >= questions.length) {
    window.location.href = 'done.html';
    return;
  }
  document.getElementById('question-box').innerText = questions[currentIndex].question;
  document.getElementById('answer').value = '';
}

function submitAnswer() {
  const userAnswer = document.getElementById('answer').value.trim().toLowerCase();
  const correct = questions[currentIndex].answer.toLowerCase();

  if (userAnswer === correct) {
    document.body.style.backgroundColor = 'lightgreen';
    score++;
    document.getElementById('score').innerText = `Score: ${score}`;
    setTimeout(() => {
      document.body.style.backgroundColor = '';
      currentIndex++;
      timeLeft = 15;
      showQuestion();
    }, 500);
  } else {
    document.body.style.backgroundColor = 'red';
    setTimeout(() => {
      document.body.style.backgroundColor = '';
      location.reload();
    }, 1000);
  }
}

function startTimer() {
  timer = setInterval(() => {
    timeLeft--;
    document.getElementById('timer').innerText = timeLeft;
    if (timeLeft <= 0) {
      clearInterval(timer);
      submitAnswer(); // auto-fail if time runs out
    }
  }, 1000);
}

window.onload = loadQuestions;