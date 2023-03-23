import { ReportsService } from '@app/models'
import { CompaniesService } from '@app/models/services/companiesService'
import { EventsService } from '@app/models/services/eventsService'
import { LocationsService } from '@app/models/services/locationsService'
import { PersonsService } from '@app/models/services/personsService'
import { ProceedingsService } from '@app/models/services/proceedingsService'
import { PropertiesService } from '@app/models/services/propertiesService'
import { Args, ArgsType, Field, Int, Query, Resolver } from '@nestjs/graphql'
import { UseGuards } from '@nestjs/common'
import { Graph } from 'defs'
import { FirebaseAuthGuard } from '../../../users/guards/FirebaseAuthGuard'
import { GraphService } from '@app/graph-module/graphService'
import { EntitiesGraph } from '../dto/graph/entitiesGraph'

@ArgsType()
class Params {
  @Field()
  readonly id: string

  @Field(() => Int)
  readonly depth: number
}

@Resolver(() => EntitiesGraph)
export class GetEntitiesGraph {
  constructor(
    private readonly graphService: GraphService,
    private readonly personsService: PersonsService,
    private readonly companiesService: CompaniesService,
    private readonly propertiesService: PropertiesService,
    private readonly eventsService: EventsService,
    private readonly locationsService: LocationsService,
    private readonly reportsService: ReportsService,
    private readonly proceedingsService: ProceedingsService,
  ) {}

  @Query(() => EntitiesGraph)
  @UseGuards(FirebaseAuthGuard)
  async getEntitiesGraph(@Args() { id, depth }: Params): Promise<Graph> {
    const {
      relationships,
      entities: { persons, companies, properties, events, locations, reports, proceedings },
    } = await this.graphService.getEntitiesGraph(id, depth)

    const [
      personsDocuments,
      companiesDocuments,
      propertiesDocuments,
      eventsDocuments,
      locationsDocuments,
      reportsDocuments,
      proceedingsDocuments,
    ] = await Promise.all([
      this.personsService.getPersons(persons, true),
      this.companiesService.getCompanies(companies, false),
      this.propertiesService.getProperties(properties, false),
      this.eventsService.getEvents(events, false),
      this.locationsService.getLocations(locations),
      this.reportsService.getReports(reports, false),
      this.proceedingsService.getProceedings(proceedings, false),
    ])

    return {
      relationships,
      entities: {
        persons: personsDocuments,
        companies: companiesDocuments,
        properties: propertiesDocuments,
        events: eventsDocuments,
        locations: locationsDocuments,
        proceedings: proceedingsDocuments,
        reports: reportsDocuments,
      },
    }
  }
}
