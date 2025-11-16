const TelegramBot = require('node-telegram-bot-api');

// Получаем токен бота из переменных окружения
const token = process.env.BOT_TOKEN;

// Проверяем наличие токена
if (!token) {
  console.error('❌ ОШИБКА: BOT_TOKEN не установлен!');
  process.exit(1);
}

// Создаем экземпляр бота
const bot = new TelegramBot(token, { 
  polling: true 
});

console.log('🚀 Бот запущен и работает!');

// Обработчик команды /start
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  const welcomeText = `👋 Привет! Я бот для показа ID.\n\nОтправь любое сообщение, и я покажу твой ID!`;
  bot.sendMessage(chatId, welcomeText);
});

// Обработчик ЛЮБОГО сообщения
bot.on('message', (msg) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id;
  const userName = msg.from.first_name || 'Пользователь';

  const response = `👤 ${userName}, ваш ID: ${userId}\n💬 ID чата: ${chatId}`;
  
  bot.sendMessage(chatId, response);
});

console.log('✅ Бот готов к работе!');
