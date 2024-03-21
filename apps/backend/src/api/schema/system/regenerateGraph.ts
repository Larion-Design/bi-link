import { CompaniesService } from '@modules/central/schema/company/services/companiesService'
import { PersonsService } from '@modules/central/schema/person/services/personsService'
import { CompanyGraphService } from '@modules/graph/services/companyGraphService'
import { PersonGraphService } from '@modules/graph/services/personGraphService'
import { FirebaseAuthGuard } from '@modules/iam'
import { UseGuards } from '@nestjs/common'
import { Mutation, Resolver } from '@nestjs/graphql'

@Resolver(() => Boolean)
export class RegenerateGraph {
  constructor(
    private readonly personsService: PersonsService,
    private readonly companiesService: CompaniesService,
    private readonly companyGraphService: CompanyGraphService,
    private readonly personGraphService: PersonGraphService,
  ) {}

  @Mutation(() => Boolean)
  @UseGuards(FirebaseAuthGuard)
  async regenerateGraph() {
    await Promise.all([this.regeneratePersons(), this.regenerateCompanies()])
    return true
  }

  private async regeneratePersons() {
    const persons = await this.personsService.getAllPersons()

    if (persons.length) {
      await Promise.all(
        persons.map(async (personDocument) =>
          this.personGraphService.upsertPersonNode(personDocument._id, personDocument),
        ),
      )
    }
  }

  private async regenerateCompanies() {
    const companies = await this.companiesService.getAllCompanies()

    if (companies.length) {
      await Promise.all(
        companies.map(async (companyDocument) =>
          this.companyGraphService.upsertCompanyNode(companyDocument._id, companyDocument),
        ),
      )
    }
  }
}
