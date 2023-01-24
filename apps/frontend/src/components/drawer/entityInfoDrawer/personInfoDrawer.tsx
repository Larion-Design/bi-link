import React, { useCallback, useMemo } from 'react'
import Box from '@mui/material/Box'
import { PersonAPIInput } from 'defs'
import { useCopyToClipboard } from 'usehooks-ts'
import { CreateDataRefHandler } from '../../../utils/hooks/useDataRefProcessor'
import { EntityInfoTable } from './entityInfoTable'
import { format } from 'date-fns'

type Props = {
  personId: string
  personInfo: PersonAPIInput
  createDataRef: CreateDataRefHandler
}

export const PersonInfoDrawer: React.FunctionComponent<Props> = ({
  personId,
  personInfo,
  createDataRef,
}) => {
  const [_, copy] = useCopyToClipboard()

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
    const map = new Map<string, string>()
    personInfo.customFields.forEach(({ fieldName, fieldValue }) => map.set(fieldName, fieldValue))
    return Object.fromEntries(map)
  }, [personInfo.customFields])

  const contactDetails = useMemo(() => {
    const map = new Map<string, string>()
    personInfo.contactDetails.forEach(({ fieldName, fieldValue }) => map.set(fieldName, fieldValue))
    return Object.fromEntries(map)
  }, [personInfo.contactDetails])

  const copyGeneralInfo = useCallback(
    (key: string) => void copy(createDataRef({ entityType: 'PERSON', entityId: personId }, key)),
    [personId],
  )

  const copyCustomField = useCallback(
    (key: string) =>
      void copy(
        createDataRef(
          { entityType: 'PERSON', entityId: personId },
          'fieldName',
          'customFields',
          key,
        ),
      ),
    [personId],
  )

  const copyContactInfo = useCallback(
    (key: string) =>
      void copy(
        createDataRef(
          { entityType: 'PERSON', entityId: personId },
          'fieldName',
          'contactDetails',
          key,
        ),
      ),
    [personId],
  )

  return (
    <Box sx={{ width: 1 }}>
      <EntityInfoTable
        label={'Informatii generale'}
        data={generalInfo}
        createDataRef={copyGeneralInfo}
      />
      <EntityInfoTable
        label={'Informatii suplimentare'}
        data={extraInfo}
        createDataRef={copyCustomField}
      />
      <EntityInfoTable
        label={'Date de contact'}
        data={contactDetails}
        createDataRef={copyContactInfo}
      />
    </Box>
  )
}
