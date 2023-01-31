import React from 'react'
import { CompanyAPIInput } from 'defs'
import { CreateDataRefHandler } from '../../../utils/hooks/useDataRefProcessor'

type Props = {
  companyId: string
  companyInfo: CompanyAPIInput
  createDataRef: CreateDataRefHandler
}

export const CompanyInfoDrawer: React.FunctionComponent<Props> = ({
  companyId,
  companyInfo,
  createDataRef,
}) => null
