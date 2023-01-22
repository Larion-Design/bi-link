import React, { useMemo } from 'react'
import Box from '@mui/material/Box'
import { PersonAPIInput } from 'defs'
import { EntityInfoTable } from './entityInfoTable'
import { format } from 'date-fns'

type Props = {
  personId: string
  personInfo: PersonAPIInput
}

export const PersonInfoDrawer: React.FunctionComponent<Props> = ({ personId, personInfo }) => {
  const generalInfo = useMemo(
    () => ({
      firstName: personInfo.firstName,
      lastName: personInfo.lastName,
      oldName: personInfo.oldName,
      cnp: personInfo.cnp,
      birthdate: personInfo.birthdate ? format(new Date(personInfo.birthdate), 'YYYY-mm-DD') : '',
      homeAddress: personInfo.homeAddress,
    }),
    [personInfo],
  )

  const extraInfo = useMemo(() => {
    const map = {}
    personInfo.customFields.forEach(({ fieldName, fieldValue }) => {
      map[fieldName] = fieldValue
    })
    return map
  }, [personInfo.customFields])

  const contactDetails = useMemo(() => {
    const map = {}
    personInfo.contactDetails.forEach(({ fieldName, fieldValue }) => {
      map[fieldName] = fieldValue
    })
    return map
  }, [personInfo.contactDetails])

  return (
    <Box sx={{ width: 1 }}>
      <EntityInfoTable label={'Informatii generale'} data={generalInfo} />
      <EntityInfoTable label={'Informatii suplimentare'} data={extraInfo} />
      <EntityInfoTable label={'Date de contact'} data={contactDetails} />
    </Box>
  )
}
