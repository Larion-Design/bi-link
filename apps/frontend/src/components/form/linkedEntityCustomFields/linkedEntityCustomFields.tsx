import React from 'react'
import Box from '@mui/material/Box'
import { CustomFieldAPI } from 'defs'
import { CustomInputFields } from '../customInputFields'

type Props<T = CustomFieldAPI> = {
  customFields: T[]
  updateCustomFields: (customFields: T[]) => void | Promise<void>
}

export const LinkedEntityCustomFields: React.FunctionComponent<Props> = ({
  customFields,
  updateCustomFields,
}) => (
  <Box sx={{ width: 1 }}>
    <CustomInputFields fields={customFields} setFieldValue={updateCustomFields} />
  </Box>
)
