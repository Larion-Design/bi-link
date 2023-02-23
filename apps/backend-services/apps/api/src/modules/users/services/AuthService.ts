import { Injectable, Logger } from '@nestjs/common'
import { FirebaseService } from './firebaseService'

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name)

  constructor(private readonly firebaseUserService: FirebaseService) {}

  validateToken = async (token: string) => {
    try {
      return this.firebaseUserService.admin().auth().verifyIdToken(token, true)
    } catch (e) {
      this.logger.error(e)
    }
  }
}
