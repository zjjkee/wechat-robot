import {getReply } from '../openai/index.js'
import {config} from '../../config/config.js'

// 延时函数，防止检测出类似机器人行为操作
const delay = (m) => new Promise((resolve) => setTimeout(resolve, m));


export async function defaultMessage(msg, bot,selfname) {
  const contact = msg.talker() // 发消息人
  // console.log('contact------',contact);
  
  const receiver = msg.to() // 消息接收人
  const content = msg.text() // 消息内容
  const room = msg.room() // 是否是群消息
  // console.log('room:------',room)
  // console.log('content:------',content);
  
  // const roomName = (await room?.topic()) || null // 群名称
  // const alias = (await contact.alias()) || (await contact.name()) // 发消息人昵称
  const remarkName = await contact.alias() // 备注名称
  const name = await contact.name() // 微信名称
  const isText = msg.type() === bot.Message.Type.Text // 消息类型是否为文本
  const isRoom = Boolean(room) && content.includes(`@${config.BOTNAME}`) // 群聊，且包含botname
  // console.log('isRoom',isRoom);
  
  const isAlias = config.ALIASWHITELIST.includes(remarkName) || config.ALIASWHITELIST.includes(name) // 发消息的人是否在联系人白名单内
  // console.log('isAlias------',isAlias);

  const isBotSelf = selfname ===  remarkName || selfname === name
  
  // TODO 你们可以根据自己的需求修改这里的逻辑
  if (isText && !isBotSelf) {
    console.log(JSON.stringify(msg))
    try {

      if (content.length < 5) return 

      
      //回复消息到被@的群里
      if (isRoom) {
        let ms=await getReply(content);
        console.log('。。。开始回复群聊');
        await delay(2000);
        await room.say(trimmed_reply(ms),contact)
        return
      }
      // 回复（白名单）的私人消息
      if (isAlias && !room) {
        let ms=await getReply(content)
        await delay(1000);
        console.log('开始回复私人消息')
        await contact.say(trimmed_reply(ms));
      }
       //回复（特定昵称出发）的私人消息
       let reg = RegExp(/^小白点[,|| ||，]/);
      if(reg.test(content)){
        let a = Math.round(Math.random()*10000); 
        if(a<1000){
            //不回答
        }else if(a>=8500&&a<9000){
          await room.say('你问的问题太臭屁，本点点不想回答',contact)
        }else if(a>=9000&&a<9300){
          await room.say('我题目我不会呀，要不咱百度一下？',contact)            
        }else if(a>=9300&&a<9600){
            await room.say('你咋不上天呢',contact)
        }else if(a>=9600){
          await room.say('我困了，早点休息，晚安',contact)            
        }else{
          let ms=await getReply(content.replace(reg,''))
          await delay(a);
          await room.say(trimmed_reply(ms),contact)
        }
      }


    } catch (e) {
      console.error(e)
    }
  }
}
     



//[\u4e00-\u9fa5]
function trimmed_reply(reply){
  let trimmed = reply.replace(/openai/gi,'喵星球')
  trimmed = trimmed.replace(/人工智能(机器人|聊天助手|助手)/gi,'萌萌小白点')
  trimmed = trimmed.replace(/AI/gi,' ')
  trimmed = trimmed.replace(/[ai|人工智能]*(聊天助手|机器人|语言模型|语音助手)/gi,'小白点')

  trimmed = trimmed.replace(/程序]/gi,'东东')
  trimmed = trimmed.replace(/AI(robot)|(assistant)/gi,'DianDian')
  trimmed = trimmed.replace(/gpt|language model/gi,'pet')
  
  // trimmed = trimmed.replace(/受雇|/gi,'来自')
  trimmed = trimmed.replace(/偏好|喜好/gi,'idea')
  trimmed = trimmed.replace(/人类/ig,'两脚兽')

  
  
  return trimmed
}

