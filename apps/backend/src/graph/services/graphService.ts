import { Injectable, Logger } from '@nestjs/common'
import {
  EntityMetadata,
  EntityType,
  GraphRelationships,
  GraphRelationship,
  RelationshipMetadata,
  EntityInfo,
  NodesRelationship,
} from 'defs'
import { Path } from 'neo4j-driver'
import { Neo4jService } from 'nest-neo4j/dist'

@Injectable()
export class GraphService {
  private readonly logger = new Logger(GraphService.name)

  constructor(private readonly neo4jService: Neo4jService) {}

  async entityExists(entityId: string) {
    const result = await this.neo4jService.read(
      'OPTIONAL MATCH (n {_id: $entityId}) RETURN n IS NOT NULL AS NODE_EXISTS',
      { entityId },
    )
    return Boolean(result.records[0]?.get('NODE_EXISTS'))
  }

  async upsertEntity<T extends EntityMetadata>(data: T, type: EntityType) {
    await this.neo4jService.write(
      `MERGE (n:${type} {_id: $data._id}) ON CREATE SET n = $data ON MATCH SET n = $data`,
      { data },
    )
  }

  async upsertEntities<T extends EntityMetadata>(entitiesInfo: T[], type: EntityType) {
    await this.neo4jService.write(
      `UNWIND $entitiesInfo AS data MERGE (n:${type} {_id: data._id}) ON CREATE SET n = data ON MATCH SET n = data`,
      { entitiesInfo },
    )
  }

  async deleteEntity(entityId: string) {
    await this.neo4jService.write(`OPTIONAL MATCH (n {_id: $entityId}) DETACH DELETE n`, {
      entityId,
    })
  }

  async deleteEntities(entitiesIds: string[]) {
    await this.neo4jService.write(
      `OPTIONAL MATCH (n) WHERE n._id IN $entitiesIds DETACH DELETE n`,
      { entitiesIds },
    )
  }

  async upsertRelationship<T extends RelationshipMetadata>(
    entityId: string,
    targetEntityId: string,
    relationship: GraphRelationship,
    data?: T,
  ) {
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
      await transaction.rollback()
      throw e
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
      await transaction.rollback()
      throw e
    }
  }

  async deleteRelationship(
    entityId: string,
    targetEntityId: string,
    relationship: GraphRelationship,
  ) {
    await this.neo4jService.write(
      `OPTIONAL MATCH (n {_id: $entityId})-[r:${relationship}]->(s {_id: $targetEntityId}) DELETE r`,
      { entityId, targetEntityId },
    )
  }

  async deleteRelationshipType(entityId: string, relationship: GraphRelationship) {
    await this.neo4jService.write(
      `OPTIONAL MATCH (n {_id: $entityId})-[r:${relationship}]->(s) DELETE r`,
      { entityId },
    )
  }

  async getEntitiesGraph(entityId: string, depth = 1, relationshipType?: GraphRelationship) {
    const relationshipLabel = relationshipType ? `:${relationshipType}` : ''

    const result = await this.neo4jService.read(
      `OPTIONAL MATCH p=(n {_id: $entityId})-[${relationshipLabel}*1..${depth}]-() RETURN p`,
      { entityId },
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
      companiesSuppliers: [],
      personsSuppliers: [],
      companiesDisputing: [],
      personsDisputing: [],
      companiesCompetitors: [],
      personsCompetitors: [],
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
          default: {
            const relationship: NodesRelationship = {
              startNode,
              endNode,
              _type: type as GraphRelationship,
              _confirmed: Boolean(properties._confirmed),
              _trustworthiness: parseInt(properties._trustworthiness),
            }

            switch (type as GraphRelationship) {
              case 'LOCATED_AT': {
                relationships.propertiesLocation.push(relationship)
                break
              }
              case 'BORN_IN': {
                relationships.personsBirthPlace.push(relationship)
                break
              }
              case 'HQ_AT': {
                relationships.companiesHeadquarters.push(relationship)
                break
              }
              case 'BRANCH_AT': {
                relationships.companiesBranches.push(relationship)
                break
              }
              case 'LIVES_AT': {
                relationships.personsHomeAddress.push(relationship)
                break
              }
              case 'REPORTED': {
                relationships.entitiesReported.push(relationship)
                break
              }
              case 'OCCURED_AT': {
                relationships.eventsOccurrencePlace.push(relationship)
                break
              }
              case 'COMPETITOR': {
                if ([startNode.entityType, endNode.entityType].includes('PERSON')) {
                  relationships.personsCompetitors.push(relationship)
                } else relationships.companiesCompetitors.push(relationship)

                break
              }
              case 'SUPPLIER': {
                if ([startNode.entityType, endNode.entityType].includes('PERSON')) {
                  relationships.personsSuppliers.push(relationship)
                } else relationships.companiesSuppliers.push(relationship)

                break
              }
              case 'DISPUTING': {
                if ([startNode.entityType, endNode.entityType].includes('PERSON')) {
                  relationships.personsDisputing.push(relationship)
                } else relationships.companiesDisputing.push(relationship)

                break
              }
            }
            break
          }
        }
      })
    })
    return relationships
  }
}
