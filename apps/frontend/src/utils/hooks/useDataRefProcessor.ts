import { useCallback, useEffect, useState } from 'react'
import { format } from 'date-fns'
import md5 from 'crypto-js/md5'
import {
  CompanyAPIOutput,
  ConnectedEntity,
  DataRefAPI,
  EntityInfo,
  IdDocumentAPI,
  IncidentAPIOutput,
  PersonAPIOutput,
  PropertyAPIOutput,
} from 'defs'
import { getCompaniesRequest } from '../../graphql/companies/queries/getCompaniesInfo'
import { getIncidentsInfoRequest } from '../../graphql/incidents/queries/getIncidentsInfo'
import { getPersonsInfoRequest } from '../../graphql/persons/queries/getPersonsInfo'
import { getPropertiesInfoRequest } from '../../graphql/properties/queries/getPropertiesInfo'
import { formatDate } from '../date'
import { getPersonAge, getPersonFullName } from '../person'
import { useMap } from './useMap'

export type CreateDataRefHandler = (
  entityInfo: EntityInfo,
  field: string,
  path?: string,
  targetId?: string,
) => string

export type GeneratePreviewHandler = (text: string) => string

export const useDataRefs = (refs: DataRefAPI[]) => {
  const { add, uid, map, values, removeBulk, keys } = useMap(refs, ({ _id }) => _id)
  const [dataRefsMap, setDataRefsMap] = useState(new Map<string, string>())

  const [fetchPersons, { data: personsInfo }] = getPersonsInfoRequest()
  const [fetchCompanies, { data: companiesInfo }] = getCompaniesRequest()
  const [fetchProperties, { data: propertiesInfo }] = getPropertiesInfoRequest()
  const [fetchIncidents, { data: incidentsInfo }] = getIncidentsInfoRequest()

  useEffect(() => {
    const personsIds = new Set<string>()
    const companiesIds = new Set<string>()
    const propertiesIds = new Set<string>()
    const incidentsIds = new Set<string>()

    values().forEach(({ person, company, property, incident }) => {
      if (person?._id) {
        personsIds.add(person._id)
      } else if (company?._id) {
        companiesIds.add(company._id)
      } else if (property?._id) {
        propertiesIds.add(property._id)
      } else if (incident?._id) {
        incidentsIds.add(incident._id)
      }
    })

    if (personsIds.size) {
      void fetchPersons({ variables: { personsIds: Array.from(personsIds) } })
    }
    if (companiesIds.size) {
      void fetchCompanies({ variables: { companiesIds: Array.from(companiesIds) } })
    }
    if (propertiesIds.size) {
      void fetchProperties({ variables: { propertiesIds: Array.from(propertiesIds) } })
    }
    if (incidentsIds.size) {
      void fetchIncidents({ variables: { incidentsIds: Array.from(incidentsIds) } })
    }
  }, [uid])

  useEffect(() => {
    if (personsInfo?.getPersonsInfo) {
      setDataRefsMap((dataRefsMap) => {
        values().forEach(
          ({ _id: refId, person, company, property, incident, field, path, targetId }) => {
            if (dataRefsMap.has(refId)) return

            if (person) {
              const { _id } = person
              const personInfo = personsInfo.getPersonsInfo.find(
                ({ _id: personId }) => personId === _id,
              )
              dataRefsMap.set(refId, getPersonInfoValue(personInfo, field, path, targetId))
            } else if (company) {
              const { _id } = company
              const companyInfo = companiesInfo.getCompanies.find(
                ({ _id: companyId }) => companyId === _id,
              )
              dataRefsMap.set(refId, getCompanyInfoValue(companyInfo, field, path, targetId))
            } else if (property) {
              const { _id } = property
              const propertyInfo = propertiesInfo.getProperties.find(
                ({ _id: propertyId }) => propertyId === _id,
              )
              dataRefsMap.set(refId, getPropertyInfoValue(propertyInfo, field, path, targetId))
            } else if (incident) {
              const { _id } = incident
              const incidentInfo = incidentsInfo.getIncidents.find(
                ({ _id: incidentId }) => incidentId === _id,
              )
              dataRefsMap.set(refId, getIncidentInfoValue(incidentInfo, field, path, targetId))
            }
          },
        )
        return new Map(dataRefsMap)
      })
    }
  }, [
    uid,
    setDataRefsMap,
    personsInfo?.getPersonsInfo,
    companiesInfo?.getCompanies,
    propertiesInfo?.getProperties,
    incidentsInfo?.getIncidents,
  ])

  const transform: GeneratePreviewHandler = useCallback(
    (text) => {
      if (text.length) {
        let missingRef = false
        const transformedText = text.replaceAll(/[^{]+(?=}})/gm, (ref) => {
          if (!missingRef) {
            if (dataRefsMap.has(ref)) {
              return dataRefsMap.get(ref)
            } else missingRef = true
          }
          return ref
        })

        return missingRef ? text : transformedText.replace(/{{|}}/gm, '')
      }
      return ''
    },
    [dataRefsMap],
  )

  const createDataRef: CreateDataRefHandler = useCallback(
    ({ entityType, entityId }, field, path, targetId) => {
      const refId = md5(
        `${entityType}-${entityId}-${field}-${path ?? ''}-${targetId ?? ''}`,
      ).toString()

      if (map.has(refId)) return refId

      const dataRef: DataRefAPI = {
        _id: refId,
        field,
        path,
        targetId,
      }

      const entity: ConnectedEntity = { _id: entityId }

      switch (entityType) {
        case 'PERSON': {
          dataRef.person = entity
          break
        }
        case 'COMPANY': {
          dataRef.company = entity
          break
        }
        case 'PROPERTY': {
          dataRef.property = entity
          break
        }
        case 'INCIDENT': {
          dataRef.incident = entity
          break
        }
      }

      add(dataRef, ({ _id }) => _id)
      return refId
    },
    [uid],
  )

  const extractRefsIds = useCallback(
    (text: string) => {
      const set = new Set<string>()
      text.match(/[^{]+(?=}})/gm)?.forEach((refId) => set.add(refId))
      return Array.from(set)
    },
    [uid],
  )

  const removeAllRefsExcept = useCallback(
    (refsIds: string[]) => {
      const allRefsIds = new Set(refsIds)
      const missingsRefs = new Set<string>()
      keys().forEach((refId) => {
        if (!allRefsIds.has(refId)) {
          missingsRefs.add(refId)
        }
      })

      if (missingsRefs.size) {
        const removableRefs = Array.from(missingsRefs)
        removeBulk(removableRefs)
        setDataRefsMap((dataRefsMap) => {
          refsIds.forEach((refId) => dataRefsMap.delete(refId))
          return new Map(dataRefsMap)
        })
      }
    },
    [uid],
  )
  return { transform, createDataRef, extractRefsIds, removeAllRefsExcept, uid, getRefs: values }
}

