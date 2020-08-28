const TelegramBot = require('node-telegram-bot-api')
const helper = require('./helpers')
const emojiUnicode = require("emoji-unicode");
const config = require ('./config')
const mongoose = require('mongoose')
const database = require('./data base.json')
const TOKEN  = '1164043270:AAHAheom3TNAfZIp-PV_Ch9bzdDliw4mllw'
helper.logStart()
const fs= require('fs')
const bot = new TelegramBot(TOKEN,{
    polling: {
        interval : 300,
        autoStart: true,
        params:{
            timeout:10
        }
    }
})
console.log(emojiUnicode("🔥"));
mongoose.connect(config.DB_URL,{
    useNewUrlParser: true
})
    .then(()=>console.log('MongoDb has started...'))
    .catch(e=> console.log(e))

   require('./models/Review')
    require('./models/user.model')
const Film = mongoose.model('films')
const User = mongoose.model('users')
//database.films.forEach(f=> new Film(f).save().catch(e=> console.log(e)))
const ACTION_TYPE = {
    TOGGLE_FAV_FILM:'tff'
}
bot.on('callback_query', query => {
    const userId = query.from.id
    let data
    try{
        data = JSON.parse(query.data)
    } catch (e) {
        throw  new Error('Data is not an object')

    }
    const { type } = data
    if (type === ACTION_TYPE.TOGGLE_FAV_FILM){
        toggleFavouriteFilm(userId, query.id, data)
    }
})

bot.onText(/\/f(.+)/,(msg,[source, match])=>{
const chatId = helper.getChatId(msg)
 const filmUuid = helper.getItemUuid(source)


    Promise.all([
        Film.findOne({uuid: filmUuid}),
        User.findOne({telegramId: msg.from.id})
    ]).then(([film,user])=>{

        let isFav = false
        if(user) {
            isFav = user.films.indexOf(film.uuid) !== -1
        }

        const favText = isFav ? 'Удалить из избранного' : 'Добавить в избранное'


        const caption = `Название:${film.name}\n Год: ${film.year}\n Рейтинг: ${film.year}\n Режиссер:${film.director}`
        bot.sendPhoto(chatId, film.picture,{
            caption:caption,
            reply_markup:{
                inline_keyboard:[
                    [
                        {
                            text:favText,
                            callback_data:JSON.stringify({
                                type: ACTION_TYPE.TOGGLE_FAV_FILM,
                                filmUuid:film.uuid,
                                isFav: isFav
                            })

                        },
                        {
                            text:'Кинотеатры',
                            callback_data:film.uuid
                        }
                    ],
                    [
                        {
                            text:`Кинопоиск: ${film.name}`,
                            url: film.link
                        }
                    ]
                ]
            }

    })
    })
    User.findOne({telegramId: msg.from.id})

    Film.findOne({uuid: filmUuid})
})




