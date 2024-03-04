// Injecting enviroument 
require('dotenv').config();

// Changing max listeners for node
require('events').EventEmitter.defaultMaxListeners = 0;

// Creating NodeMailerOutlook
var nodeoutlook = require('nodejs-nodemailer-outlook')

// Creating Express
const express = require('express')

// Creating Cors for prevent issues with crossdomain requests
const cors = require('cors')

// Create Express App
const app = express()

// Creating telegram api const
const TelegramBot = require('node-telegram-bot-api');

// Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot(process.env.BOT_TOKEN, {polling: true});

// WebApp URL
const webAppURL = 'https://greenpatobot.netlify.app'

app.use(express.json())
app.use(cors())

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

                // Customer contacts data
              const text = `Имя покупателя: ${data?.name}\n Телефон покупателя: ${data?.phone}\n Адрес покупателя: ${data?.street}`

              // Sending order information on e-mail
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

              await bot.sendMessage(chatId, 'Ваши контактные данные отправлены')

            }, 3000)

            //  Set timeout before send next message
            // setTimeout(async () => {
            //     await bot.sendMessage(chatId, 'Ваши контактные данные отправлены'); 
            // }, 2000)
            
        } catch (e) {
           console.log(e)
        }
    }
    
})

app.post('/web-data', async (req, res) => {
    const {queryId, products = [], totalPrice} = req.body
    try {
        await bot.answerWebAppQuery(queryId, {
            type: 'article',
            id: queryId,
            title: 'Успешная покупка',
            input_message_content: {
                message_text: ` Поздравляю с покупкой, вы приобрели товар на сумму ${totalPrice}, ${products.map(item => item.title).join(', ')}`
            }

        })
        return res.status(200).json({}) 
    } catch (e) {
        return res.status(500).json({})
    }

})

// Launch server
const PORT = 8000
app.listen(PORT, () => console.log('Server starded on PORT ' + PORT))