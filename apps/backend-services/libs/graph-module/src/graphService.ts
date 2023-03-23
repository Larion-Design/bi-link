import { Injectable, Logger } from '@nestjs/common'
import {
  EntityLabel,
  EntityMetadata,
  GraphEntities,
  GraphNode,
  GraphRelationships,
  RelationshipLabel,
  RelationshipMetadata,
} from 'defs'
import { Path } from 'neo4j-driver'
import { Neo4jService } from 'nest-neo4j/dist'

@Injectable()
export class GraphService {
  private readonly logger = new Logger(GraphService.name)

  constructor(private readonly neo4jService: Neo4jService) {}

  entityExists = async (entityId: string) => {
    try {
      const result = await this.neo4jService.read(
        'OPTIONAL MATCH (n {_id: $entityId}) RETURN n IS NOT NULL AS NODE_EXISTS',
        {
          entityId,
        },
      )
      return Boolean(result.records[0].get('NODE_EXISTS'))
    } catch (e) {
      this.logger.error(e)
    }
  }

  upsertEntity = async <T extends EntityMetadata>(data: T, type: EntityLabel) => {
    try {
      await this.neo4jService.write(
        `MERGE (n:${type} {_id: $data._id}) ON CREATE SET n = $data ON MATCH SET n = $data`,
        { data },
      )
    } catch (e) {
      this.logger.error(e)
    }
  }

  upsertEntities = async <T extends EntityMetadata>(entitiesInfo: T[], type: EntityLabel) => {
    try {
      await this.neo4jService.write(
        `UNWIND $entitiesInfo AS data MERGE (n:${type} {_id: data._id}) ON CREATE SET n = data ON MATCH SET n = data`,
        { entitiesInfo },
      )
    } catch (e) {
      this.logger.error(e)
    }
  }

  deleteEntity = async (entityId: string) => {
    try {
      await this.neo4jService.write(`OPTIONAL MATCH (n {_id: $entityId}) DETACH DELETE n`, {
        entityId,
      })
    } catch (e) {
      this.logger.error(e)
    }
  }

  deleteEntities = async (entitiesIds: string[]) => {
    try {
      await this.neo4jService.write(
        `OPTIONAL MATCH (n) WHERE n._id IN $entitiesIds DETACH DELETE n`,
        { entitiesIds },
      )
    } catch (e) {
      this.logger.error(e)
    }
  }

  upsertRelationship = async <T extends RelationshipMetadata>(
    entityId: string,
    targetEntityId: string,
    relationship: RelationshipLabel,
    data?: T,
  ) => {
    try {
      if (data) {
        await this.neo4jService.write(
          `MATCH (n {_id: $entityId}), (s {_id: $targetEntityId}) MERGE (n)-[r:${relationship}]-(s) SET r = $data`,
          { entityId, targetEntityId, data },
        )
      } else {
        await this.neo4jService.write(
          `MATCH (n {_id: $entityId}), (s {_id: $targetEntityId}) MERGE (n)-[:${relationship}]-(s)`,
          { entityId, targetEntityId },
        )
      }
    } catch (e) {
      this.logger.error(e)
    }
  }

  replaceRelationships = async <T extends RelationshipMetadata>(
    entityId: string,
    targetEntities: Map<string, T>,
    relationship: RelationshipLabel,
  ) => {
    const transaction = this.neo4jService.beginTransaction()
    try {
      await this.neo4jService.write(
        `OPTIONAL MATCH (n {_id: $entityId})-[r:${relationship}]->(s) WHERE NOT s._id IN $entitiesIds DELETE r`,
        { entityId, entitiesIds: Array.from(targetEntities.keys()) },
      )

      Array.from(targetEntities.entries()).forEach(
        ([targetEntityId, data]) =>
          void transaction.run(
            `MATCH (n {_id: $entityId}), (s {_id: $targetEntityId}) MERGE (n)-[r:${relationship}]-(s) SET r = $data`,
            { entityId, targetEntityId, data },
          ),
      )
      return transaction.commit()
    } catch (e) {
      this.logger.error(e)
      return transaction.rollback()
    }
  }