bot.on('message', msg=>{
    const chatId = helper.getChatId(msg)
    console.log('Working with ', msg.from.first_name)
    switch (msg.text) {
        case 'Фильмы':
            bot.sendMessage(chatId,`    Хм,фильмец?
Выбери как тебе отсортировать фильмы:`,{

                reply_markup :{
                    keyboard: keyboard1,resize_keyboard:true,
                }
            })
            break
        case 'По жанрам 🎬':
            bot.sendMessage(helper.getChatId(msg), `Выберите жанр:`, {
                reply_markup: {
                    keyboard: keyboard2,resize_keyboard:true
                }

            })
            break
        case'Комедия':
            sendFilmsByQuery(chatId,{type:'comedy'})
            break
        case'Боевик':
            sendFilmsByQuery(chatId,{type:'action'})
            break
        case'Драма':
            sendFilmsByQuery(chatId,{type:'dram'}).catch(e=> console.log(e))
            break

        case 'Триллер':
            sendFilmsByQuery(chatId,{type:'thriller'})
            break
        case 'Назад':
            bot.sendMessage(chatId,

'Выбери как тебе отсортировать фильмы:',{

                reply_markup :{
                    keyboard: keyboard1,resize_keyboard:true,
                }
            })
            break
        case '/start':   bot.sendMessage(chatId,`    Привет, ${msg.from.first_name}!
Сейчас найдем тебе что-нибудь`,{

            reply_markup :{
                keyboard: keyboard0,resize_keyboard:true,
            }
        }).then(
            bot.sendSticker(chatId,stickersList[getRandomInt(0, stickersList.length)])
        )
            break
        case'Избранное':
            showFavouriteFilms(chatId,msg.from.id)
            break
        case 'Нaзад':
            bot.sendMessage(chatId,

                'Выбери как тебе отсортировать фильмы:',{

                    reply_markup :{
                        keyboard: keyboard0,resize_keyboard:true,
                    }
                })
            break;
        case `По режиссерам 🎥`:
            bot.sendMessage(chatId, 'Да ты ценитель, приятель!',{
                reply_markup :{
                    keyboard: keyboard3,resize_keyboard:true,
                }
            })
            break
        case 'Все фильмы':
           sendFilmsByQuery(chatId,{})
        break
        case 'Квентин Тарантино':
            sendDirectorsByQuery(chatId,{director:'Квентин Тарантино'})
            break
        case 'Стэнли Кубрик':
            sendDirectorsByQuery(chatId,{director:'Стэнли Кубрик'})
            break
        case 'Мартин Скорсезе':
            sendDirectorsByQuery(chatId,{director:'Мартин Скорсезе'})
            break
        case 'Уэс Андерсон':
            sendDirectorsByQuery(chatId,{director:'Уэс Андерсон'})
            break
        case 'Кристофер Нолан':
            sendDirectorsByQuery(chatId,{director:'Кристофер Нолан'})
            break
        case 'Гай Ричи':
            sendDirectorsByQuery(chatId,{director:'Гай Ричи'})
            break
        case '/help':
            const html2 = `Чтобы начать выбор фильма пришли мне /start.
Просто нажми на это слово и мы сразу начнем действовать.
Отсортируй фильмы по своим предпочтениям.
Список фильмов будет выглядеть вот так:
1 Достучаться до небес - /ff890
2 1+1 - /ff789
3 Форрест Гамп - /ff678
    
Нажми на "/f****", чтобы узнать больше информации о фильме.`
            bot.sendMessage(chatId, html2,{
                parse_mode: 'HTML'
            })
           
            break
        /*default:
            const html= `          Привет! Я бот от <a href="https://www.instagram.com/notes_of_fool/?igshid=5kanaxsnorn8">notes_of_fools</a> .
Я помогу выбрать тебе фильм с мини-рецензией от моего 
создателя.
Кое-что обо мне:
/start - начать работу со мной.
/help  - рассказать как мной пользоваться.
/author - об авторе
Проблема в моей работе? Пиши сюда:
@Pashka_sigarett`
                bot.sendMessage(chatId, html,{
                    parse_mode: 'HTML'
                })
            break;*/
    }
})
bot.on('callback_query',query =>{

    const{ chat, message_id, text} = query.message

    switch (query.data) {
        case'back1':
            // куда, откуда, что
            bot.sendMessage(chat.id,'Отличный выбор',{
                reply_markup :{
                    keyboard: keyboard1,resize_keyboard:true,
                }
                })
            break

    }
    bot.answerCallbackQuery({
        callback_query_id: query.id
    })
})

/*bot.on('message',msg=>{
    const chatId = msg.chat.id
    bot.sendMessage(chatId, `Привет! Я бот от notes_of_fools.
  И я помогу выбрать тебе фильм с мини-рецензией от моего 
  создателя.
  Кое-что обо мне:
  /start - начать работу со мной.`)
})*/

const keyboard0 = [
    [
        {
           text: 'Фильмы'
        }  ,
        {
            text: 'Все фильмы'
        }
    ],
    [
        {
            text: 'Избранное'
        }
    ]
]

