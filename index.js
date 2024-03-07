// Injecting enviroument 
require('dotenv').config();

// Changing max listeners for node
require('events').EventEmitter.defaultMaxListeners = 0;

// Creating telegram api const
const TelegramBot = require('node-telegram-bot-api');

// Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot(process.env.BOT_TOKEN, {polling: true});

// Web URL
const webAppURL = 'https://greenpatobot.netlify.app'

bot.on('message', async (msg) => {
    // Access to chat Id
    const chatId = msg.chat.id
    const text = msg.text


    // Getting Contact info (Lead) 
    if (msg?.web_app_data?.data) {
        try {
        const data = JSON.parse(msg?.web_app_data.data)
        console.log(data)

        // await bot.sendMessage(chatId, `Спасибо ${data?.name}, контактные данные получены`)
        // await bot.sendMessage(chatId, 'Ваш адрес: ' + data?.street)
        // await bot.sendMessage(chatId, 'Ваш номер телефона: ' + data?.phone)
    } catch (e) {
        console.log(e)
     }
 }

    if (text === '/start') {
      // Greeting message + show button
      await bot.sendMessage(chatId, 'Чтобы сделать заказ нажми кнопку', {
            reply_markup: {
                keyboard: [
                    [{text: 'Купить товар', web_app: {url: webAppURL}}],
                    [{text: 'Отправить форму', web_app: {url: webAppURL + '/form'}}]
                ]  
            }
      })
    }

})
