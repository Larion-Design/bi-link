import { Injectable, Logger } from '@nestjs/common'
import { UserRole } from 'defs'
import { FirebaseService } from './firebaseService'

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name)

  constructor(private readonly firebaseService: FirebaseService) {}

  getAllUsers = async () => {
    try {
      const { users } = await this.firebaseService.admin().auth().listUsers()
      return users
    } catch (e) {
      this.logger.error(e)
    }
  }

  setUserActiveState = async (uid: string, disabled: boolean) =>
    this.firebaseService.admin().auth().updateUser(uid, { disabled })

  setUserRole = async (uid: string, role: UserRole) =>
    this.firebaseService.admin().auth().setCustomUserClaims(uid, { role })

  getUser = async (userId: string) => this.firebaseService.admin().auth().getUser(userId)

  closeUserSession = async (userId: string) =>
    this.firebaseService.admin().auth().revokeRefreshTokens(userId)

  disableUser = async (userId: string) =>
    this.firebaseService.admin().auth().updateUser(userId, { disabled: true })
}
