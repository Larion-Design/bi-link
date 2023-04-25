import React from 'react'
import Box from '@mui/material/Box'
import { CustomFieldAPI } from 'defs'
import { CustomInputFields } from '../customInputFields'

type Props<T = CustomFieldAPI> = {
  customFields: Map<string, T>
  addCustomField: () => void
  updateCustomField: (uid: string, customField: T) => void
  removeCustomFields: (ids: string[]) => void
}

export const LinkedEntityCustomFields: React.FunctionComponent<Props> = ({
  customFields,
  addCustomField,
  updateCustomField,
  removeCustomFields,
}) => (
  <Box sx={{ width: 1 }}>
    <CustomInputFields
      customFields={customFields}
      addCustomField={addCustomField}
      removeCustomFields={removeCustomFields}
      updateCustomField={updateCustomField}
    />
  </Box>
)
