const TelegramBot = require('node-telegram-bot-api');
const fs = require('fs');
const path = require('path');

const TOKEN = '7760539426:AAGYMP2NfdwaQpvXLSHYYPWsg0cnOCdkqlE';
const AUTHORIZED_ID = 8025716898;

const bot = new TelegramBot(TOKEN, { polling: true });
const USERS_FILE = path.join(__dirname, 'users.json');

function readUsers() {
  if (!fs.existsSync(USERS_FILE)) return {};
  return JSON.parse(fs.readFileSync(USERS_FILE, 'utf8'));
}

function writeUsers(users) {
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
}

function generatePasskey(length = 4) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let pass = '';
  for (let i = 0; i < length; i++) {
    pass += chars[Math.floor(Math.random() * chars.length)];
  }
  return pass;
}

// ✅ Create user
bot.onText(/^\/createuser (\w{8}) (\d+)$/, (msg, match) => {
  if (msg.from.id !== AUTHORIZED_ID) return;

  const username = match[1];
  const months = parseInt(match[2]);
  const users = readUsers();

  if (users[username]) {
    return bot.sendMessage(msg.chat.id, '⚠️ User already exists.');
  }

  const passkey = generatePasskey();
  const expires = new Date();
  expires.setMonth(expires.getMonth() + months);

  users[username] = {
    passkey,
    expires: expires.toISOString()
  };

  writeUsers(users);

  bot.sendMessage(
    msg.chat.id,
    `✅ User Created\n👤 Username: ${username}\n🔑 Passkey: ${passkey}\n⏳ Expires: ${expires.toDateString()}`
  );
});

// ✅ /list
bot.onText(/^\/list$/, (msg) => {
  if (msg.from.id !== AUTHORIZED_ID) return;

  const users = readUsers();
  const entries = Object.entries(users);

  if (entries.length === 0) {
    return bot.sendMessage(msg.chat.id, '📭 No active users found.');
  }

  let response = `📋 *Active Users (${entries.length})*\n\n`;

  for (const [username, data] of entries) {
    const expDate = new Date(data.expires);
    const status = new Date() > expDate ? '❌ Expired' : '✅ Active';
    response += `👤 ${username} — ${expDate.toDateString()} (${status})\n`;
  }

  bot.sendMessage(msg.chat.id, response, { parse_mode: 'Markdown' });
});

// ✅ /checkexp <username>
bot.onText(/^\/checkexp (\w{8})$/, (msg, match) => {
  if (msg.from.id !== AUTHORIZED_ID) return;

  const username = match[1];
  const users = readUsers();
  const user = users[username];

  if (!user) return bot.sendMessage(msg.chat.id, '❌ User not found.');

  const exp = new Date(user.expires);
  const now = new Date();
  const diff = Math.ceil((exp - now) / (1000 * 60 * 60 * 24)); // in days

  if (diff <= 0) {
    bot.sendMessage(msg.chat.id, `⏳ ${username} has *expired* on ${exp.toDateString()}.`, { parse_mode: 'Markdown' });
  } else {
    bot.sendMessage(msg.chat.id, `✅ ${username} expires in *${diff} day(s)* (${exp.toDateString()}).`, { parse_mode: 'Markdown' });
  }
});

// ✅ /delete <username>
bot.onText(/^\/delete (\w{8})$/, (msg, match) => {
  if (msg.from.id !== AUTHORIZED_ID) return;

  const username = match[1];
  const users = readUsers();

  if (!users[username]) {
    return bot.sendMessage(msg.chat.id, '❌ User not found.');
  }

  delete users[username];
  writeUsers(users);

  bot.sendMessage(msg.chat.id, `🗑️ User *${username}* deleted.`, { parse_mode: 'Markdown' });
});