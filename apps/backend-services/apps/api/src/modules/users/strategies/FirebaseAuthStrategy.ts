import { Injectable, UnauthorizedException } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { AuthService } from '../services/AuthService'
import { passportJwtSecret } from 'jwks-rsa'
import { ConfigService } from '@nestjs/config'
import { DecodedIdToken } from 'firebase-admin/lib/auth'
import { User, UserRole } from 'defs'

@Injectable()
export class FirebaseAuthStrategy extends PassportStrategy(Strategy, 'firebase') {
  constructor(private readonly authService: AuthService, configService: ConfigService) {
    super({
      secretOrKeyProvider: passportJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 20,
        jwksUri:
          'https://www.googleapis.com/service_accounts/v1/jwk/securetoken@system.gserviceaccount.com',
      }),
      audience: configService.get<string>('FIREBASE_PROJECT_ID'),
      issuer: `https://securetoken.google.com/${configService.get<string>('FIREBASE_PROJECT_ID')}`,
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      algorithms: ['RS256'],
    })
  }

  validate = (user?: DecodedIdToken & { role: UserRole; name: string }): User => {
    if (!user?.sub) {
      throw new UnauthorizedException(user)
    }
    return {
      _id: user.sub,
      name: user.name,
      email: String(user.email),
      role: user.role,
      active: true,
    }
  }
}
