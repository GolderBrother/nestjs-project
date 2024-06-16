import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy } from 'passport-github2';

@Injectable()
export class GithubStrategy extends PassportStrategy(Strategy, 'github') {
  constructor() {
    super({
      clientID: 'Ov23lic3HEZhTvJsocaf',
      clientSecret: '75613da6da7ab45927bb8fd7aa7dd36ee5cf1a38',
      //   callbackURL 是登录成功后回调的 url。
      callbackURL: 'http://localhost:3000/callback',
      //   scope 是请求的数据的范围。
      scope: ['public_profile'],
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: Profile) {
    console.log(
      'validate accessToken, refreshToken, profile',
      accessToken,
      refreshToken,
      profile,
    );
    return profile;
  }
}