  upsertRelationships = async <T extends RelationshipMetadata>(
    entityId: string,
    targetEntities: Map<string, T>,
    relationship: RelationshipLabel,
  ) => {
    const transaction = this.neo4jService.beginTransaction()

    try {
      Array.from(targetEntities.entries()).forEach(
        ([targetEntityId, data]) =>
          void transaction.run(
            `MATCH (n {_id: $entityId}), (s {_id: $targetEntityId}) MERGE (n)-[r:${relationship}]-(s) SET r = $data`,
            { entityId, targetEntityId, data },
          ),
      )
      return transaction.commit()
    } catch (e) {
      this.logger.error(e)
      return transaction.rollback()
    }
  }

  deleteRelationship = async (
    entityId: string,
    targetEntityId: string,
    relationship: RelationshipLabel,
  ) => {
    try {
      await this.neo4jService.write(
        `OPTIONAL MATCH (n {_id: $entityId})-[r:${relationship}]->(s {_id: $targetEntityId}) DELETE r`,
        { entityId, targetEntityId },
      )
    } catch (e) {
      this.logger.error(e)
    }
  }

  deleteRelationshipType = async (entityId: string, relationship: RelationshipLabel) => {
    try {
      await this.neo4jService.write(
        `OPTIONAL MATCH (n {_id: $entityId})-[r:${relationship}]->(s) DELETE r`,
        { entityId },
      )
    } catch (e) {
      this.logger.error(e)
    }
  }

