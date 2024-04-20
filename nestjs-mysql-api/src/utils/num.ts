/**
 * @Author: jamesezhang
 * @Date: 2020-02-20 20:53:51
 * @LastEditors: jamesezhang
 * @Description: 获取随机数
 * @param {type} 
 * @return: 
 */
export const getRandomNum = (len = 4): string => {
  let str = '';
  for (let i = 0; i < len; i++) {
    str += Math.floor(Math.random() * 10);
  }
  return str;
}