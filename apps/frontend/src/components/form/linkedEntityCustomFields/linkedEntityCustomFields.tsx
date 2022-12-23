import React from 'react'
import Box from '@mui/material/Box'
import { CustomFieldAPI } from '../../../types/customField'
import { CustomInputFields } from '../customInputFields'

type Props = {
  customFields: CustomFieldAPI[]
  updateCustomFields: (customFields: CustomFieldAPI[]) => void | Promise<void>
}

export const LinkedEntityCustomFields: React.FunctionComponent<Props> = ({
  customFields,
  updateCustomFields,
}) => (
  <Box sx={{ width: 1 }}>
    <CustomInputFields
      readonly={false}
      fields={customFields}
      setFieldValue={updateCustomFields}
    />
  </Box>
)
