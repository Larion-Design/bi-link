import { Global, MiddlewareConsumer, Module, NestModule } from '@nestjs/common'
import { AuthMiddleware } from './services/authMiddleware'
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
export class UsersModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes('*')
  }
}
