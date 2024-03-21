import { CompaniesService } from '@modules/central/schema/company/services/companiesService'
import { PersonsService } from '@modules/central/schema/person/services/personsService'
import { FirebaseAuthGuard } from '@modules/iam'
import { CompaniesIndexerService, PersonsIndexerService } from '@modules/search/services/index'
import { UseGuards } from '@nestjs/common'
import { Mutation, Resolver } from '@nestjs/graphql'

@Resolver(() => Boolean)
export class RegenerateSearchIndex {
  constructor(
    private readonly personsService: PersonsService,
    private readonly companiesService: CompaniesService,
    private readonly companiesIndexerService: CompaniesIndexerService,
    private readonly personsIndexerService: PersonsIndexerService,
  ) {}

  @Mutation(() => Boolean)
  @UseGuards(FirebaseAuthGuard)
  async regenerateSearchIndex() {
    await Promise.all([this.regeneratePersons(), this.regenerateCompanies()])
    return true
  }

  private async regeneratePersons() {
    const persons = await this.personsService.getAllPersons()

    if (persons.length) {
      await Promise.all(
        persons.map(async (personDocument) =>
          this.personsIndexerService.indexPerson(personDocument._id, personDocument),
        ),
      )
    }
  }

  private async regenerateCompanies() {
    const companies = await this.companiesService.getAllCompanies()

    if (companies.length) {
      await Promise.all(
        companies.map(async (companyDocument) =>
          this.companiesIndexerService.indexCompany(companyDocument._id, companyDocument),
        ),
      )
    }
  }
}
