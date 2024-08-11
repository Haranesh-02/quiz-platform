document.addEventListener('DOMContentLoaded', () => {
  const quizForm = document.getElementById('quizForm');
  const quizTitle = document.getElementById('quizTitle');
  const quizQuestions = document.getElementById('quizQuestions');
  const quizList = document.getElementById('quizList');

  // Fetch and display quizzes
  function loadQuizzes() {
      fetch('/quizzes')
          .then(response => response.json())
          .then(quizzes => {
              quizList.innerHTML = '';
              quizzes.forEach(quiz => {
                  const quizItem = document.createElement('div');
                  quizItem.classList.add('quiz-item');
                  quizItem.innerHTML = `
                      <h3>${quiz.title}</h3>
                      <button onclick="deleteQuiz('${quiz._id}')">Delete</button>
                  `;
                  quizList.appendChild(quizItem);
              });
          });
  }

  // Handle form submission
  quizForm.addEventListener('submit', (event) => {
      event.preventDefault();
      const questions = quizQuestions.value.split('\n').map(line => {
          const [question, answers, correct] = line.split('|');
          return {
              question: question.trim(),
              answers: answers.trim().split(',').map(answer => answer.trim()),
              correct: parseInt(correct.trim())
          };
      });

      fetch('/quizzes', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json'
          },
          body: JSON.stringify({
              title: quizTitle.value,
              questions: questions
          })
      })
      .then(response => response.json())
      .then(() => {
          quizTitle.value = '';
          quizQuestions.value = '';
          loadQuizzes();
      });
  });

  // Delete quiz
  window.deleteQuiz = (quizId) => {
      fetch(`/quizzes/${quizId}`, {
          method: 'DELETE'
      })
      .then(() => {
          loadQuizzes();
      });
  };

  // Initial load of quizzes
  loadQuizzes();
});
