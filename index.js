const TelegramBot = require('node-telegram-bot-api');
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

// Получаем токен бота из переменных окружения
const token = process.env.BOT_TOKEN;

// Проверяем наличие токена
if (!token) {
  console.error('❌ ОШИБКА: BOT_TOKEN не установлен!');
  process.exit(1);
}

// Создаем экземпляр бота с polling
const bot = new TelegramBot(token, { 
  polling: true 
});

// Веб-сервер для Render
app.get('/', (req, res) => {
  res.send('🤖 Telegram ID Bot работает!');
});

// Запускаем веб-сервер
app.listen(PORT, () => {
  console.log(`🚀 Сервер запущен на порту ${PORT}`);
});

console.log('✅ Бот запущен и работает!');

// Обработчик команды /start
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  const userName = msg.from.first_name || 'Пользователь';
  
  const welcomeText = `👋 Привет, ${userName}!

🤖 Я бот для показа ID пользователей.

💡 Просто отправьте любое сообщение, и я покажу ваш ID.

📊 Команды:
/id - показать ваш ID
/chatid - показать ID чата
/help - помощь

⚡ Бот хостится на Render`;

  bot.sendMessage(chatId, welcomeText);
});

// Обработчик команды /id
bot.onText(/\/id/, (msg) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id;
  const userName = msg.from.first_name || 'Пользователь';

  const response = `👤 <b>Информация о пользователе:</b>

🆔 <b>User ID:</b> <code>${userId}</code>
👁 <b>Имя:</b> ${userName}
💬 <b>Chat ID:</b> <code>${chatId}</code>`;

  bot.sendMessage(chatId, response, { parse_mode: 'HTML' });
});

// Обработчик ЛЮБОГО сообщения
bot.on('message', (msg) => {
  // Игнорируем команды
  if (msg.text && msg.text.startsWith('/')) {
    return;
  }

  const chatId = msg.chat.id;
  const userId = msg.from.id;
  const userName = msg.from.first_name || 'Пользователь';

  const response = `👤 ${userName}, ваш ID: <code>${userId}</code>`;
  
  bot.sendMessage(chatId, response, { parse_mode: 'HTML' });
});

// Обработчики ошибок
bot.on('error', (error) => {
  console.error('❌ Ошибка бота:', error);
});

console.log('✅ Бот успешно запущен и ожидает сообщений...');
