import { Injectable } from '@nestjs/common'
import { AssociateAPI, CompanyAPIInput } from 'defs'
import { CustomFieldDiffService } from '@app/diff-module/services/customFieldDiffService'
import { FileDiffService } from '@app/diff-module/services/fileDiffService'
import { MetadataDiffService } from '@app/diff-module/services/metadataDiffService'

@Injectable()
export class CompanyDiffService {
  constructor(
    private readonly metadataDiffService: MetadataDiffService,
    private readonly customFieldDiffService: CustomFieldDiffService,
    private readonly fileDiffService: FileDiffService,
  ) {}

  areObjectsEqual = (companyA: CompanyAPIInput, companyB: CompanyAPIInput) => {
    return false
  }

  areAssociatesEqual = (associateA: AssociateAPI, associateB: AssociateAPI) => {
    if (
      associateA.company?._id === associateB.company?._id ||
      associateA.person?._id === associateB.person?._id
    ) {
      return (
        this.metadataDiffService.areObjectsEqual(associateA.metadata, associateB.metadata) &&
        associateA.role.value === associateB.role.value &&
        associateA.equity.value === associateB.equity.value &&
        associateA.isActive.value === associateB.isActive.value &&
        associateA.startDate.value === associateB.startDate.value &&
        associateA.endDate.value === associateB.endDate.value &&
        this.customFieldDiffService.areCustomFieldsListsEqual(
          associateA.customFields,
          associateB.customFields,
        )
      )
    }
    return false
  }

  areAssociatesListsEqual = (associatesA: AssociateAPI[], associatesB: AssociateAPI[]) =>
    associatesA.length === associatesB.length &&
    associatesA.every((associateA) =>
      associatesB.some((associateB) => this.areAssociatesEqual(associateA, associateB)),
    )
}
