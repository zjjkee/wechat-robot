import { WechatyBuilder, ScanStatus, log } from 'wechaty'
import qrTerminal from 'qrcode-terminal'
import { defaultMessage} from './sendMessage.js'
import { PuppetPadlocal } from "wechaty-puppet-padlocal"
// import { bbreminder } from './reminder.js'
// 扫码
function onScan(qrcode, status) {
  if (status === ScanStatus.Waiting || status === ScanStatus.Timeout) {
    // 在控制台显示二维码
    qrTerminal.generate(qrcode, { small: true })
    const qrcodeImageUrl = ['https://api.qrserver.com/v1/create-qr-code/?data=', encodeURIComponent(qrcode)].join('')
    console.log('onScan:', qrcodeImageUrl, ScanStatus[status], status)
  } else {
    log.info('onScan: %s(%s)', ScanStatus[status], status)
  }
}

// 登录
function onLogin(user) {
  console.log(`用户${user} 已登录`)
  const date = new Date()
  console.log(`Current time:${date}`)
  // bbreminder(bot)
}

// 登出
function onLogout(user) {
  console.log(`${user} 已登出`)
}

/**
 * 消息发送
 * @param msg
 * @param isSharding
 * @returns {Promise<void>}
 */
async function onMessage(msg) {
  // 默认消息回复
  await defaultMessage(msg, bot)
  // 消息分片
  // await shardingMessage(msg,bot)
}

// 初始化机器人
// const CHROME_BIN = process.env.CHROME_BIN ? { endpoint: process.env.CHROME_BIN } : {}
export const bot = WechatyBuilder.build({
  name: 'WechatEveryDay',
  puppet: 'wechaty-puppet-wechat', // 如果有token，记得更换对应的puppet
  puppet: new PuppetPadlocal({
    token: 'puppet_padlocal_0c0c374efd1a44d99eb896e98da1e689',
  }), 
  // puppet: 'wechaty-puppet-service',
  puppetOptions: {
    tls: {
      disable: true
    },
    uos: true,
    // token:'puppet_paimon_e3d9bc5d-6faa-4fce-90cd-e36e66cb8c1b'
  },
})


// 扫码
bot.on('scan', onScan)
// 登录
bot.on('login', onLogin)
// 登出
bot.on('logout', onLogout)
// 收到消息
bot.on('message', onMessage)


// 启动微信机器人
bot
  .start()
  .then(() => console.log('Start to log in wechat...'))
  .catch((e) => console.error(e))
