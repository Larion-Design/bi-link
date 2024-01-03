import { Injectable, Logger } from '@nestjs/common'
import {
  EntityMetadata,
  EntityType,
  GraphRelationships,
  GraphRelationship,
  RelationshipMetadata,
  EntityInfo,
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
      return Boolean(result.records[0]?.get('NODE_EXISTS'))
    } catch (e) {
      this.logger.error(e)
    }
  }

  upsertEntity = async <T extends EntityMetadata>(data: T, type: EntityType) => {
    try {
      await this.neo4jService.write(
        `MERGE (n:${type} {_id: $data._id}) ON CREATE SET n = $data ON MATCH SET n = $data`,
        { data },
      )
    } catch (e) {
      this.logger.error(e)
    }
  }

  upsertEntities = async <T extends EntityMetadata>(entitiesInfo: T[], type: EntityType) => {
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
    relationship: GraphRelationship,
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
    relationship: GraphRelationship,
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
    relationship: GraphRelationship,
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
    relationship: GraphRelationship,
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

  deleteRelationshipType = async (entityId: string, relationship: GraphRelationship) => {
    try {
      await this.neo4jService.write(
        `OPTIONAL MATCH (n {_id: $entityId})-[r:${relationship}]->(s) DELETE r`,
        { entityId },
      )
    } catch (e) {
      this.logger.error(e)
    }
  }

  getEntitiesGraph = async (entityId: string, depth = 1, relationshipType?: GraphRelationship) => {
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

    result.records.forEach((record) => {
      const path = record.get('p') as Path | null

      path?.segments.forEach(({ start, end, relationship: { type, properties } }) => {
        const startEntityId = String(start.properties._id)
        const endEntityId = String(end.properties._id)

        const startNode: EntityInfo = {
          entityId: startEntityId,
          entityType: start.labels[0] as EntityType,
        }

        const endNode: EntityInfo = {
          entityId: endEntityId,
          entityType: end.labels[0] as EntityType,
        }

        switch (type as GraphRelationship) {
          case 'ASSOCIATE': {
            relationships.companiesAssociates.push({
              startNode,
              endNode,
              _type: type as GraphRelationship,
              _confirmed: Boolean(properties._confirmed),
              _trustworthiness: parseInt(properties._trustworthiness),
              role: String(properties.role),
              equity: parseFloat(String(properties.equity)) ?? 0,
            })
            break
          }
          case 'RELATED': {
            relationships.personalRelationships.push({
              startNode,
              endNode,
              _type: type as GraphRelationship,
              _confirmed: Boolean(properties._confirmed),
              _trustworthiness: parseInt(properties._trustworthiness),
              type: String(properties.type),
              proximity: parseInt(properties.proximity) ?? 0,
            })
            break
          }
          case 'OWNER': {
            relationships.propertiesRelationships.push({
              startNode,
              endNode,
              _type: type as GraphRelationship,
              _confirmed: Boolean(properties._confirmed),
              _trustworthiness: parseInt(properties._trustworthiness),
              startDate: properties.startDate,
              endDate: properties.endDate,
            })
            break
          }
          case 'PARTY_INVOLVED': {
            relationships.eventsParties.push({
              startNode,
              endNode,
              _type: type as GraphRelationship,
              _confirmed: Boolean(properties._confirmed),
              _trustworthiness: parseInt(properties._trustworthiness),
              type: String(properties.name),
            })
            break
          }
          case 'LOCATED_AT': {
            relationships.propertiesLocation.push({
              startNode,
              endNode,
              _type: type as GraphRelationship,
              _confirmed: Boolean(properties._confirmed),
              _trustworthiness: parseInt(properties._trustworthiness),
            })
            break
          }
          case 'BORN_IN': {
            relationships.personsBirthPlace.push({
              startNode,
              endNode,
              _type: type as GraphRelationship,
              _confirmed: Boolean(properties._confirmed),
              _trustworthiness: parseInt(properties._trustworthiness),
            })
            break
          }
          case 'HQ_AT': {
            relationships.companiesHeadquarters.push({
              startNode,
              endNode,
              _type: type as GraphRelationship,
              _confirmed: Boolean(properties._confirmed),
              _trustworthiness: parseInt(properties._trustworthiness),
            })
            break
          }
          case 'BRANCH_AT': {
            relationships.companiesBranches.push({
              startNode,
              endNode,
              _type: type as GraphRelationship,
              _confirmed: Boolean(properties._confirmed),
              _trustworthiness: parseInt(properties._trustworthiness),
            })
            break
          }
          case 'LIVES_AT': {
            relationships.personsHomeAddress.push({
              startNode,
              endNode,
              _type: type as GraphRelationship,
              _confirmed: Boolean(properties._confirmed),
              _trustworthiness: parseInt(properties._trustworthiness),
            })
            break
          }
          case 'INVOLVED_AS': {
            relationships.entitiesInvolvedInProceeding.push({
              startNode,
              endNode,
              involvedAs: String(properties.involvedAs),
              _type: type as GraphRelationship,
              _confirmed: Boolean(properties._confirmed),
              _trustworthiness: parseInt(properties._trustworthiness),
            })
            break
          }
          case 'REPORTED': {
            relationships.entitiesReported.push({
              startNode,
              endNode,
              _type: type as GraphRelationship,
              _confirmed: Boolean(properties._confirmed),
              _trustworthiness: parseInt(properties._trustworthiness),
            })
            break
          }
          case 'OCCURED_AT': {
            relationships.eventsOccurrencePlace.push({
              startNode,
              endNode,
              _type: type as GraphRelationship,
              _confirmed: Boolean(properties._confirmed),
              _trustworthiness: parseInt(properties._trustworthiness),
            })
            break
          }
        }
      })
    })

    return relationships
  }
}