  getEntitiesGraph = async (entityId: string, depth = 1, relationshipType?: RelationshipLabel) => {
    const result = await this.neo4jService.read(
      `OPTIONAL MATCH p=(n {_id: $entityId})-[${
        relationshipType ? `:${relationshipType}` : ''
      }*1..${depth}]-() RETURN p`,
      {
        entityId,
      },
    )

    const relationships: GraphRelationships = {
      companiesBranches: [],
      companiesHeadquarters: [],
      eventsOccurrencePlace: [],
      personsBirthPlace: [],
      personsHomeAddress: [],
      companiesAssociates: [],
      eventsParties: [],
      propertiesRelationships: [],
      personalRelationships: [],
      propertiesLocation: [],
      entitiesReported: [],
      entitiesInvolvedInProceeding: [],
    }

    const entities: Record<keyof GraphEntities, Set<string>> = {
      persons: new Set(),
      companies: new Set(),
      properties: new Set(),
      events: new Set(),
      locations: new Set(),
      proceedings: new Set(),
      reports: new Set(),
    }

    const registerEntity = ({ _id: entityId, _type: entityType }: GraphNode) => {
      switch (entityType) {
        case EntityLabel.PERSON: {
          entities.persons.add(entityId)
          break
        }
        case EntityLabel.COMPANY: {
          entities.companies.add(entityId)
          break
        }
        case EntityLabel.PROPERTY: {
          entities.properties.add(entityId)
          break
        }
        case EntityLabel.EVENT: {
          entities.events.add(entityId)
          break
        }
        case EntityLabel.LOCATION: {
          entities.locations.add(entityId)
          break
        }
        case EntityLabel.PROCEEDING: {
          entities.proceedings.add(entityId)
          break
        }
        case EntityLabel.REPORT: {
          entities.reports.add(entityId)
          break
        }
      }
    }

    result.records.forEach((record) => {
      const path = record.get('p') as Path | null

      path?.segments.forEach(({ start, end, relationship: { type, properties } }) => {
        const startEntityId = String(start.properties._id)
        const endEntityId = String(end.properties._id)

        const startNode: GraphNode = {
          _id: startEntityId,
          _type: start.labels[0] as EntityLabel,
        }

        const endNode: GraphNode = {
          _id: endEntityId,
          _type: end.labels[0] as EntityLabel,
        }

        registerEntity(startNode)
        registerEntity(endNode)

        switch (type as RelationshipLabel) {
          case RelationshipLabel.ASSOCIATE: {
            relationships.companiesAssociates.push({
              startNode,
              endNode,
              _type: type as RelationshipLabel,
              _confirmed: Boolean(properties._confirmed),
              role: String(properties.role),
              equity: parseFloat(String(properties.equity)) ?? 0,
            })
            break
          }
          case RelationshipLabel.RELATED: {
            relationships.personalRelationships.push({
              startNode,
              endNode,
              _type: type as RelationshipLabel,
              _confirmed: Boolean(properties._confirmed),
              type: String(properties.type),
            })
            break
          }
          case RelationshipLabel.OWNER: {
            relationships.propertiesRelationships.push({
              startNode,
              endNode,
              _type: type as RelationshipLabel,
              _confirmed: Boolean(properties._confirmed),
              startDate: properties.startDate ? new Date(String(properties.startDate)) : null,
              endDate: properties.endDate ? new Date(String(properties.endDate)) : null,
            })
            break
          }
          case RelationshipLabel.PARTY_INVOLVED: {
            relationships.eventsParties.push({
              startNode,
              endNode,
              _type: type as RelationshipLabel,
              _confirmed: Boolean(properties._confirmed),
              name: String(properties.name),
            })
            break
          }
          case RelationshipLabel.LOCATED_AT: {
            relationships.propertiesLocation.push({
              startNode,
              endNode,
              _type: type as RelationshipLabel,
              _confirmed: Boolean(properties._confirmed),
            })
            break
          }
          case RelationshipLabel.BORN_IN: {
            relationships.personsBirthPlace.push({
              startNode,
              endNode,
              _type: type as RelationshipLabel,
              _confirmed: Boolean(properties._confirmed),
            })
            break
          }
          case RelationshipLabel.HQ_AT: {
            relationships.companiesHeadquarters.push({
              startNode,
              endNode,
              _type: type as RelationshipLabel,
              _confirmed: Boolean(properties._confirmed),
            })
            break
          }
          case RelationshipLabel.BRANCH_AT: {
            relationships.companiesBranches.push({
              startNode,
              endNode,
              _type: type as RelationshipLabel,
              _confirmed: Boolean(properties._confirmed),
            })
            break
          }
          case RelationshipLabel.LIVES_AT: {
            relationships.personsHomeAddress.push({
              startNode,
              endNode,
              _type: type as RelationshipLabel,
              _confirmed: Boolean(properties._confirmed),
            })
            break
          }
          case RelationshipLabel.INVOLVED_AS: {
            relationships.entitiesInvolvedInProceeding.push({
              startNode,
              endNode,
              involvedAs: String(properties.involvedAs),
              _type: type as RelationshipLabel,
              _confirmed: Boolean(properties._confirmed),
            })
            break
          }
          case RelationshipLabel.REPORTED: {
            relationships.entitiesReported.push({
              startNode,
              endNode,
              _type: type as RelationshipLabel,
              _confirmed: Boolean(properties._confirmed),
            })
            break
          }
          case RelationshipLabel.OCCURED_AT: {
            relationships.eventsOccurrencePlace.push({
              startNode,
              endNode,
              _type: type as RelationshipLabel,
              _confirmed: Boolean(properties._confirmed),
            })
            break
          }
        }
      })
    })

    return {
      relationships,
      entities: {
        persons: Array.from(entities.persons),
        companies: Array.from(entities.companies),
        properties: Array.from(entities.properties),
        events: Array.from(entities.events),
        locations: Array.from(entities.locations),
        proceedings: Array.from(entities.proceedings),
        reports: Array.from(entities.reports),
      },
    }
  }
}
