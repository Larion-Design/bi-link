import { GraphEventsHandlerService } from '@modules/graph/services/graph-events-handlers.service'
import { MemgraphService } from '@modules/graph/services/memgraph.service'
import { Global, Module, Provider } from '@nestjs/common'
import { CompanyGraphService } from './services/companyGraphService'
import { GraphService } from './services/graphService'
import { LocationGraphService } from './services/locationGraphService'
import { PersonGraphService } from './services/personGraphService'

const providers: Provider[] = [
  MemgraphService,
  GraphService,
  CompanyGraphService,
  LocationGraphService,
  PersonGraphService,
  GraphEventsHandlerService,
]

@Global()
@Module({
  providers: providers,
  exports: providers,
})
export class GraphModule {}
