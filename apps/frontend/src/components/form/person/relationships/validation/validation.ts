import * as yup from 'yup'
import { RelationshipAPIInput } from 'defs'
import { connectedEntityValidationSchema } from '../../../validation/connectedEntityValidationSchema'

export const validatePersonRelationships = async (relationships: RelationshipAPIInput[]) => {
  let error = validatePersonRelationshipsFormat(relationships)

  if (!error) {
    error = validateDuplicatePersonRelationships(relationships)
  }
  return Promise.resolve(error)
}

export const validateDuplicatePersonRelationships = (relationships: RelationshipAPIInput[]) => {
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

const personRelationshipsSchemaValidation = yup.array().of(
  yup.object({
    person: connectedEntityValidationSchema.required(),
    type: yup.string(),
    proximity: yup.number().required(),
  }),
)

export const validatePersonRelationshipsFormat = (relationships: Array<unknown>) => {
  if (!personRelationshipsSchemaValidation.isValidSync(relationships)) {
    return 'Nu ai furnizat unele informatii obligatorii.'
  }
}
