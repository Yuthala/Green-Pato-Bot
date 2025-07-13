//TO DO:

//3. найти как присваивать номера заказов 
//5. После того как пользователь сделал заказ, разорвать сессию
//6. Добавить пункт меню Написать сообщение
//8. Поместить кнопку Сделать Заказ в самый верх поля кнопок

// Injecting enviroument 
require('dotenv').config();

// Creating NodeMailerOutlook
//var nodeoutlook = require('nodejs-nodemailer-outlook')

// mailer
const nodemailer = require('nodemailer')

//const express = require('express');

//const cors = require('cors');

// Changing max listeners for node
require('events').EventEmitter.defaultMaxListeners = 0;

// Creating telegram api const
const TelegramBot = require('node-telegram-bot-api');

// Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot(process.env.BOT_TOKEN, {polling: true});

// Web URL 
// const webAppURL = 'https://greenpatobot.netlify.app'
// const webAppURL1 = 'https://api.telegram.org/bot6845826917:AAHAKJ_DuD8hPDYRhMushItUU2oUpZVTPPE/sendMessage?chat_id=279152055&text=Hi+Everyone'
const webAppURL = 'https://bot.greenpato.ru'

bot.on('message', async (msg) => {
    // Access to chat Id
    const chatId = msg.chat.id
    const text = msg.text
    const msgId = msg.message_id
    const id = '279152055'

    // Getting Contact info (Lead) 
    if (msg?.web_app_data?.data) {
        try {
        const data = JSON.parse(msg?.web_app_data.data)       

        //Обработка формы Корзины
       if (data.totalPrice) {
        await bot.sendMessage(chatId, `Сумма вашего заказа ${data?.totalPrice} рублей`);

        //Обработка корзины для отправки сообщений в бот
        async function renderCart(data) {
            for (let i = 0; i < data.products.length; i++) {
                setTimeout(async () => {
                    await bot.sendMessage(chatId, `Наименование: ${data.products[i].title}\n Цена: ${data.products[i].price}\n Кол-во: ${data.products[i].quantity}`);
                }, 1500)
            }
        }
        renderCart(data);

    setTimeout(async () => {

        // Отправка данных из формы Корзины на почту
          const text = `Chat ID: ${chatId}\n Сумма заказа ${data?.totalPrice} рублей`;

          function sendCart(data) {
            let text = '';
            for (let i = 0; i < data.products.length; i++) {
                text += `\n Наименование: ${data.products[i].title}\n Цена: ${data.products[i].price}\n Кол-во: ${data.products[i].quantity}\n`; 
            }
            return text;
        }
        const text1 = sendCart(data);

        // Send order info on e-mail using nodemailer
        let transporter = nodemailer.createTransport ({
            host: 'smtp.spaceweb.ru',
            port: 25,
            secure: false,
               auth: {
            user: 'orders@greenpato.ru',
            pass: 'Magic815ipRich!' // Use app-specific passwords for security
            }
        })

            let mailOptions = {
        from: 'orders@greenpato.ru',
        to: 'orders@greenpato.ru',
        subject: `Покупатель ${msg.from.first_name} ${msg.from.last_name}, chatId: ${chatId} `,
        text: `Покупатель хочет заказать:\n ${text}\n ${text1}`,
        //html: '<b>Hello from Nodemailer!</b>'
            };

     transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });



        await bot.sendMessage(chatId, 'Ваш заказ отправлен. Пожалуйста, заполните форму обратной связи по кнопке внизу экрана', {
            reply_markup: {
                keyboard: [
                    [{text: 'Заполнить форму', web_app: {url: webAppURL + '/form'}}]
                ],
                resize_keyboard: true
            }
      })

        }, 3000)

       }
       
       //Обработка данных из формы обратной связи
       if (data?.name) {
        await bot.sendMessage(chatId, `Спасибо ${data?.name}, контактные данные получены`, {
            reply_markup: {remove_keyboard: true}
        })
        await bot.sendMessage(chatId, 'Ваш адрес: ' + data?.street)
        await bot.sendMessage(chatId, 'Ваш номер телефона: ' + data?.phone)

        setTimeout(async () => {

            // Отправка данных из формы обратной связи на почту
              const text = `Chat ID: ${chatId}\n Имя: ${data?.name}\n Адрес: ${data?.street}\n Телефон: ${data?.phone}`;
              // создание номера заказа
              const orderNumber = `${msg.from.id}`+ `${getOrderTime()}`

              // Send order info on e-mail using nodemailer
                    let transporter = nodemailer.createTransport ({
                        host: 'smtp.spaceweb.ru',
                        port: 25,
                        secure: false,
                        auth: {
                        user: 'orders@greenpato.ru',
                        pass: 'Magic815ipRich!' // Use app-specific passwords for security
                        }
                    })

                        let mailOptions = {
                    from: 'orders@greenpato.ru',
                    to: 'orders@greenpato.ru',
                    subject: `Покупатель ${msg.from.first_name} ${msg.from.last_name}, chatId: ${chatId}, Номер заказа: ${orderNumber} `,
                    text: `Контакты нового покупателя:\n ${text}\n`,
                    //html: '<b>Hello from Nodemailer!</b>'
                        };

                transporter.sendMail(mailOptions, (error, info) => {
                    if (error) {
                        console.log(error);
                    } else {
                        console.log('Email sent: ' + info.response);
                    }
                });

               
              
              await bot.sendMessage(chatId, `Ваш номер заказа ${orderNumber}`)
    
              await bot.sendMessage(chatId, 'Ваши контактные данные отправлены. Спасибо за заказ!\nМы свяжемся с вами в ближайшее время.');
              await bot.sendMessage(chatId, 'Если хотите сделать новый заказ нажмите /start');
              await bot.sendMessage(chatId, 'Или укажите номер вашего заказа и задайте вопрос');
              
              // отправка сообщения админу, что пришел новый заказ от пользователя
              const id = 573562828
              const message = `Пришел новый заказ от ${msg.from.first_name} ${msg.from.last_name}, chatId: ${chatId}, номер заказа ${orderNumber}. Посмотри почту`
              bot.sendMessage(id,message)
              
            //разрывать сессию
            //   await bot.removeListener();
    
            }, 3000)
       }

        // await bot.sendMessage(chatId, `Спасибо ${data?.name}, контактные данные получены`)
        // await bot.sendMessage(chatId, 'Ваш адрес: ' + data?.street)
        // await bot.sendMessage(chatId, 'Ваш номер телефона: ' + data?.phone)
    } catch (e) {
        console.log(e)
     }
 }

 //Начало работы бота
    if (text === '/start') {
      // Greeting message + show button
      await bot.sendMessage(chatId, 'Чтобы сделать заказ, нажмите кнопку "Сделать заказ"', {
            reply_markup: {
                keyboard: [
                    [{text: 'Сделать заказ', web_app: {url: webAppURL}}]

                    // [{text: 'Отправить другому', web_app: {url: webAppURL1}}]
                ] ,
                resize_keyboard: true
            }
      })
    } 
})



