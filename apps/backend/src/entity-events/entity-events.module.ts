import { Global, Module } from '@nestjs/common'
import { EventEmitterModule } from '@nestjs/event-emitter'
import { EntityEventDispatcherService } from './entity-event-dispatcher.service'

@Global()
@Module({
  imports: [
    EventEmitterModule.forRoot({
      ignoreErrors: true,
      verboseMemoryLeak: true,
    }),
  ],
  providers: [EntityEventDispatcherService],
  exports: [EntityEventDispatcherService],
})
export class EntityEventsModule {}
