import { PubModule } from '@app/pub'
import { Module } from '@nestjs/common'
import { EntitiesModule } from '@app/models'
import { ProducersModule } from '../producers/producersModule'
import { CompanyEventConsumer } from './companyEventConsumer'
import { EventConsumer } from './eventConsumer'
import { PersonEventConsumer } from './personEventConsumer'
import { PropertyEventConsumer } from './propertyEventConsumer'
import { CompanyGraphService } from './services/companyGraphService'
import { EventGraphService } from './services/eventGraphService'
import { LocationGraphService } from './services/locationGraphService'
import { PersonGraphService } from './services/personGraphService'
import { PropertyGraphService } from './services/propertyGraphService'

@Module({
  imports: [EntitiesModule, PubModule, ProducersModule],
  providers: [
    PersonEventConsumer,
    PropertyEventConsumer,
    EventConsumer,
    CompanyEventConsumer,

    PersonGraphService,
    CompanyGraphService,
    EventGraphService,
    PropertyGraphService,
    LocationGraphService,
  ],
})
export class ConsumersModule {}
