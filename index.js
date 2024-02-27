require('dotenv').config()

const TelegramBot = require('node-telegram-bot-api');

// Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot(token, {polling: true});

bot.on('message', (msg) => {
    // Access to chat Id
    const chatId = msg.chatId

    // Send message to the chat 
    bot.sendMessage(chatId, 'recived your message')
})
