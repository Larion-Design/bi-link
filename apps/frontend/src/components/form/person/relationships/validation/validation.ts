import { RelationshipAPI, relationshipSchema } from 'defs'

export const validatePersonRelationships = async (relationships: RelationshipAPI[]) => {
  let error = validatePersonRelationshipsFormat(relationships)

  if (!error) {
    error = validateDuplicatePersonRelationships(relationships)
  }
  return Promise.resolve(error)
}

export const validateDuplicatePersonRelationships = (relationships: RelationshipAPI[]) => {
  const set = new Set()

  for (const {
    person: { _id },
  } of relationships) {
    if (set.has(_id)) {
      return 'Ai stabilit o relatie cu aceeași persoana de mai multe ori.'
    }
    set.add(_id)
  }
}

export const validatePersonRelationshipsFormat = (relationships: Array<unknown>) => {
  if (!relationshipSchema.array().parse(relationships)) {
    return 'Nu ai furnizat unele informatii obligatorii.'
  }
}
