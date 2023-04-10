import { Module } from '@nestjs/common'
import { RpcModule } from '@app/rpc'
import { GraphModule } from '../graph'
import { ProducersModule } from '../producers/producersModule'
import { CompanyEventConsumer } from './services/companyEventConsumer'
import { EventConsumer } from './services/eventConsumer'
import { PersonEventConsumer } from './services/personEventConsumer'
import { ProceedingEventConsumer } from './services/proceedingEventConsumer'
import { PropertyEventConsumer } from './services/propertyEventConsumer'
import { ReportEventConsumer } from './services/reportEventConsumer'

@Module({
  imports: [RpcModule, ProducersModule, GraphModule],
  providers: [
    PersonEventConsumer,
    PropertyEventConsumer,
    EventConsumer,
    CompanyEventConsumer,
    ProceedingEventConsumer,
    ReportEventConsumer,
  ],
})
export class ConsumersModule {}
