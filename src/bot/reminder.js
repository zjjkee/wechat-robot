import {config} from '../../config/config.js'
import { reminder_model } from "../DB/reminder_model.js";
import schedule from 'node-schedule'
import {getReply } from '../openai/index.js'

import dayjs from 'dayjs'
import tz from 'dayjs/plugin/timezone.js'
import utc from 'dayjs/plugin/utc.js'
dayjs.extend(utc)
dayjs.extend(tz)
let gt=dayjs().tz("America/Chicago")

//connect to MongoDB
import mongoose from "mongoose";
mongoose
  .connect(process.env.DB_CONNECT, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("成功连接到Mongodb atlas.");
  })
  .catch((err) => {
    console.log(err);
  });

const delay = (m) => new Promise((resolve) => setTimeout(resolve, m));

export async function bbreminder(bot) {
    console.log(`读经提醒任务启动中`);

    let findroom = await bot.Room.find({ topic: 'KLWC读经同行' })//要发送的群名
    console.log('findroom:-----',findroom);

    // let members = await findroom.memberAll();
    let groupowner = await bot.Contact.find({name: 'jkkkk'})//查找群主
    schedule.scheduleJob({tz:'America/Chicago',rule:config.SENDDATE1},async ()=>{
        console.log('读经提醒已启动,提醒日期已设定！');
        let reminderfind = await reminder_model.findOne({day:daysum()})//查找明天要读的提醒经文
        try {
            if(reminderfind.from==0){
                await findroom.say('明天休息一天~~~');
            } else if(reminderfind.from==1){
                await findroom.say(await intro(reminderfind));
                await delay(7000);
                await findroom.say(todayverse(reminderfind,'\n明日预告：\n'),groupowner); // 发送读经提醒,@成员
            }else{
                await findroom.say(todayverse(reminderfind,'\n明日预告：\n'),groupowner); 
            }
          } catch (e) {
            console.log(e);
            
        }
    })
    schedule.scheduleJob({tz:'America/Chicago',rule:config.SENDDATE2},async ()=>{ //第二次提醒
        console.log('第二次提醒,提醒日期已设定！');
        let reminderfind = await reminder_model.findOne({day:(daysum()-1)})//查找当天的应读经文
        try {
            if(reminderfind.from==0){
                await findroom.say('今天休息一天~~~愿bs们在主里重新得力！');
            } else{
                await findroom.say(todayverse(reminderfind,'\n今日提醒：\n'),groupowner); 
            }
          } catch (e) {
            console.log(e);
            
        }
    })
  }

function daysum(){
  let y = gt.get('year')
  let m = gt.get('month')
  let d = gt.get('D')
  let Feb = 28;
  let arr = [31, Feb, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  let sum = 0;
  if ((y % 4 == 0 & y % 100 != 0) || (y % 400 == 0)) {
    Feb = 29;
  }
  for (let i=0;i<m;i++) {
    sum += arr[i];
  }
  sum+=d
  // console.log('n---',sum);
  return sum
}



function todayverse(data,head){
    let tdverse = '';
    for(let i = data.from;i<=data.to;i++){
        tdverse+=data.volume+i+'\n';
    }
    let rep =head+`读经打卡${data.day}天 ${gt.format('YYYY-MM-DD')}\n-----------------------\n应读经文:\n${tdverse}-----------------------`
    return rep
  }

async function intro(v){
    let info = '请介绍一下'+v.volume+'的写作背景和简介'
    info = await getReply(info)
    return info
}