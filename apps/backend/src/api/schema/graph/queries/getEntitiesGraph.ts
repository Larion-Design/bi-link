import { Args, ArgsType, Field, ID, Int, Query, Resolver } from '@nestjs/graphql'
import { UseGuards } from '@nestjs/common'
import {
  Company,
  EntityInfo,
  Event,
  Graph,
  GraphEntities,
  GraphRelationships,
  Location,
  Person,
  Proceeding,
  Property,
  Report,
  User,
} from 'defs'
import { GraphService } from '@modules/graph/services/graphService'
import { CurrentUser, FirebaseAuthGuard } from '@modules/iam'
import { EntitiesGraph } from '../dto/entitiesGraph'

@ArgsType()
class Params {
  @Field(() => ID)
  readonly id: string

  @Field(() => Int)
  readonly depth: number
}

@Resolver(() => EntitiesGraph)
export class GetEntitiesGraph {
  constructor(private readonly graphService: GraphService) {}

  @Query(() => EntitiesGraph)
  @UseGuards(FirebaseAuthGuard)
  async getEntitiesGraph(
    @CurrentUser() { _id }: User,
    @Args() { id, depth }: Params,
  ): Promise<Graph | undefined> {
    const relationships = await this.graphService.getEntitiesGraph(id, depth)

    if (relationships) {
      const entities = await this.fetchEntitiesInfo(relationships)

      return {
        relationships,
        entities,
      }
    }
  }

  private fetchEntitiesInfo = async (relationships: GraphRelationships): Promise<GraphEntities> => {
    const entities: Record<keyof GraphEntities, Set<string>> = {
      persons: new Set<string>(),
      companies: new Set<string>(),
      properties: new Set<string>(),
      events: new Set<string>(),
      locations: new Set<string>(),
      proceedings: new Set<string>(),
      reports: new Set<string>(),
    }

    const registerEntity = ({ entityId, entityType }: EntityInfo) => {
      switch (entityType) {
        case 'PERSON': {
          entities.persons.add(entityId)
          break
        }
        case 'COMPANY': {
          entities.companies.add(entityId)
          break
        }
        case 'PROPERTY': {
          entities.properties.add(entityId)
          break
        }
        case 'EVENT': {
          entities.events.add(entityId)
          break
        }
        case 'LOCATION': {
          entities.locations.add(entityId)
          break
        }
        case 'PROCEEDING': {
          entities.proceedings.add(entityId)
          break
        }
        case 'REPORT': {
          entities.reports.add(entityId)
          break
        }
      }
    }

    Object.values(relationships).forEach((relationshipsSet) =>
      relationshipsSet.forEach(({ startNode, endNode }) => {
        registerEntity(startNode)
        registerEntity(endNode)
      }),
    )

    return {
      persons: (await this.fetchEntities(Array.from(entities.persons))) as Person[],
      companies: (await this.fetchEntities(Array.from(entities.companies))) as Company[],
      properties: (await this.fetchEntities(Array.from(entities.properties))) as Property[],
      events: (await this.fetchEntities(Array.from(entities.events))) as Event[],
      proceedings: (await this.fetchEntities(Array.from(entities.proceedings))) as Proceeding[],
      locations: (await this.fetchEntities(Array.from(entities.locations))) as Location[],
      reports: (await this.fetchEntities(Array.from(entities.reports))) as Report[],
    }
  }

  private fetchEntities = async (entitiesIds: string[]) =>
    Promise.resolve(entitiesIds.length ? [] : [])
}
