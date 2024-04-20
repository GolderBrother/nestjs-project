// 授权给第三方上传
// https://help.aliyun.com/zh/oss/user-guide/authorized-third-party-upload?spm=5176.28426678.J_HeJR_wZokYt378dwP-lLl.1.936b5181gwCH1C&scm=20140722.S_help@@%E6%96%87%E6%A1%A3@@31852.S_BB1@bl+RQW@ag0+BB2@ag0+os0.ID_31852-RL_%E9%80%9A%E8%BF%87sts%E6%8E%88%E6%9D%83%E7%AC%AC%E4%B8%89%E6%96%B9%E4%B8%8A%E4%BC%A0%E6%96%87%E4%BB%B6-LOC_search~UND~helpdoc~UND~item-OR_ser-V_3-P0_0

const OSS = require("ali-oss");
const dotenv = require('dotenv')
// 加载环境变量
dotenv.config();

async function main() {
  const config = {
    region: process.env.OSS_ACCESS_REGION,
    bucket: process.env.OSS_ACCESS_BUCKET,
    accessKeyId: process.env.OSS_ACCESS_KEY_ID,
    accessKeySecret: process.env.OSS_ACCESS_KEY_SECRET,
  };

  const client = new OSS(config);

  const date = new Date();

  date.setDate(date.getDate() + 1);

  const res = client.calculatePostSignature({
    expiration: date.toISOString(),
    conditions: [
      ["content-length-range", 0, 1048576000], //设置上传文件的大小限制。
    ],
  });

  console.log(res);

  const location = await client.getBucketLocation();

  const host = `http://${config.bucket}.${location.location}.aliyuncs.com`;

  console.log(host);
}

main();
