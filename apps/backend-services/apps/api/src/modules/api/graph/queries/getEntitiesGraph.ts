import { IngressService } from '@app/rpc/microservices/ingress'
import { Args, ArgsType, Field, Int, Query, Resolver } from '@nestjs/graphql'
import { UseGuards } from '@nestjs/common'
import {
  Company,
  EntityInfo,
  EntityType,
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
import { CurrentUser } from '../../../users/decorators/currentUser'
import { FirebaseAuthGuard } from '../../../users/guards/FirebaseAuthGuard'
import { EntitiesGraph } from '../dto/entitiesGraph'
import { GraphService } from '@app/rpc/microservices/graph/graphService'

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
    private readonly ingressService: IngressService,
  ) {}

  @Query(() => EntitiesGraph)
  @UseGuards(FirebaseAuthGuard)
  async getEntitiesGraph(
    @CurrentUser() { _id }: User,
    @Args() { id, depth }: Params,
  ): Promise<Graph | undefined> {
    const relationships = await this.graphService.getEntityRelationships(id, depth)

    if (relationships) {
      const entities = await this.fetchEntitiesInfo(relationships, _id)

      return {
        relationships,
        entities,
      }
    }
  }

  private fetchEntitiesInfo = async (
    relationships: GraphRelationships,
    userId: string,
  ): Promise<GraphEntities> => {
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
      persons: (await this.fetchEntities(
        Array.from(entities.persons),
        'PERSON',
        userId,
      )) as Person[],
      companies: (await this.fetchEntities(
        Array.from(entities.companies),
        'COMPANY',
        userId,
      )) as Company[],
      properties: (await this.fetchEntities(
        Array.from(entities.properties),
        'PROPERTY',
        userId,
      )) as Property[],
      events: (await this.fetchEntities(Array.from(entities.events), 'EVENT', userId)) as Event[],
      proceedings: (await this.fetchEntities(
        Array.from(entities.proceedings),
        'PROCEEDING',
        userId,
      )) as Proceeding[],
      locations: (await this.fetchEntities(
        Array.from(entities.locations),
        'LOCATION',
        userId,
      )) as Location[],
      reports: (await this.fetchEntities(
        Array.from(entities.reports),
        'REPORT',
        userId,
      )) as Report[],
    }
  }

  private fetchEntities = async (entitiesIds: string[], entityType: EntityType, userId: string) =>
    entitiesIds.length
      ? (await this.ingressService.getEntities(entitiesIds, entityType, false, {
          type: 'USER',
          sourceId: userId,
        })) ?? []
      : []
}
