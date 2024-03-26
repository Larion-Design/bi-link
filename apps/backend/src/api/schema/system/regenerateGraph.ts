import { CompaniesService } from '@modules/central/schema/company/services/companiesService'
import { LocationsService } from '@modules/central/schema/location/services/locationsService'
import { PersonsService } from '@modules/central/schema/person/services/personsService'
import { CompanyGraphService } from '@modules/graph/services/companyGraphService'
import { GraphService } from '@modules/graph/services/graphService'
import { LocationGraphService } from '@modules/graph/services/locationGraphService'
import { PersonGraphService } from '@modules/graph/services/personGraphService'
import { FirebaseAuthGuard } from '@modules/iam'
import { UseGuards } from '@nestjs/common'
import { Mutation, Resolver } from '@nestjs/graphql'

@Resolver(() => Boolean)
export class RegenerateGraph {
  constructor(
    private readonly personsService: PersonsService,
    private readonly companiesService: CompaniesService,
    private readonly locationsService: LocationsService,
    private readonly companyGraphService: CompanyGraphService,
    private readonly personGraphService: PersonGraphService,
    private readonly locationGraphService: LocationGraphService,
    private readonly graphService: GraphService,
  ) {}

  @Mutation(() => Boolean)
  @UseGuards(FirebaseAuthGuard)
  async regenerateGraph() {
    console.debug('Resetting graph...')
    await this.graphService.resetGraph()

    console.debug('Regenerating locations...')
    await this.regenerateLocations()

    console.debug('Regenerating persons...')
    await this.regeneratePersons()

    console.debug('Regenerating companies...')
    await this.regenerateCompanies()
    return true
  }

  private async regenerateLocations() {
    const locations = await this.locationsService.getAllLocations()

    if (locations.length) {
      await this.locationGraphService.upsertLocationNodes(locations)
    }
  }

  private async regeneratePersons() {
    const persons = await this.personsService.getAllPersons()

    if (persons.length) {
      await this.personGraphService.upsertPersonsNodes(persons)
    }
  }

  private async regenerateCompanies() {
    const companies = await this.companiesService.getAllCompanies()

    if (companies.length) {
      await this.companyGraphService.upsertCompaniesNodes(companies)
    }
  }
}