const keyboard1= [
    [
        {
            text:'По жанрам 🎬',
            callback_data:'style'
        },
        {
            text:`По режиссерам 🎥`,
            callback_data:'Directors'
        }
    ],
    [
        {
            text:'Недавние 🍿',
            callback_data:'edit'
        },
        {
            text:'Топ 10 сейчас 🔥',
            callback_data:'delete'
        }

    ],
    [
        {
            text: 'Нaзад'
    }

    ]

]


const keyboard2 = [
    [
        {
            text:'Комедия',
            callback_data:'comedy'
        },
        {
            text:'Драма',
            callback_data:'dram'
        }
    ],
    [
        {
            text:'Боевик',
            callback_data:'Action'
        },
        {
            text:'Триллер',
            callback_data:'thriller'
        }

    ],[
    {
        text: 'Назад',
        callback_data:'back'
    }
    ]

]

const keyboard3 = [
    [
        {
            text:'Квентин Тарантино'
        },
        {
            text:'Стэнли Кубрик'
        },
        {
            text:'Мартин Скорсезе'
        }
    ],
    [
        {
            text:'Уэс Андерсон'
        },
        {
            text:'Кристофер Нолан'
        },
        {
            text:'Гай Ричи'
        }

    ],
    [
        {
            text: 'Назад',
            callback_data:'back1'
        }
    ]
]

function sendFilmsByQuery(chatId, query) {
    Film.find(query).then(films => {
        console.log(films)

        const html = films.map((f,i)=>{
           return `<b>${i+1}</b> ${f.name} - /f${f.uuid}`
        }).join('\n')
        bot.sendMessage(chatId,html,{
            parse_mode:'HTML',
            reply_markup:{
                keyboard:keyboard2,resize_keyboard:true
            }
            })
        })
    }
function sendHtml(chatId, html, keyboard0 = null) {
    const options = {
        parse_mode: 'HTML'
    }

    bot.sendMessage(chatId, html, options)
}
function sendDirectorsByQuery(chatId, query) {
    Film.find(query).then(films => {
        console.log(films)

        const html = films.map((f,i)=>{
            return `<b>${i+1}</b> ${f.name} - /f${f.uuid}`
        }).join('\n')
        bot.sendMessage(chatId,html,{
            parse_mode:'HTML',
            reply_markup:{
                keyboard:keyboard3,resize_keyboard:true
            }
        })
    })
}

function toggleFavouriteFilm (userId,queryId,{filmUuid,isFav}) {
    let UserPromise
    User.findOne({telegramId: userId})
        .then(user =>{
            if(user) {
            if (isFav) {
                user.films = user.films.filter(fUuid => fUuid !== filmUuid)
            } else {
                user.films.push(filmUuid)
            }

            userPromise = user
            }else{
               userPromise =  new User({
                    telegramId: userId,
                    films:[filmUuid]
                })
            }

            const answerText = isFav? 'Удалено': 'Добавлено'

            userPromise.save().then(_ =>{
                bot.answerCallbackQuery({
                    callback_query_id:queryId,
                    text:answerText
                })
            }).catch(err => console.log(err))
        }).catch(err => console.log(err))
}

