<<<<<<< HEAD
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const path = require('path');
const authenticateToken = require('./middleware/auth');

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

mongoose.connect('mongodb://localhost:27017/quiz-platform')
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('MongoDB connection error:', err));
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});

const quizSchema = new mongoose.Schema({
  title: { type: String, required: true },
  questions: [{
    question: { type: String, required: true },
    answers: { type: [String], required: true },
    correct: { type: Number, required: true }
  }]
});

const resultSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  quiz: { type: mongoose.Schema.Types.ObjectId, ref: 'Quiz', required: true },
  score: { type: Number, required: true }
});

const User = mongoose.model('User', userSchema);
const Quiz = mongoose.model('Quiz', quizSchema);
const Result = mongoose.model('Result', resultSchema);

app.get('/', (req, res) => {
  res.send('Hello, world!');
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

app.post('/register', async (req, res) => {
  const hashedPassword = await bcrypt.hash(req.body.password, 10);
  const user = new User({ username: req.body.username, password: hashedPassword });
  await user.save();
  res.status(201).json(user);
});

app.post('/login', async (req, res) => {
  const user = await User.findOne({ username: req.body.username });
  if (user && await bcrypt.compare(req.body.password, user.password)) {
    const token = jwt.sign({ id: user._id }, 'secretkey');
    res.json({ token });
  } else {
    res.status(401).send('Invalid credentials');
  }
});

app.get('/quizzes', async (req, res) => {
  const quizzes = await Quiz.find();
  res.json(quizzes);
});

app.post('/quizzes', authenticateToken, async (req, res) => {
  try {
    const quiz = new Quiz(req.body);
    await quiz.save();
    res.status(201).json(quiz);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/submit', authenticateToken, async (req, res) => {
  try {
    const { userId, quizId, answers } = req.body;
    const quiz = await Quiz.findById(quizId);
    let score = 0;

    quiz.questions.forEach((question, index) => {
      if (question.correct === answers[index]) {
        score++;
      }
    });

    const result = new Result({
      user: userId,
      quiz: quizId,
      score: score
    });

    await result.save();
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

app.delete('/quizzes/:id', authenticateToken, async (req, res) => {
  try {
      const quiz = await Quiz.findByIdAndDelete(req.params.id);
      if (!quiz) {
          return res.status(404).json({ message: 'Quiz not found' });
      }
      res.status(200).json({ message: 'Quiz deleted successfully' });
  } catch (error) {
      res.status(500).json({ error: error.message });
  }
});
=======
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const path = require('path');
const authenticateToken = require('./middleware/auth');

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

mongoose.connect('mongodb://localhost:27017/quiz-platform')
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('MongoDB connection error:', err));
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});

const quizSchema = new mongoose.Schema({
  title: { type: String, required: true },
  questions: [{
    question: { type: String, required: true },
    answers: { type: [String], required: true },
    correct: { type: Number, required: true }
  }]
});

const resultSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  quiz: { type: mongoose.Schema.Types.ObjectId, ref: 'Quiz', required: true },
  score: { type: Number, required: true }
});

const User = mongoose.model('User', userSchema);
const Quiz = mongoose.model('Quiz', quizSchema);
const Result = mongoose.model('Result', resultSchema);

app.get('/', (req, res) => {
  res.send('Hello, world!');
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

app.post('/register', async (req, res) => {
  const hashedPassword = await bcrypt.hash(req.body.password, 10);
  const user = new User({ username: req.body.username, password: hashedPassword });
  await user.save();
  res.status(201).json(user);
});

app.post('/login', async (req, res) => {
  const user = await User.findOne({ username: req.body.username });
  if (user && await bcrypt.compare(req.body.password, user.password)) {
    const token = jwt.sign({ id: user._id }, 'secretkey');
    res.json({ token });
  } else {
    res.status(401).send('Invalid credentials');
  }
});

app.get('/quizzes', async (req, res) => {
  const quizzes = await Quiz.find();
  res.json(quizzes);
});

app.post('/quizzes', authenticateToken, async (req, res) => {
  try {
    const quiz = new Quiz(req.body);
    await quiz.save();
    res.status(201).json(quiz);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/submit', authenticateToken, async (req, res) => {
  try {
    const { userId, quizId, answers } = req.body;
    const quiz = await Quiz.findById(quizId);
    let score = 0;

    quiz.questions.forEach((question, index) => {
      if (question.correct === answers[index]) {
        score++;
      }
    });

    const result = new Result({
      user: userId,
      quiz: quizId,
      score: score
    });

    await result.save();
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

app.delete('/quizzes/:id', authenticateToken, async (req, res) => {
  try {
      const quiz = await Quiz.findByIdAndDelete(req.params.id);
      if (!quiz) {
          return res.status(404).json({ message: 'Quiz not found' });
      }
      res.status(200).json({ message: 'Quiz deleted successfully' });
  } catch (error) {
      res.status(500).json({ error: error.message });
  }
});
>>>>>>> bf1eeb5c1175df2d85ba22d8cee30871d3dbfc3f
