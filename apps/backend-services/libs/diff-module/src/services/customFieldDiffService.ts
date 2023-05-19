import { MetadataDiffService } from '@app/diff-module/services/metadataDiffService'
import { Injectable } from '@nestjs/common'
import { CustomFieldAPI } from 'defs'

@Injectable()
export class CustomFieldDiffService {
  constructor(private readonly metadataDiffService: MetadataDiffService) {}

  areCustomFieldsEqual = (customFieldA: CustomFieldAPI, customFieldB: CustomFieldAPI) =>
    this.metadataDiffService.areObjectsEqual(customFieldA.metadata, customFieldB.metadata) &&
    customFieldA.fieldName === customFieldB.fieldName &&
    customFieldA.fieldValue === customFieldB.fieldValue

  areCustomFieldsListsEqual = (listA: CustomFieldAPI[], listB: CustomFieldAPI[]) =>
    listA.length === listB.length &&
    listA.every((itemA) => listB.some((itemB) => this.areCustomFieldsEqual(itemA, itemB)))
}
