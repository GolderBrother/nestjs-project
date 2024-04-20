const OSS = require('ali-oss')
const dotenv = require('dotenv')
// 加载环境变量
dotenv.config();

console.log('process.env', process.env);
const client = new OSS({
    region: process.env.OSS_ACCESS_REGION,
    bucket: process.env.OSS_ACCESS_BUCKET,
    accessKeyId: process.env.OSS_ACCESS_KEY_ID,
    accessKeySecret: process.env.OSS_ACCESS_KEY_SECRET,
});

async function put () {
  try {
    const result = await client.put('pikaqiu.png', './pikaqiu.png');
    console.log(result);
  } catch (e) {
    console.log(e);
  }
}

put();
