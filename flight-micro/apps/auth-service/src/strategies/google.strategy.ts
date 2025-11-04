import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import {
  Strategy,
  StrategyOptions,
} from 'passport-google-oauth20';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor() {
    super({
      clientID: process.env.GOOGLE_WEB_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_REDIRECT_URI,
      scope: ['email', 'profile'],
    } as StrategyOptions);
  }

  validate(accessToken, refreshToken, profile, done) {
    const { name, emails, photos, id } = profile;
    const user = {
      provider: 'google',
      providerId: id,
      email: emails[0].value,
      displayName: name?.givenName + ' ' + name?.familyName,
      picture: photos[0]?.value,
      accessToken,
    };
    done(null, user);
  }
}
