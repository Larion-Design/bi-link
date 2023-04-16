import { IdDocument, idDocumentSchema } from 'defs'
import { personIdDocumentRequest } from '@frontend/graphql/persons/queries/personIdDocumentExists'
import { isDatesOrderValid } from '@frontend/utils/date'

export const validateIdDocuments = async (documents: IdDocument[], personId?: string) => {
  let error = validateIdDocumentsFormat(documents)

  if (!error) {
    error = validateDocumentDates(documents)
  }
  if (!error) {
    error = validateDuplicateDocuments(documents)
  }
  if (!error) {
    error = await validateExistingDocuments(documents, personId)
  }
  return error
}

export const validateDocumentDates = (documents: IdDocument[]) => {
  for (const { issueDate, expirationDate } of documents) {
    if (
      issueDate &&
      expirationDate &&
      !isDatesOrderValid(issueDate as Date, expirationDate as Date)
    ) {
      return 'Data emiterii actului de identitate este mai recenta decat data expirarii.'
    }
  }
}

export const validateExistingDocuments = async (documents: IdDocument[], personId?: string) => {
  try {
    const results = await Promise.all(
      documents.map(({ documentNumber }) => personIdDocumentRequest(documentNumber, personId)),
    )

    const areDocumentsValid = results.every(
      ({ data: { personIdDocumentExists } }) => !personIdDocumentExists,
    )

    if (!areDocumentsValid) {
      return 'Acest document de identitate este deja asociat unei alte persoane.'
    }
  } catch (error) {
    return 'O eroare a intervenit in timpul comunicarii cu serverul.'
  }
}

export const validateDuplicateDocuments = (documents: IdDocument[]) => {
  const set: string[] = []

  for (const document of documents) {
    const { documentNumber } = document

    if (documentNumber?.length) {
      if (set.includes(documentNumber)) {
        return `Ai introdus același document de identitate de mai multe ori: ${documentNumber}.`
      }
      set.push(documentNumber)
    }
  }
}

export const validateIdDocumentsFormat = (idDocuments: Array<unknown>) => {
  if (!idDocumentSchema.parse(idDocuments)) {
    return 'Nu ai furnizat unele informatii obligatorii.'
  }
}
