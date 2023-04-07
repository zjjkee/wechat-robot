import {getReply } from '../openai/index.js'
import {config} from '../../config/config.js'

// 延时函数，防止检测出类似机器人行为操作
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));


export async function defaultMessage(msg, bot) {
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
  console.log('isRoom',isRoom);
  
  const isAlias = config.ALIASWHITELIST.includes(remarkName) || config.ALIASWHITELIST.includes(name) // 发消息的人是否在联系人白名单内
  console.log('isAlias------',isAlias);
  
  const isBotSelf = config.BOTNAME === remarkName || config.BOTNAME === name // 是否是机器人自己
  // console.log('isBotSelf----------',isBotSelf);
  
  // TODO 你们可以根据自己的需求修改这里的逻辑
  if (isText && !isBotSelf) {
    console.log(JSON.stringify(msg))
    try {

      if (content.length < 5) return 
      
      //回复消息到被@的群里
      if (isRoom) {;
      let ms=await getReply(content)
      
        console.log('。。。开始回复群聊');
        await delay(1000);
        await room.say(trimmed_reply(ms),contact)
        return
      }
      // 回复（白名单）的私人消息
      if (isAlias && !room) {
        let ms=await getReply(content)
        await delay(1000);
        await contact.say(trimmed_reply(ms));
      }
    } catch (e) {
      console.error(e)
    }
  }
}

function trimmed_reply(reply){
  let trimmed = trimmed.replace(/openai/gi,'喵星球')
  trimmed = reply.replace(/人工智能/gi,'萌萌')
  trimmed = reply.replace(/(AI)[\u4e00-\u9fa5]/)/gi,'cute')
  trimmed = trimmed.replace(/机器人|程序]/gi,'小白点')
  trimmed = trimmed.replace(/语言模型|助手/gi,'小白点')
  trimmed = trimmed.replace(/robot|assistant/gi,'DianDian')
  trimmed = trimmed.replace(/gpt|language model/gi,'pet')
  
  // trimmed = trimmed.replace(/受雇|/gi,'来自')
  trimmed = trimmed.replace(/偏好|喜好/gi,'preference')

  
  
  return trimmed
}

