import { Global, Module } from '@nestjs/common'
import { GraphService } from '@app/graph-module/graphService'

@Global()
@Module({
  providers: [GraphService],
  exports: [GraphService],
})
export class GraphModule {}
