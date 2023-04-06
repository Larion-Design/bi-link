import { Global, Module } from '@nestjs/common'
import { GraphService } from './services/graphService'

@Global()
@Module({
  providers: [GraphService],
  exports: [GraphService],
})
export class GraphModule {}
