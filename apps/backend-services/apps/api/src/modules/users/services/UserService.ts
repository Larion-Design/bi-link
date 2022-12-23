import { Injectable, Logger } from '@nestjs/common'
import { FirebaseService } from './firebaseService'
import { Role } from '../constants'

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name)

  constructor(private readonly firebaseUserService: FirebaseService) {}

  getAllUsers = async () => {
    try {
      const { users } = await this.firebaseUserService.admin().auth().listUsers()
      return users
    } catch (e) {
      this.logger.error(e)
    }
  }

  setUserActiveState = async (uid: string, disabled: boolean) =>
    this.firebaseUserService.admin().auth().updateUser(uid, {
      disabled,
    })

  setUserRole = async (uid: string, role: Role) =>
    this.firebaseUserService.admin().auth().setCustomUserClaims(uid, { role })

  getUser = async (userId: string) => this.firebaseUserService.admin().auth().getUser(userId)

  closeUserSession = async (userId: string) =>
    this.firebaseUserService.admin().auth().revokeRefreshTokens(userId)

  disableUser = async (userId: string) =>
    this.firebaseUserService.admin().auth().updateUser(userId, {
      disabled: true,
    })
}
