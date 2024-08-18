import * as multer from 'multer';
import * as fs from 'fs';

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    try {
      // 保存的目录为 uploads
      fs.mkdirSync('uploads');
    } catch (e) {}

    cb(null, 'uploads');
  },
  filename: function (req, file, cb) {
    // 件名为时间戳-随机数-文件名的格式
    const uniqueSuffix =
      Date.now() +
      '-' +
      Math.round(Math.random() * 1e9) +
      '-' +
      file.originalname;
    cb(null, uniqueSuffix);
  },
});

export { storage };
