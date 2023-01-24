import React from 'react'
import { PropertyAPIInput } from 'defs'
import { CreateDataRefHandler } from '../../../utils/hooks/useDataRefProcessor'

type Props = {
  propertyId: string
  propertyInfo: PropertyAPIInput
  createDataRef: CreateDataRefHandler
}

export const PropertyInfoDrawer: React.FunctionComponent<Props> = ({
  propertyId,
  propertyInfo,
  createDataRef,
}) => null
