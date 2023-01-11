import { RelationshipLabel } from 'defs'

export const getRelationshipLabelFromType = (relationshipType: string | RelationshipLabel) => {
  const labels: Record<
    | RelationshipLabel.RELATED
    | RelationshipLabel.ASSOCIATE
    | RelationshipLabel.PARTY_INVOLVED
    | RelationshipLabel.OWNER,
    string
  > = {
    [RelationshipLabel.RELATED]: 'Cunoaște',
    [RelationshipLabel.ASSOCIATE]: 'Asociat',
    [RelationshipLabel.PARTY_INVOLVED]: 'Implicat in incident',
    [RelationshipLabel.OWNER]: 'Proprietar',
  }
  return labels[relationshipType] ?? (relationshipType as string)
}
