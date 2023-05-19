import { Injectable } from '@nestjs/common'
import { Metadata } from 'defs'

@Injectable()
export class MetadataDiffService {
  areObjectsEqual = (metadataA: Metadata, metadataB: Metadata) =>
    metadataA.access === metadataB.access &&
    metadataA.confirmed === metadataB.confirmed &&
    metadataA.trustworthiness.source === metadataB.trustworthiness.source &&
    metadataA.trustworthiness.level === metadataB.trustworthiness.level
}
