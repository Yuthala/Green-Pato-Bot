// Injecting enviroument 
require('dotenv').config();

const express = require('express');

const cors = require('cors');

// Changing max listeners for node
require('events').EventEmitter.defaultMaxListeners = 0;

// Creating telegram api const
const TelegramBot = require('node-telegram-bot-api');

// Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot(process.env.BOT_TOKEN, {polling: true});

// Web URL 
const webAppURL = 'https://greenpatobot.netlify.app'

const app = express();

app.use(express.json());
app.use(cors());

bot.on('message', async (msg) => {
    // Access to chat Id
    const chatId = msg.chat.id
    const text = msg.text


    // Getting Contact info (Lead) 
    if (msg?.web_app_data?.data) {
        try {
        const data = JSON.parse(msg?.web_app_data.data)
        console.log(`Данные из формы обратной связи ${data}`)
        //console.log(data.orderCartData.totalPrice)
            
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


app.post('/web-data', async (request, response) => {
    //if(!request.body) return response.sendStatus(400);
    //const data = JSON.parse(request)
    console.log(`Данные post запрос ${request.body.products}`)
    //response.send(request.body)

    const {queryId, products = [], totalPrice} = request.body;
    
    try {
        await bot.answerWebAppQuery(queryId, {
            type: 'article',
            id: request.body.queryId,
            title: 'Успешная покупка',
            input_message_content: {
                message_text: ` Поздравляю с покупкой, вы приобрели товар на сумму ${request.body.totalPrice}, ${request.body.products.map(item => item.title).join(', ')}`
            }
        })
        
        return response.status(200).json({});
    } catch (e) {
        return response.status(500).json({})
    }
})

const PORT = 8000;

app.listen(PORT, () => console.log('server started on PORT ' + PORT))
