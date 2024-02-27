require('dotenv').config()

// Changing max listeners for node
require('events').EventEmitter.defaultMaxListeners = 0;

// Creating telegram api const
const TelegramBot = require('node-telegram-bot-api');

// Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot(process.env.BOT_TOKEN, {polling: true});

// WebApp URL
const webAppURL = 'https://greenpatobot.netlify.app'

bot.on('message', async (msg) => {
    // Access to chat Id
    const chatId = msg.chat.id
    const text = msg.text

    
    if (text === '/start') {
       // Markup keyboard "Feedback form"
       await bot.sendMessage(chatId, 'Ниже появится кнопка, заполни форму обратной связи', {
        reply_markup: {
            keyboard: [
                [{text: 'Заполнить форму обратной связи', web_app: {url: webAppURL + '/form'}}]
            ]
        }
       })
       
       // Inline keyboard "Make order"
       await bot.sendMessage(chatId, 'Сделать заказ', {
        reply_markup: {
            inline_keyboard: [
                [{text: 'Сделать заказ', web_app: {url: webAppURL}}]
            ]
        }
       })

    }

    // Send message to the chat 
    bot.sendMessage(chatId, 'recived your message')
})
