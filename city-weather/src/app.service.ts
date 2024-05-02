import { HttpService } from '@nestjs/axios';
import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import pinyin from 'pinyin';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class AppService {
  @Inject(HttpService)
  private readonly httpService: HttpService;
  getHello(): string {
    return 'Hello World!';
  }

  async getWeather(city: string) {
    // 用 pinyin 拿到 city 的拼音，然后调用和风天气的接口。
    const cityPinyin = pinyin(city, { style: 'normal' }).join('');
    // 为啥用 firstValueFrom 的 rxjs 操作符呢？因为 HttpModule 把 axios 的方法返回值封装成了 rxjs 的 Observerable。
    // 因此转成 promise 还得加一层 firstValueFrom。
    const { data } = await firstValueFrom(
      this.httpService.get(
        `https://geoapi.qweather.com/v2/city/lookup?location=${cityPinyin}&key=208536bc7c7b4b40aae65c4531793b77`,
      ),
    );
    const location = data?.['location']?.[0];
    if (!location) {
      throw new BadRequestException('没有对应的城市信息');
    }

    const { data: weatherData } = await firstValueFrom(
      this.httpService.get(
        `https://api.qweather.com/v7/weather/7d?location=${location.id}&key=208536bc7c7b4b40aae65c4531793b77`,
      ),
    );
    return weatherData;
  }
}
