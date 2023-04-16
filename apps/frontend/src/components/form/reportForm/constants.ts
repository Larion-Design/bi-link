import { ConnectedEntity, EntityType, ReportAPIInput } from 'defs'
import { getDefaultReport } from 'tools'

export const addEntityToReport = (
  entityId: string,
  entityType: EntityType,
  reportInfo: ReportAPIInput,
): ReportAPIInput => {
  const connectedEntity: ConnectedEntity = { _id: entityId }
  switch (entityType) {
    case 'PERSON':
      return { ...reportInfo, person: connectedEntity }
    case 'COMPANY':
      return { ...reportInfo, company: connectedEntity }
    case 'PROPERTY':
      return { ...reportInfo, property: connectedEntity }
    case 'EVENT':
      return { ...reportInfo, event: connectedEntity }
    case 'PROCEEDING':
      return { ...reportInfo, proceeding: connectedEntity }
  }
}

export const createReportInitialValues = (type: string, entityId: string, entityType: EntityType) =>
  addEntityToReport(entityId, entityType, getDefaultReport())
