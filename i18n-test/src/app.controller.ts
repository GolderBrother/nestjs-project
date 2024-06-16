import { Controller, Get, Inject } from '@nestjs/common';
import { AppService } from './app.service';
import { I18nContext, I18nService } from 'nestjs-i18n';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Inject()
  i18n: I18nService;

  @Get()
  getHello(): string {
    return this.i18n.t('test.hello', {
      lang: I18nContext.current().lang,
      // i18n支持插槽，在 args 指定变量进行插槽替换
      args: {
        name: 'james',
      },
    });
  }
}
