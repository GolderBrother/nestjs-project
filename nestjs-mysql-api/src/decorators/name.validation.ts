/*
 * @Description:用于dto上校验用户输入的用户名、邮箱、手机号码
 * @Author: jamesezhang
 * @Github: https://github.com/kuangshp
 * @Email: 332904234@qq.com
 * @Company:
 * @Date: 2019-08-14 10:59:41
 * @LastEditors: jamesezhang
 * @LastEditTime: 2020-05-18 12:34:18
 */
import { isNameExp } from './../utils';
import {
  ValidationOptions,
  registerDecorator,
  ValidationArguments,
  isEmail,
  isMobilePhone,
} from 'class-validator';

export const IsValidationName = (validationOptions: ValidationOptions = {}) => {
  validationOptions = {
    ...validationOptions,
    ...{ message: '请输入有效的用户名/手机号码/邮箱' },
  };
  return (object: object, propertyName: string) => {
    registerDecorator({
      name: 'isValidationName',
      target: object.constructor,
      propertyName,
      constraints: [],
      options: validationOptions,
      validator: {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        validate(value: any, args: ValidationArguments) {
          if (validationOptions.each) {
            for (const item of value) {
              // eslint-disable-next-line @typescript-eslint/no-use-before-define
              if (!isValidationName(item)) {
                return false;
              }
            }
            return true;
          }
          // eslint-disable-next-line @typescript-eslint/no-use-before-define
          return isValidationName(value);
        },
      },
    });
  };
};

/**
 * @param {type}
 * @return:
 * @Description:定义一个根据正则校验用户名是否满足手机号码、邮箱、用户名的标准
 * @Author: jamesezhang
 * @LastEditors: jamesezhang
 * @Date: 2019-08-14 11:23:24
 */
const isValidationName = (value: string): boolean => {
  // 使用自己写的正则或者直接使用官方提供的
  if (
    // isMobileExp.test(value) ||
    // isEmailExp.test(value) ||
    isMobilePhone(value, 'zh-CN') ||
    isEmail(value) ||
    isNameExp.test(value)
  ) {
    return true;
  } else {
    return false;
  }
};