type EntityInfoHandler<T> = (
  entityInfo: T,
  field: keyof T | string,
  path?: keyof T | string,
  targetId?: string,
) => string

const getPersonInfoValue: EntityInfoHandler<PersonAPIOutput> = (
  personInfo,
  field,
  path,
  targetId,
): string => {
  if (path?.length) {
    if (targetId?.length) {
      switch (path) {
        case 'documents': {
          const idDocument = personInfo.documents.find(({ documentNumber }) => targetId)

          switch (field as keyof IdDocumentAPI) {
            case 'documentNumber':
            case 'documentType':
            case 'status': {
              return String(idDocument?.[field]) ?? ''
            }
            case 'expirationDate':
            case 'issueDate': {
              const date = idDocument?.[field]
              return date ? formatDate(date) : ''
            }
          }
          break
        }
        case 'customFields': {
          const customField = personInfo.customFields.find(
            ({ fieldName }) => fieldName === targetId,
          )
          return customField?.[field] ?? ''
        }
        case 'contactDetails': {
          const contactInfo = personInfo.contactDetails.find(
            ({ fieldName }) => fieldName === targetId,
          )
          return contactInfo?.[field] ?? ''
        }
        case 'relationships': {
          const relationship = personInfo.relationships.find(
            ({ person: { _id } }) => targetId === _id,
          )
          return relationship?.[field] ?? ''
        }
      }
    }
  } else {
    switch (field) {
      case 'cnp':
      case 'firstName':
      case 'lastName':
      case 'oldName':
      case 'homeAddress': {
        return personInfo[field] ?? ''
      }
      case 'birthdate': {
        const { birthdate } = personInfo
        return birthdate ? formatDate(birthdate) : ''
      }
      case 'age': {
        return getPersonAge(personInfo).toString()
      }
      case 'fullName': {
        return getPersonFullName(personInfo)
      }
    }
  }
  return ''
}

