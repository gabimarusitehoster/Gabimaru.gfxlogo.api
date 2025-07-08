
const express = require('express');
const fs = require('fs');
const path = require('path');
const session = require('express-session');
const app = express();

const PORT = process.env.PORT || 3000;

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(session({
  secret: 'viperxsecret',
  resave: false,
  saveUninitialized: true
}));

const USERS_FILE = path.join(__dirname, 'users.json');

function readUsers() {
  if (!fs.existsSync(USERS_FILE)) return {};
  return JSON.parse(fs.readFileSync(USERS_FILE, 'utf8'));
}

function isExpired(dateStr) {
  return new Date(dateStr) < new Date();
}

// Middleware to protect dashboard
function requireLogin(req, res, next) {
  if (req.session.loggedIn) return next();
  res.redirect('/');
}

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

app.post('/login', (req, res) => {
  const { username, passkey } = req.body;
  const users = readUsers();

  const user = users[username];
  if (!user) return res.send('❌ Invalid username.');
  if (user.passkey !== passkey) return res.send('❌ Incorrect passkey.');
  if (isExpired(user.expires)) return res.send('⏳ Access expired.');

  req.session.loggedIn = true;
  req.session.username = username;
  res.redirect('/dashboard');
});

app.get('/dashboard', requireLogin, (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'dashboard.html'));
});

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});