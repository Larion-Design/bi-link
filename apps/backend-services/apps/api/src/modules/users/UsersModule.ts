import { Global, Module } from '@nestjs/common'
import { AuthService } from './services/AuthService'
import { PassportModule } from '@nestjs/passport'
import { FirebaseAuthStrategy } from './strategies/FirebaseAuthStrategy'
import { UserService } from './services/UserService'
import { FirebaseAuthGuard } from './guards/FirebaseAuthGuard'
import { FirebaseService } from './services/firebaseService'

@Global()
@Module({
  imports: [PassportModule.register({ defaultStrategy: 'firebase' })],
  providers: [FirebaseService, UserService, AuthService, FirebaseAuthStrategy, FirebaseAuthGuard],
  exports: [UserService, AuthService, FirebaseAuthStrategy, FirebaseAuthGuard],
})
export class UsersModule {}
