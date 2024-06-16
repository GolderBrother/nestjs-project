import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-google-oauth20';

export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor() {
    super({
      // TODO 填入google cloud 创建的 clientID、clientSecret、callbackURL
      // https://console.cloud.google.com/apis/credentials
      clientID: 'aaa',
      clientSecret: 'bbb',
      callbackURL: 'http://localhost:3000/callback/google',
      scope: ['profile', 'email'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
  ): Promise<any> {
    const { name, emails, photos } = profile;
    const user = {
      email: emails[0].value,
      firstName: name.givenName,
      lastName: name.familyName,
      picture: photos[0].value,
      accessToken,
      refreshToken,
    };

    return user;
  }
}
