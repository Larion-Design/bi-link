import { Processor } from '@nestjs/bull'
import { QUEUE_PERSONS } from '../constants'

@Processor(QUEUE_PERSONS)
export class PersonProcessor {
  constructor() {
    //
  }
}
