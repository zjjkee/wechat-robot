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
    let reminderfind = await reminder_model.findOne({day:daysum()})//查找当天的提醒经文
    console.log('reminderfind:---------',reminderfind)

    let findroom = await bot.Room.find({ topic: '幸福小筑' })//要发送的群名
    console.log('findroom:-----',findroom);

    // let members = await findroom.memberAll();
    let jkkkk = await bot.Contact.find({name: 'jkkkk'})
    schedule.scheduleJob({tz:'America/Chicago',rule:config.SENDDATE},async ()=>{
        console.log('已启动,提醒日期已设定！');
        try {
            if(reminderfind.from==0){
                console.log('00000')
                await findroom.say('今天休息一天~~~');
            } else if(reminderfind.from==1){
                console.log('111111')
                await findroom.say(await intro(reminderfind));
                await delay(7000);
                await findroom.say(todayverse(reminderfind),jkkkk); // 发送读经提醒,@成员
            }else{
                console.log('22222')
                await findroom.say(todayverse(reminderfind),jkkkk); 
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

function todayverse(data){
  let tdverse = '';
  for(let i = data.from;i<=data.to;i++){
      tdverse+=data.volume+i+'\n';
  }
  let rep =`\n读经打卡${data.day}天， ${gt.format('YYYY-MM-DD')}\n-----------------------\n今日经文:\n${tdverse}-----------------------`
  return rep
}

async function intro(v){
    let info = '请介绍一下'+v.volume+'的写作背景和简介'
    info = await getReply(info)
    return info
}