function showFavouriteFilms(chatId, telegramId) {
    User.findOne({telegramId})
        .then(user => {

            if (user) {
                Film.find({uuid: {'$in': user.films}}).then(films => {
                    let html
                    if (films.length) {
                        html = films.map(f => {
                            return `${f.name} - <b>${f.rate}</b> (/f${f.uuid})`
                        }).join('\n')
                        html = `<b>Ваши фильмы:</b>\n${html}`
                    } else {
                        html = 'Вы пока ничего не добавили'
                    }

                    sendHtml(chatId, html,  {reply_markup:{
                        keyboard:keyboard0,resize_keyboard:true
                    }})
                })
            } else {
                sendHtml(chatId, 'Вы пока ничего не добавили', {reply_markup:{
                        keyboard:keyboard0,resize_keyboard:true
                    }})
            }
        }).catch(e => console.log(e))
}
function getRandomInt(aMin, aMax)
{
    return Math.floor(Math.random() * (aMax - aMin + 1)) + aMin;
}
const stickersList = [
    'CAACAgIAAxkBAAINZV9IxiUPZpuQdHGHLsyavQABkQMcIgACRggAAnlc4gn0uTvJhfK2JRsE',
    'CAACAgIAAxkBAAINYl9IxhVqyxG-Thfi1ZqDKlAh-BKeAAI0CAACeVziCQoF4ydIkHE_GwQ',
    'CAACAgIAAxkBAAINcV9IxkqIU9HH60RVjdkPfb5RlHdnAAJzCgACLw_wBvn8MfjLw8vQGwQ',
    'CAACAgIAAxkBAAINel9I0Fm65oK-6V6h88JGocAVgT71AAIpAQACihKqDt3ePFfV082qGwQ',
    'CAACAgIAAxkBAAINa19Ixi_iuVNsLt69D3rQ-3xPSbJBAALjBwACeVziCe2Rc7NmvPaaGwQ',
    'CAACAgIAAxkBAAINg19I1byfZa6bW9qFE-iOGxbBlJ2SAAKIAgACusCVBUJhnbbkdoWqGwQ',
    'CAACAgIAAxkBAAINgF9I1au45HZBI_51nwhEXj5BabkpAALbAQADOKAKuoQ1kxQ5yMobBA',
    'CAACAgIAAxkBAAINjl9I5DFOcATHfSSSFX-v50j3kqmFAAICAQACCAcCAAHs3PVJi3vj2BsE',
    'CAACAgIAAxkBAAINkV9I5Djgpdm9S866-8u3oXo60Jr9AAL8AAMIBwIAAQYu78D5c-fCGwQ',
    'CAACAgIAAxkBAAINml9I5D3OSYMYb0MJ4N2UjqWvh67rAALkAAMIBwIAAZlR-LlCHmlMGwQ',
    'CAACAgIAAxkBAAINl19I5Dl8QH6ngDvoRBbdv1sq_YhUAAL2AAMIBwIAAao2rPRta17yGwQ'
]
   /* function  sendHTML(chatId, html,kbName=null) {
    const options = {
        parse_mode:'HTML'
    }
    if(kbName){
        options['reply_markup']={
            keyboard:[kbName]
        }
    }
        bot.sendMessage(chatId,html, options)
    }*/

/*bot.on('callback_query',query =>{

    const{ chat, message_id, text} = query.message

    switch (query.data) {
        case'style':
            // куда, откуда, что
            bot.sendMessage(chat.id,'Отличный выбор',{
                reply_markup :{
                    inline_keyboard2
                },})
            break
        case 'Reply':
            bot.sendMessage(chat.id, `Отвечаем на сообщение`, {
                reply_to_message_id:message_id

            })
            break
        case  'edit':
            bot.editMessageText(`${text}  (edited)`,{
                chat_id:chat.id,
                message_id: message_id,
                reply_markup: {inline_keyboard}
            })
            break
        case 'delete':
            bot.deleteMessage(chat.id, message_id)
            break

    }
    bot.answerCallbackQuery({
        callback_query_id: query.id
    })
})
bot.on('callback_query',query =>{

    const{ chat, message_id, text} = query.message


})
const inline_keyboard2 = [
    [
        {
            text:'Комедии',
            callback_data:'1'
        },
        {
            text:'Драмы',
            callback_data:'2'
        }
    ],
    [
        {
            text:'Боевик',
            callback_data:'3'
        },
        {
            text:'Любительское',
            callback_data:'4'
        }

    ]

]/*
 switch (query.data) {
        case'style':
            // куда, откуда, что
            bot.sendMessage(chat.id,'Отличный выбор',{
                reply_markup :{
                   inline_keyboard2
                },})
            break
        case 'Reply':
            bot.sendMessage(chat.id, `Отвечаем на сообщение`, {
                reply_to_message_id:message_id

            })
            break
        case  'edit':
            bot.editMessageText(`${text}  (edited)`,{
                chat_id:chat.id,
                message_id: message_id,
                reply_markup: {inline_keyboard}
            })
            break
        case 'delete':
            bot.deleteMessage(chat.id, message_id)
            break

    }
    bot.answerCallbackQuery({
        callback_query_id: query.id
    })
/*bot.onText(/\/pay/, msg => {
    const chatId = msg.chat.id
bot.sendInvoice(
    chatId,
    'Audi A4',
    'Your bunny wrote',
    'Payload',
    '381764678:TEST:18643',
    'Some_random_string',
    'RUB',
    [
        {
            label:'audi_a4',
            amount: 30000
        }
    ],
    {
        photo_url: 'https://cstor.nn2.ru/userfiles/data/ufiles/16/73/45/543273de27967_31990_audi_a4.jpg',
        need_name: true,
        is_flexible: true
    }
)
})*/




