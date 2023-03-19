import { RpcModule } from '@app/rpc'
import { Module } from '@nestjs/common'
import { EntitiesModule } from '@app/models'
import { ProducersModule } from '../producers/producersModule'
import { CompanyEventConsumer } from './companyEventConsumer'
import { EventConsumer } from './eventConsumer'
import { PersonEventConsumer } from './personEventConsumer'
import { ProceedingEventConsumer } from './proceedingEventConsumer'
import { PropertyEventConsumer } from './propertyEventConsumer'
import { ReportEventConsumer } from './reportEventConsumer'
import { CompanyGraphService } from './services/companyGraphService'
import { EventGraphService } from './services/eventGraphService'
import { LocationGraphService } from './services/locationGraphService'
import { PersonGraphService } from './services/personGraphService'
import { ProceedingGraphService } from './services/proceedingGraphService'
import { PropertyGraphService } from './services/propertyGraphService'
import { ReportGraphService } from './services/reportGraphService'

@Module({
  imports: [EntitiesModule, RpcModule, ProducersModule],
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
