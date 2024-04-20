// https://help.aliyun.com/zh/oss/developer-reference/multipart-upload-7?spm=a2c4g.11186623.0.0.48cd22c5qfayjQ
// 分片上传
const OSS = require('ali-oss');
const path = require("path");
const dotenv = require('dotenv')

// 加载环境变量
dotenv.config();

const client = new OSS({
    // yourregion填写Bucket所在地域。以华东1（杭州）为例，Region填写为oss-cn-hangzhou。
    region: process.env.OSS_ACCESS_REGION,
    // 填写存储空间名称。
    bucket: process.env.OSS_ACCESS_BUCKET,
    // 从环境变量中获取访问凭证。运行本代码示例之前，请确保已设置环境变量OSS_ACCESS_KEY_ID和OSS_ACCESS_KEY_SECRET。
    accessKeyId: process.env.OSS_ACCESS_KEY_ID,
    accessKeySecret: process.env.OSS_ACCESS_KEY_SECRET,
});


const progress = (p, _checkpoint) => {
  // Object的上传进度。
  console.log(p); 
  // 分片上传的断点信息。
  console.log(_checkpoint); 
};

const headers = {  
  // 指定Object的存储类型。
  'x-oss-storage-class': 'Standard', 
  // 指定Object标签，可同时设置多个标签。
  'x-oss-tagging': 'Tag1=1&Tag2=2', 
  // 指定初始化分片上传时是否覆盖同名Object。此处设置为true，表示禁止覆盖同名Object。
  'x-oss-forbid-overwrite': 'true'
}

// 开始分片上传。
async function multipartUpload() {
  try {
    // 依次填写Object完整路径（例如exampledir/exampleobject.txt）和本地文件的完整路径（例如D:\\localpath\\examplefile.txt）。Object完整路径中不能包含Bucket名称。
    // 如果本地文件的完整路径中未指定本地路径（例如examplefile.txt），则默认从示例程序所属项目对应本地路径中上传文件。
    const result = await client.multipartUpload('interview/vue-interview.png', path.resolve('./vue-interview.png'), {
      progress,
      // headers,
      // 指定meta参数，自定义Object的元信息。通过head接口可以获取到Object的meta数据。
      meta: {
        year: 2020,
        people: 'test',
      },
    });
    console.log(result);
    // 填写Object完整路径，例如exampledir/exampleobject.txt。Object完整路径中不能包含Bucket名称。
    const head = await client.head('interview/vue-interview.png');
    console.log(head);
  } catch (e) {
    // 捕获超时异常。
    if (e.code === 'ConnectionTimeoutError') {
      console.log('TimeoutError');
      // do ConnectionTimeoutError operation
    }
    console.log(e);
  }
}

multipartUpload();