/*bot.onText(/\/cont/, msg =>{
    bot.sendContact(msg.chat.id,'89996762336', 'Нолан',{
        last_name: 'Гений'
    } )
})*/



/*bot.onText(/\/loc/, msg =>{

    bot.sendLocation(msg.chat.id,  57.032071,34.956679)
})*///отправка местоположения


/*bot.onText(/\/v3/,msg =>{
    const chatId = msg.chat.id

    bot.sendMessage(chatId, 'Sending video...')
        fs.readFile(__dirname +'/55555 3-1.m4v',(err,video) =>{
    bot.sendVideoNote(chatId,video)
})

})*/




/*bot.onText(/\/s2/, msg=>{
 fs.readFile(__dirname +'/kek.webp',(err,sticker) =>{
     bot.sendSticker(msg.chat.id,sticker)
 })
})*/





/*bot.onText(/\/doc2/, msg =>{
bot.sendMessage(msg.chat.id, 'Upload start....')
    fs.readFile(__dirname+'/Witch.rar', (err,file)=>{

        bot.sendDocument(msg.chat.id, file,{
            caption:'Сохранения witcher'
        }).then(()=>{
            bot.sendMessage(msg.chat.id,'Upload finish...')
        })
    })
})*/



/*bot.onText(/\/audio2/, msg =>{
    bot.sendMessage(msg.chat.id, 'Start audio uploading...')
    fs.readFile(__dirname+'/pin.mp3', (err,data)=>{
        bot.sendAudio(msg.chat.id,data) .then(()=>{
            bot.sendMessage(msg.chat.id, 'Uploading finished')

        })
    })
})*/

/*bot.onText(/\/pic/, msg =>{
bot.sendPhoto(msg.chat.id,fs.readFileSync(__dirname +'/primal.jpg') )
})*/


/*bot.onText(/\/pics/, msg =>{
    bot.sendPhoto(msg.chat.id,'./primal.jpg',{
        caption: 'This is cat photo'
    })
})*/






/*const inline_keyboard = [
    [
        {
            text:'Forward',
            callback_data:'forward'
        },
        {
            text:'Reply',
            callback_data:'Reply'
        }
    ],
    [
        {
            text:'Edit',
            callback_data:'edit'
        },
        {
            text:'delete',
            callback_data:'delete'
        }

    ]

]

bot.on('callback_query',query =>{

    const{ chat, message_id, text} = query.message

    switch (query.data) {
        case'forward':
            // куда, откуда, что
            bot.forwardMessage(chat.id,chat.id, message_id)
            break
        case 'Reply':
            bot.sendMessage(chat.id, `Отвечаем на сообщение`, {
                reply_to_message_id:message_id

            })
            break
        case  'edit':
            bot.editMessageText(`${text}  (edited)`,{
              chat_id:chat.id,
              message_id: message_id,
                reply_markup: {inline_keyboard}
            })
            break
        case 'delete':
            bot.deleteMessage(chat.id, message_id)
            break

    }
    bot.answerCallbackQuery({
        callback_query_id: query.id
    })
})*/




