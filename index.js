require('dotenv').config()
const TelegramBot = require('node-telegram-bot-api');
const webAppUrl=process.env.WEB_APP_URL
const token = process.env.TELEGRAM_BOT_TOKEN
const bot = new TelegramBot(token, {polling: true});
const express=require("express")
const cors=require("cors")
const app=express();
app.use(express.json())
app.use(cors())

bot.onText(/\/start/, async(msg)=>{
    const chatId = msg.chat.id;
    await bot.sendMessage(chatId,"Знизу появиться кнопка заповнення форми !!!",
    {
        reply_markup:{ 
           keyboard:[
            [{text:"Заповнити форму ",web_app:{url:`${webAppUrl}/form`}}]
           ]
        } 
    })
    await bot.sendMessage(chatId,"Знизу появиться кнопка заповнення форми !!!",
    { 
        reply_markup:{
           inline_keyboard:[
            [{text:"Зробити замовлення",web_app:{url:webAppUrl}}]
           ]
        } 
    })
  
})
bot.on('message',async (msg) => {
  const chatId = msg.chat.id; 
  try {
 if(msg?.web_app_data?.data){
    const data=JSON.parse(msg?.web_app_data?.data);
  await  bot.sendMessage(chatId,"Дякую за зворотній зв'язок")
  await bot.sendMessage(chatId,`Ваша країна:${data?.country}`)
  await bot.sendMessage(chatId,`Ваше місто: ${data?.city}`)
 }
}
catch(e){
    console.log(e);
}
});
app.post("/web-data", async (req,res)=>{
    const {queryId,products,totalPrice}=req.body;
   
    try {
         bot.answerWebAppQuery(queryId,{
            type:"article",
            id:queryId,
            title:"Успішна покупка",
            input_message_content:{message_text:`Вітаю з покупкою, ви купили товару на суму : ${totalPrice}грн.`}
         })
         return res.status(200).json({})
    } catch (error) {
        bot.answerWebAppQuery(queryId,{
            type:"article",
            id:queryId,
            title:"Помилка при покупці",
            input_message_content:{message_text:`Помилка при покупці`}
         })
         return res.status(500).json({})
    }
})
app.listen(process.env.PORT,()=>console.log("server start "+ process.env.PORT))