const TelegramBot = require('node-telegram-bot-api');
const axios = require('axios');

// Получаем токен бота из переменных окружения
const token = process.env.BOT_TOKEN;
const uptimeRobotUrl = process.env.UPTIMEROBOT_URL;

// Проверяем наличие токена
if (!token) {
  console.error('❌ ОШИБКА: BOT_TOKEN не установлен!');
  console.log('📝 Как получить токен:');
  console.log('1. Напишите @BotFather в Telegram');
  console.log('2. Отправьте команду /newbot');
  console.log('3. Введите имя бота');
  console.log('4. Получите токен и установите его в переменную BOT_TOKEN на Render');
  process.exit(1);
}

// Создаем экземпляр бота
const bot = new TelegramBot(token, { 
  polling: true 
});

console.log('🚀 Бот запускается...');
console.log('📝 Токен бота:', token ? '✅ Установлен' : '❌ Отсутствует');

// Функция для отправки heartbeat на UptimeRobot
async function sendHeartbeat() {
  if (!uptimeRobotUrl) {
    console.log('⚠️ UPTIMEROBOT_URL не установлен, пинги отключены');
    return;
  }

  try {
    await axios.get(uptimeRobotUrl);
    console.log('❤️ Heartbeat отправлен в UptimeRobot:', new Date().toISOString());
  } catch (error) {
    console.error('❌ Ошибка отправки heartbeat:', error.message);
  }
}

// Отправляем heartbeat каждые 5 минут
setInterval(sendHeartbeat, 5 * 60 * 1000);

// Обработчик команды /start
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  const userName = msg.from.first_name || 'Пользователь';
  
  const welcomeText = `👋 Привет, ${userName}!

🤖 Я бот для показа ID пользователей.

💡 Просто отправьте любое сообщение, и я покажу ваш ID.

📊 Также доступны команды:
/id - показать ваш ID
/chatid - показать ID чата
/help - помощь

⚡ Бот хостится на Render с мониторингом UptimeRobot`;

  bot.sendMessage(chatId, welcomeText);
});

// Обработчик команды /help
bot.onText(/\/help/, (msg) => {
  const chatId = msg.chat.id;
  
  const helpText = `📖 Справка по боту:

💡 Этот бот показывает идентификаторы (ID) в Telegram.

🔹 Просто отправьте любое сообщение - бот ответит с вашим ID
🔹 Команда /id - показать ваш пользовательский ID
🔹 Команда /chatid - показать ID текущего чата
🔹 Команда /help - эта справка

🆔 User ID - это уникальный номер вашего аккаунта в Telegram
💬 Chat ID - это уникальный номер текущего чата/диалога`;

  bot.sendMessage(chatId, helpText);
});

// Обработчик команды /id
bot.onText(/\/id/, (msg) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id;
  const userName = msg.from.first_name || 'Пользователь';
  const username = msg.from.username ? `(@${msg.from.username})` : '';

  const response = `👤 <b>Информация о пользователе:</b>

🆔 <b>User ID:</b> <code>${userId}</code>
👁 <b>Имя:</b> ${userName} ${username}
💬 <b>Chat ID:</b> <code>${chatId}</code>`;

  bot.sendMessage(chatId, response, { parse_mode: 'HTML' });
});

// Обработчик команды /chatid
bot.onText(/\/chatid/, (msg) => {
  const chatId = msg.chat.id;
  const chatType = msg.chat.type === 'private' ? 'личный чат' : 'групповой чат';

  const response = `💬 <b>Информация о чате:</b>

🆔 <b>Chat ID:</b> <code>${chatId}</code>
📋 <b>Тип чата:</b> ${chatType}`;

  bot.sendMessage(chatId, response, { parse_mode: 'HTML' });
});

// Обработчик ЛЮБОГО сообщения
bot.on('message', (msg) => {
  // Игнорируем команды, которые уже обработаны
  if (msg.text && msg.text.startsWith('/')) {
    return;
  }

  const chatId = msg.chat.id;
  const userId = msg.from.id;
  const userName = msg.from.first_name || 'Пользователь';
  const username = msg.from.username ? `(@${msg.from.username})` : '';

  const response = `👤 <b>Информация о пользователе:</b>

🆔 <b>User ID:</b> <code>${userId}</code>
👁 <b>Имя:</b> ${userName} ${username}
💬 <b>Chat ID:</b> <code>${chatId}</code>

💡 Для полного списка команд используйте /help`;

  bot.sendMessage(chatId, response, { parse_mode: 'HTML' });
});

// Обработчики ошибок
bot.on('error', (error) => {
  console.error('❌ Ошибка бота:', error);
});

bot.on('polling_error', (error) => {
  console.error('❌ Ошибка polling:', error);
});

console.log('✅ Бот успешно запущен и ожидает сообщений...');
console.log('⏰ Heartbeat мониторинг активирован');

// Отправляем первый heartbeat при запуске
sendHeartbeat();
