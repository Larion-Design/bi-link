import React, { useCallback, useMemo } from 'react'
import Box from '@mui/material/Box'
import { PersonAPIInput } from 'defs'
import { useCopyToClipboard } from 'usehooks-ts'
import { formatDate } from 'tools'
import { useReportState } from '../../../state/report/reportState'
import { getPersonAge, getPersonFullName } from '../../../utils/person'
import { EntityInfoTable } from './entityInfoTable'
import { DocumentsInfoTable } from './person/documentsInfoTable'

type Props = {
  personId: string
  personInfo: PersonAPIInput
}

export const PersonInfoDrawer: React.FunctionComponent<Props> = ({ personId, personInfo }) => {
  const [_, copy] = useCopyToClipboard()
  const { addDataRef } = useReportState()

  const generalInfo = useMemo(
    () => ({
      firstName: personInfo.firstName.value,
      lastName: personInfo.lastName.value,
      age: getPersonAge(personInfo),
      fullName: getPersonFullName(personInfo),
      cnp: personInfo.cnp.value,
      birthdate: personInfo.birthdate ? formatDate(personInfo.birthdate.value) : '',
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
    (key: string) =>
      void copy(`{{${addDataRef({ entityType: 'PERSON', entityId: personId }, key)}}}`),
    [personId],
  )

  const copyCustomField = useCallback(
    (key: string) =>
      void copy(
        `{{${addDataRef(
          { entityType: 'PERSON', entityId: personId },
          'fieldName',
          'customFields',
          key,
        )}}}`,
      ),
    [personId],
  )

  const copyContactInfo = useCallback(
    (key: string) =>
      void copy(
        addDataRef(
          { entityType: 'PERSON', entityId: personId },
          'fieldName',
          'contactDetails',
          key,
        ),
      ),
    [personId],
  )

  const copyIdDocumentInfo = useCallback(
    (key: string, field: string) =>
      void copy(addDataRef({ entityType: 'PERSON', entityId: personId }, field, 'documents', key)),
    [personId],
  )

  return (
    <Box>
      <EntityInfoTable
        label={'Informatii generale'}
        data={generalInfo}
        createDataRef={copyGeneralInfo}
        missingDataMessage={'Nu exista informatii.'}
      />
      <EntityInfoTable
        label={'Informatii suplimentare'}
        data={extraInfo}
        createDataRef={copyCustomField}
        missingDataMessage={'Nu exista informatii.'}
      />
      <EntityInfoTable
        label={'Date de contact'}
        data={contactDetails}
        createDataRef={copyContactInfo}
        missingDataMessage={'Nu exista date de contact.'}
      />
      <DocumentsInfoTable documents={personInfo.documents} createDataRef={copyIdDocumentInfo} />
    </Box>
  )
}
