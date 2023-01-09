import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import supertokens from 'supertokens-node'
import Session from 'supertokens-node/recipe/session'
import EmailPassword from 'supertokens-node/recipe/emailpassword'

@Injectable()
export class SupertokensService {
  constructor(configService: ConfigService) {
    supertokens.init({
      appInfo: configService.get('SUPERTOKENS_APP_INFO'),
      supertokens: {
        connectionURI: configService.get('SUPERTOKENS_CONNECTION_URI'),
        apiKey: configService.get('SUPERTOKENS_API_KEY'),
      },
      recipeList: [EmailPassword.init(), Session.init()],
    })
  }
}