/*bot.onText(/\/start/,(msg,[source, match]) =>{

    const chatId = msg.chat.id
    bot.sendMessage(chatId,'Keyboard',{
        reply_markup :{
            inline_keyboard
        }
    })
})*/





/*bot.on('inline_query', query => {

    const results = []
for(let i =0;i<5;i++){
    results.push({
        type:'article',
        id: i.toString(),
        title:'Title' +i,
        input_message_content:{
            message_text:`Article ${i+1}`
        }
    })
}

    bot.answerInlineQuery(query.id,results,{
        cache_time:0
    })
})*/



/*bot.on('message',  (msg) => {
    console.log(msg)
    const {id} = msg.chat
  /* if(msg.text.toLowerCase() === 'hello') {
       bot.sendMessage(id, 'Приветули, '+ msg.from.first_name)
   }
   else{})
       bot.sendMessage(id,debug(msg))
           .then(() => {
               console.log('Message has been send')
           })
           .catch((error) => {
               console.error(error)
           })

})*/

/*bot.onText(/\/start/, msg=> {
    const {id} = msg.chat
    bot.sendMessage(id,debug(msg))
})*/

/*bot.onText(/\/help (.+)/,(msg, [source, match])=>{
    const {id} = msg.chat
    bot.sendMessage(id, debug(match))
})*/
/*bot.on('message', msg => {

    const html = `
<strong>Hello, ${msg.from.first_name}</strong>
<i>Test message</i>
 <pre>
  ${debug(msg)}
 </pre>
    `
    bot.sendMessage(msg.chat.id,html,{
        parse_mode:'HTML'
    })
})*/
/*bot.on('message', msg =>{
const markdown = `
*Hello, ${msg.from.first_name}*
_Italic text_
`
    bot.sendMessage(msg.chat.id, markdown,{
        parse_mode:'Markdown'
    })

})  */

/*bot.on('message', msg =>{

    setTimeout(()=> {
        bot.sendMessage(msg.chat.id, `https://transfiles.ru/`, {
            disable_web_page_preview: true, // отправка ссылки без
            disable_notification:true,
        })
    },4000)

    })*/

/*bot.on('message', msg =>{

    const chatId = msg.chat.id

    if (msg.text ==='Закрыть'){

     bot.sendMessage(chatId,'Закрыть клавиатуру',{
         reply_markup: {
             remove_keyboard:true
         }
     })

    } else if(msg.text ==='Ответить'){

        bot.sendMessage(chatId,'Отвечаю',{
            reply_markup: {
                force_reply:true
            }
        })
    } else {
        bot.sendMessage(chatId, 'Клавиатура',{
            reply_markup:{
                keyboard: [
                    [{
                    text: 'Отправить местоположение',
                        request_location: true
                    }],
                    ['Ответить','Закрыть'],
                    [{
                    text: 'Отправить контакт',
                        request_contact:true
                    }],
                ],
                one_time_keyboard:true
            }
        })
    }

})*/
/*bot.on('message',msg =>{

    const chatId = msg.chat.id

    bot.sendMessage(chatId, 'Inline keyboard',{
        reply_markup:{
            inline_keyboard:[

                [
                    {
                text: 'Google',
                url:'https://google.com'
                }
                ],
                [
                    {
                        text:'Reply',
                        callback_data:'reply'

                    },
                    {
                        text:'Forward',
                        callback_data:'forward'
                    }
                ]
            ]
        }
    })
})*/

/*bot.on('callback_query', query => {
  // bot.sendMessage(query.message.chat.id, debug(query))

    bot.answerCallbackQuery(query.id, `${query.data}`)
})*/