import { ConnectedEntity, EntityType, ReportAPIInput } from 'defs'

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
  }
}

export const createReportInitialValues = (
  type: string,
  entityId: string,
  entityType: EntityType,
): ReportAPIInput => {
  const reportInfo: ReportAPIInput = {
    name: '',
    type,
    isTemplate: false,
    sections: [],
    refs: [],
  }
  return addEntityToReport(entityId, entityType, reportInfo)
}
