document.addEventListener('DOMContentLoaded', () => {
  const quizContainer = document.getElementById('quiz-container');
  const submitButton = document.getElementById('submit');

  // Fetch quiz data from server
  async function fetchQuizzes() {
    const response = await fetch('http://localhost:3000/quizzes');
    const quizzes = await response.json();
    return quizzes;
  }

  function renderQuiz(quizData) {
    quizContainer.innerHTML = '';
    quizData.forEach((quizItem, index) => {
      const questionElement = document.createElement('div');
      questionElement.classList.add('question');
      questionElement.innerHTML = `<p>${quizItem.question}</p>`;
      quizItem.answers.forEach((answer, answerIndex) => {
        const answerElement = document.createElement('label');
        answerElement.classList.add('answer');
        answerElement.innerHTML = `
          <input type="radio" name="question${index}" value="${answerIndex}">
          ${answer}
        `;
        questionElement.appendChild(answerElement);
      });
      quizContainer.appendChild(questionElement);
    });
  }

  async function submitQuiz() {
    const answers = document.querySelectorAll('input[type="radio"]:checked');
    const userId = 'some-user-id'; // Replace with actual user ID
    const quizId = 'some-quiz-id'; // Replace with actual quiz ID

    let userAnswers = [];
    answers.forEach(answer => {
      userAnswers.push(parseInt(answer.value));
    });

    const response = await fetch('http://localhost:3000/submit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ userId, quizId, answers: userAnswers })
    });

    const result = await response.json();
    alert(`Your score is ${result.score}`);
  }

  submitButton.addEventListener('click', submitQuiz);

  fetchQuizzes().then(renderQuiz);
});