const getCompanyInfoValue: EntityInfoHandler<CompanyAPIOutput> = (
  companyInfo,
  field,
  path,
  targetId,
) => {
  if (path?.length) {
    if (targetId?.length) {
      switch (path) {
        case 'customFields': {
          const customField = companyInfo.customFields.find(
            ({ fieldName }) => fieldName === targetId,
          )
          return customField?.[field] ?? ''
        }
        case 'contactDetails': {
          const contactInfo = companyInfo.contactDetails.find(
            ({ fieldName }) => fieldName === targetId,
          )
          return contactInfo?.[field] ?? ''
        }
        case 'associates': {
          const contactInfo = companyInfo.associates.find(
            ({ person, company }) => person?._id === targetId || company?._id === targetId,
          )
          return contactInfo?.[field] ?? ''
        }
        case 'locations': {
          const contactInfo = companyInfo.locations.find(({ address }) => address === targetId)
          return contactInfo?.[field] ?? ''
        }
      }
    }
  } else {
    switch (field) {
      case 'name':
      case 'cui':
      case 'registrationNumber':
      case 'headquarters': {
        return companyInfo[field] ?? ''
      }
    }
  }
  return ''
}

const getPropertyInfoValue: EntityInfoHandler<PropertyAPIOutput> = (
  propertyInfo,
  field,
  path,
  targetId,
) => {
  if (path?.length) {
    if (targetId?.length) {
      switch (path) {
        case 'customFields': {
          const customField = propertyInfo.customFields.find(
            ({ fieldName }) => fieldName === targetId,
          )
          return customField?.[field] ?? ''
        }
        case 'owners': {
          const ownerInfo = propertyInfo.owners.find(
            ({ person, company }) => person?._id === targetId || company?._id === targetId,
          )
          return ownerInfo?.[field] ?? ''
        }
      }
    } else {
      switch (path) {
        case 'vehicleInfo': {
          return propertyInfo.vehicleInfo[field] ?? ''
        }
      }
    }
  } else {
    switch (field) {
      case 'name':
      case 'type': {
        return propertyInfo[field] ?? ''
      }
    }
  }
  return ''
}

const getIncidentInfoValue: EntityInfoHandler<IncidentAPIOutput> = (
  incidentInfo,
  field,
  path,
  targetId,
) => {
  if (path?.length) {
    if (targetId?.length) {
      switch (path) {
        case 'customFields': {
          const customField = incidentInfo.customFields.find(
            ({ fieldName }) => fieldName === targetId,
          )
          return customField?.[field] ?? ''
        }
      }
    }
  } else {
    switch (field) {
      case 'description':
      case 'location': {
        return incidentInfo[field] ?? ''
      }
      case 'date': {
        const { date } = incidentInfo
        return date ? formatDate(date) : ''
      }
    }
  }
  return ''
}
