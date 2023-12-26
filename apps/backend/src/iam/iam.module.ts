import { Global, Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { FirebaseAuthGuard } from './guards/FirebaseAuthGuard';
import { AuthService } from './services/auth.service';
import { FirebaseService } from './services/firebase.service';
import { UserService } from './services/user.service';
import { FirebaseAuthStrategy } from './strategies/FirebaseAuthStrategy';

@Global()
@Module({
  imports: [PassportModule.register({ defaultStrategy: 'firebase' })],
  providers: [
    FirebaseService,
    UserService,
    AuthService,
    FirebaseAuthStrategy,
    FirebaseAuthGuard,
  ],
  exports: [UserService, AuthService, FirebaseAuthStrategy, FirebaseAuthGuard],
})
export class IamModule {}
