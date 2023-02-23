import { Injectable } from '@nestjs/common'
import * as firebaseAdmin from 'firebase-admin'
import { ConfigService } from '@nestjs/config'

@Injectable()
export class FirebaseService {
  private readonly firebaseAdminApp: firebaseAdmin.app.App

  constructor(configService: ConfigService) {
    this.firebaseAdminApp = firebaseAdmin.initializeApp({
      credential: firebaseAdmin.credential.cert({
        projectId: configService.get<string>('FIREBASE_PROJECT_ID'),
        clientEmail: configService.get<string>('FIREBASE_CLIENT_EMAIL'),
        privateKey: Buffer.from(
          configService.get<string>('FIREBASE_SECRET_KEY'),
          'base64',
        ).toString('utf8'),
      }),
    })
  }

  admin = () => this.firebaseAdminApp
}
