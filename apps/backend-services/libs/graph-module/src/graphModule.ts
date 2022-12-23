import { Module } from '@nestjs/common'
import { GraphService } from '@app/graph-module/graphService'

@Module({
  providers: [GraphService],
  exports: [GraphService],
})
export class GraphModule {}
