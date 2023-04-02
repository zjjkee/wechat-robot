import { remark } from 'remark'
import stripMarkdown from 'strip-markdown'
import { Configuration, OpenAIApi } from 'openai'
import dotenv from 'dotenv'
const env = dotenv.config().parsed // 环境参数

const configuration = new Configuration({
  apiKey: env.OPENAI_API_KEY,
})
const openai = new OpenAIApi(configuration)

export async function getReply(prompt) {
  // console.log('🚀🚀🚀/prompt:', prompt)
  // const response = await openai.createCompletion({
  //   model: 'gpt-3.5-turbo',
  //   prompt: prompt,
  //   temperature: 0.9, // 每次返回的答案的相似度0-1（0：每次都一样，1：每次都不一样）
  //   max_tokens: 2000,
  //   top_p: 1,
  //   frequency_penalty: 0.0,
  //   presence_penalty: 0.6,
  //   stop: [' Human:', ' AI:'],
  // })
  const response = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: [{role: "user", content:prompt}],
    temperature: 0.9
  })
  // console.log('response-------',response);
  console.log('response.data',response.data);
  console.log('response.data.choices[0].message-------------',response.data.choices[0].message);
  
  
  // const reply = markdownToText(response.data.choices[0].message)
  const reply = response.data.choices[0].message.content
  console.log('🚀🚀🚀 bot-reply------', reply)
  return reply
}
// async function chatgpt(username:string,message: string): Promise<string> {
//   // 先将用户输入的消息添加到数据库中
//   DBUtils.addUserMessage(username, message);
//   const messages = DBUtils.getChatMessage(username);
//   const response = await openai.createChatCompletion({
//     model: "gpt-3.5-turbo",
//     messages: messages,
//     temperature: 0.6
//   }).then((res) => res.data).catch((err) => console.log(err));
//   if (response) {
//     return (response.choices[0].message as any).content.replace(/^\n+|\n+$/g, "");
//   } else {
//     return "Something went wrong"
//   }
// }


function markdownToText(markdown) {
  return remark()
    .use(stripMarkdown)
    .processSync(markdown ?? '')
    .toString()
}
