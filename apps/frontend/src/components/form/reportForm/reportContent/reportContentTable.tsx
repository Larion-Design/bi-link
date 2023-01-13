import React from 'react'
import { EntityType, TableAPI } from 'defs'
import { InputField } from '../../inputField'

type Props = {
  entityId?: string
  entityType?: EntityType
  tableInfo: TableAPI
  updateTable: (tableInfo: TableAPI) => void
}

export const ReportContentTable: React.FunctionComponent<Props> = ({
  entityId,
  entityType,
  tableInfo: { id },
  updateTable,
}) => null
