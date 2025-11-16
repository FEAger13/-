const axios = require('axios');

// URL для пинга из UptimeRobot
const urls = [
  process.env.UPTIMEROBOT_URL,
  // Добавьте дополнительные URL если нужно
];

async function pingAll() {
  console.log('🏓 Начинаю пинг сервисов...');
  
  for (const url of urls) {
    if (!url) continue;
    
    try {
      const response = await axios.get(url);
      console.log(`✅ ${url}: ${response.status} ${response.statusText}`);
    } catch (error) {
      console.error(`❌ ${url}: ${error.message}`);
    }
  }
  
  console.log('🏓 Пинг завершен');
}

// Запускаем пинг
pingAll();
