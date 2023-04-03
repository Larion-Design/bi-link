import { RpcModule } from '@app/rpc'
import { Module } from '@nestjs/common'
import { ProducersModule } from '../producers/producersModule'
import { CompanyEventConsumer } from './companyEventConsumer'
import { EventConsumer } from './eventConsumer'
import { PersonEventConsumer } from './personEventConsumer'
import { ProceedingEventConsumer } from './proceedingEventConsumer'
import { PropertyEventConsumer } from './propertyEventConsumer'
import { ReportEventConsumer } from './reportEventConsumer'
import { CompanyGraphService } from '../graph/services/companyGraphService'
import { EventGraphService } from '../graph/services/eventGraphService'
import { LocationGraphService } from '../graph/services/locationGraphService'
import { PersonGraphService } from '../graph/services/personGraphService'
import { ProceedingGraphService } from '../graph/services/proceedingGraphService'
import { PropertyGraphService } from '../graph/services/propertyGraphService'
import { ReportGraphService } from '../graph/services/reportGraphService'

@Module({
  imports: [RpcModule, ProducersModule],
  providers: [
    PersonEventConsumer,
    PropertyEventConsumer,
    EventConsumer,
    CompanyEventConsumer,
    ProceedingEventConsumer,
    ReportEventConsumer,

    PersonGraphService,
    CompanyGraphService,
    EventGraphService,
    PropertyGraphService,
    LocationGraphService,
    ProceedingGraphService,
    ReportGraphService,
  ],
})
export class ConsumersModule {}