// Обмен сообщениями с пользователем
let config = {
   // "admin" : 279152055
    "admin" : 573562828 
}

let isAdmin = (userId) => {
    return userId == config.admin;
};

// Текстовые настройки
let replyText = {
    "helloAdmin": "Привет админ, ждем сообщения от пользователей",
    "helloUser":  "Приветствую, отправьте мне сообщение. Постараюсь ответить в ближайшее время.",
    "replyWrong": "Для ответа пользователю используйте функцию Ответить/Reply."
};

// Перенаправляем админу от пользователя или уведомляем админа об ошибке
let forwardToAdmin = msg => {
    if (isAdmin(msg.from.id)) {
       bot.sendMessage(replyText.replyWrong);
    } else {
       bot.forwardMessage(config.admin, msg.from.id, msg.message_id);
    }
};


   // Слушаем на наличие объекта message
bot.on('message',  async msg => {

    const text = msg.text
    // убеждаемся что это админ ответил на сообщение пользователя

    if (msg.reply_to_message
        && msg.reply_to_message.forward_from
        && isAdmin(msg.from.id)) {
        // отправляем копию пользователю
        await bot.sendMessage(msg.reply_to_message.forward_from.id, msg.text);
    
    } else {
         // перенаправляем админу
        if(text !== '/start') {
            forwardToAdmin(msg);
        }
    }
    
});

            function getOrderTime() {
                const currentDate = new Date()
                return `${currentDate.getHours()}${currentDate.getMinutes()}${currentDate.getDay()}${currentDate.getMonth()}${currentDate.getFullYear() - 2000}`
             }

    // Sending order information on e-mail
        //  nodeoutlook.sendEmail({
        //         auth: {
        //             // user: process.env.MAIL_ACCOUNT,
        //             // pass: process.env.MAIL_PASSWORD
        //            user: "igorpolousov@outlook.com",
        //             pass: "Magic815ipRich!"
        //         },
        //         from: 'igorpolousov@outlook.com',
        //         to: 'igorpolousov@gmail.com',
        //         subject: `Новый покупатель ${chatId}`,
        //         text: `Контакты нового покупателя:\n ${text}\n ${text1}`,
        //     onError: (e) => console.log(e),
        //      onSuccess: (i) => console.log(i)
        //     })

          // Sending order information on e-mail
            //  nodeoutlook.sendEmail({
            //         auth: {
            //             // user: process.env.MAIL_ACCOUNT,
            //             // pass: process.env.MAIL_PASSWORD
            //             user: "igorpolousov@outlook.com",
            //         pass: "Magic815ipRich!"
            //         },
            //         from: 'igorpolousov@outlook.com',
            //         to: 'igorpolousov@gmail.com',
            //         subject: `Новый покупатель ${chatId}`,
            //         text: `Контакты нового покупателя:\n ${text}\n`,
            //         onError: (e) => console.log(e),
            //         onSuccess: (i) => console.log(i)
            //     })

//Обработка сообщений от пользователя
// bot.on('text', async msg => {
//     const chatId = msg.chat.id
//     const text = msg.text
//     const msgId = msg.message_id
//     const id = '279152055'

//     try {
//         if(text !== '/start') {
//             await bot.forwardMessage(id, chatId, msgId);
//             await bot.sendMessage(chatId, 'Ваше сообщение получено');
//         }
//     }
//     catch(error) {
//         console.log(error);
//     }
// })

// app.post('/web-data', async (request, response) => {
//     //if(!request.body) return response.sendStatus(400);
//     //const data = JSON.parse(request)
//     console.log(`Данные post запрос ${request.body.products}`)
//     //response.send(request.body)

//     const {queryId, products = [], totalPrice} = request.body;
    
//     try {
//         await bot.answerWebAppQuery(queryId, {
//             type: 'article',
//             id: request.body.queryId,
//             title: 'Успешная покупка',
//             input_message_content: {
//                 message_text: ` Поздравляю с покупкой, вы приобрели товар на сумму ${request.body.totalPrice}, ${request.body.products.map(item => item.title).join(', ')}`
//             }
//         })
        
//         return response.status(200).json({});
//     } catch (e) {
//         return response.status(500).json({})
//     }
// })

// const PORT = 8000;

// app.listen(PORT, () => console.log('server started on PORT ' + PORT))