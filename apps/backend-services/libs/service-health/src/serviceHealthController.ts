import { Controller, Get } from '@nestjs/common'

@Controller('/health')
export class ServiceHealthController {
  @Get('/status')
  getStatus() {
    return {
      status: 'healthy',
    }
  }
}
