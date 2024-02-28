// Injecting enviroument 
require('dotenv').config();

// Changing max listeners for node
require('events').EventEmitter.defaultMaxListeners = 0;

// Creating NodeMailerOutlook
var nodeoutlook = require('nodejs-nodemailer-outlook')

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
       await bot.sendMessage(chatId, 'Чтобы сделать заказ, заполни форму обратной связи и выбери товары', {
        reply_markup: {
            keyboard: [
                [{text: 'Выбрать товары', web_app: {url: webAppURL}}],
                [{text: 'Заполнить форму обратной связи', web_app: {url: webAppURL + '/form'}}]
            ]
        }
       })
       
       // Inline keyboard "Make order"
       await bot.sendMessage(chatId, 'Чтобы выбрать товары нажми кнопку', {
        reply_markup: {
            inline_keyboard: [
                [{text: 'Выбрать товары', web_app: {url: webAppURL}}]
            ]
        }
       })

    }

    // Getting Contact info (Lead) 
    if (msg?.web_app_data?.data) {
        try {
        const data = JSON.parse(msg?.web_app_data.data)
        //console.log(data)
        await bot.sendMessage(chatId, `Спасибо ${data?.name}, контактные данные получены`)
        await bot.sendMessage(chatId, 'Ваш адрес: ' + data?.street)
        await bot.sendMessage(chatId, 'Ваш номер телефона: ' + data?.phone)

        // Example:  Set timeout before send next message
            // setTimeout(async () => {
            //     await bot.sendMessage(chatId, 'Всю информацию вы получите в этом чате'); 
            // }, 3000)

            setTimeout(async () => {
              const text = `Имя покупателя: ${data?.name}\n Телефон покупателя: ${data?.phone}\n Адрес покупателя: ${data?.street}`
              nodeoutlook.sendEmail({
                auth: {
                    user: process.env.MAIL_ACCOUNT,
                    pass: process.env.MAIL_PASSWORD
                },
                from: process.env.MAIL_ACCOUNT,
                to: 'dinavl@bk.ru',
                subject: `Новый покупатель ${data?.name}, телефон ${data?.phone} `,
                text: `Контакты нового покупателя:\n ${text}`,
                //onError: (e) => console.log(e),
                //onSuccess: (i) => console.log(i)
              })
            }, 3000)
            
        } catch (e) {
           console.log(e)
        }
    }
    
})
