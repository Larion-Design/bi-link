import React, { useCallback, useEffect, useMemo } from 'react'
import { CompanyAPIOutput, CustomFieldAPI, PersonAPIOutput, PropertyAPIOutput } from 'defs'
import CardContent from '@mui/material/CardContent'
import Card from '@mui/material/Card'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import AddOutlinedIcon from '@mui/icons-material/AddOutlined'
import Divider from '@mui/material/Divider'
import CardActions from '@mui/material/CardActions'
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined'
import Stack from '@mui/material/Stack'
import { getPersonsBasicInfoRequest } from '@frontend/graphql/persons/queries/getPersonsBasicInfo'
import { FormattedMessage } from 'react-intl'
import { useEventState } from '../../../../state/eventState'
import { useModal } from '../../../modal/modalProvider'
import { PartyCardGeneralInformation } from './partyCardGeneralInformation'
import { LinkedEntityCustomFields } from '../../linkedEntityCustomFields'
import { useDialog } from '../../../dialog/dialogProvider'
import { getCompaniesInfoRequest } from '@frontend/graphql/companies/queries/getCompanies'
import { PartyPersons } from './partyPersons'
import { PartyCompanies } from './partyCompanies'
import { PartyProperties } from './partyProperties'
import { getPropertiesRequest } from '@frontend/graphql/properties/queries/getProperties'

type Props = {
  partyId: string
}

export const PartyCard: React.FunctionComponent<Props> = ({ partyId }) => {
  const modal = useModal()
  const { openDialog } = useDialog()
  const {
    parties,
    participantsCustomFields,
    removeParticipant,
    setParticipantPersons,
    setParticipantCompanies,
    setParticipantProperties,
    addParticipantCustomField,
    updateParticipantCustomField,
    removeParticipantCustomFields,
  } = useEventState()

  const showRemovePartyPrompt = useCallback(
    () =>
      openDialog({
        title: 'Esti sigur(a) ca vrei sa stergi informatiile selectate?',
        description: 'Odata sterse, acestea nu vor mai putea fi recuperate.',
        onConfirm: () => removeParticipant(partyId),
      }),
    [openDialog, removeParticipant],
  )

  const [fetchPersons, { data: personsInfo }] = getPersonsBasicInfoRequest()
  const [fetchProperties, { data: propertiesInfo }] = getPropertiesRequest()
  const [fetchCompanies, { data: companiesInfo }] = getCompaniesInfoRequest()

  const personsInfoMap = useMemo(() => {
    if (personsInfo?.getPersonsInfo) {
      const map = new Map<string, PersonAPIOutput>()
      personsInfo.getPersonsInfo.forEach((personInfo) => map.set(personInfo._id, personInfo))
      return map
    }
  }, [personsInfo?.getPersonsInfo])

  const companiesInfoMap = useMemo(() => {
    if (companiesInfo?.getCompanies) {
      const map = new Map<string, CompanyAPIOutput>()
      companiesInfo.getCompanies.forEach((companyInfo) => map.set(companyInfo._id, companyInfo))
      return map
    }
  }, [companiesInfo?.getCompanies])

  const propertiesInfoMap = useMemo(() => {
    if (propertiesInfo?.getProperties) {
      const map = new Map<string, PropertyAPIOutput>()
      propertiesInfo.getProperties.forEach((propertyInfo) =>
        map.set(propertyInfo._id, propertyInfo),
      )
      return map
    }
  }, [propertiesInfo?.getProperties])

  const partyInfo = useMemo(() => parties.get(partyId), [parties])
  const customFields = useMemo(() => {
    const customFieldsMap = new Map<string, CustomFieldAPI>()
    partyInfo.customFields.forEach((uid) =>
      customFieldsMap.set(uid, participantsCustomFields.get(uid)),
    )
    return customFieldsMap
  }, [partyInfo.customFields, participantsCustomFields])

  const openPersonsModal = useCallback(() => {
    const personsIds = Array.from(partyInfo.persons)
    modal?.openPersonSelector(
      (selectedPersonsIds) =>
        setParticipantPersons(partyId, Array.from(new Set([...personsIds, ...selectedPersonsIds]))),
      personsIds,
    )
  }, [parties, setParticipantPersons])

  const openPropertiesModal = useCallback(() => {
    const propertiesIds = Array.from(partyInfo.properties)

    modal?.openPropertySelector(
      (selectedPropertiesIds) =>
        setParticipantProperties(
          partyId,
          Array.from(new Set([...propertiesIds, ...selectedPropertiesIds])),
        ),
      propertiesIds,
    )
  }, [partyId, setParticipantProperties])

  const openCompaniesModal = useCallback(() => {
    const companiesIds = Array.from(partyInfo.companies)
    modal?.openCompanySelector(
      (selectedCompaniesIds) =>
        setParticipantCompanies(
          partyId,
          Array.from(new Set([...companiesIds, ...selectedCompaniesIds])),
        ),
      companiesIds,
    )
  }, [partyId, setParticipantCompanies])

  const removePerson = useCallback(
    (personId: string) => {
      if (partyInfo.persons.delete(personId)) {
        setParticipantPersons(partyId, Array.from(partyInfo.persons))
      }
    },
    [partyId, partyInfo.persons, setParticipantPersons],
  )

  const removeCompany = useCallback(
    (companyId: string) => {
      if (partyInfo.companies.delete(companyId)) {
        setParticipantCompanies(partyId, Array.from(partyInfo.companies))
      }
    },
    [partyId, partyInfo.companies, setParticipantPersons],
  )

  const removeProperty = useCallback(
    (propertyId: string) => {
      if (partyInfo.properties.delete(propertyId)) {
        setParticipantProperties(partyId, Array.from(partyInfo.properties))
      }
    },
    [partyId, partyInfo.properties, setParticipantCompanies],
  )

  useEffect(() => {
    if (partyInfo.persons.size) {
      void fetchPersons({ variables: { personsIds: Array.from(partyInfo.persons) } })
    }
  }, [partyInfo.persons])

  useEffect(() => {
    if (partyInfo.properties.size) {
      void fetchProperties({ variables: { propertiesIds: Array.from(partyInfo.properties) } })
    }
  }, [partyInfo.properties])

  useEffect(() => {
    if (partyInfo.companies.size) {
      void fetchCompanies({ variables: { companiesIds: Array.from(partyInfo.companies) } })
    }
  }, [partyInfo.companies])

  return (
    <Card sx={{ p: 1, mt: 4 }} variant={'outlined'}>
      <CardContent>
        <Stack direction={'row'} spacing={5}>
          <PartyCardGeneralInformation partyId={partyId} />

          <LinkedEntityCustomFields
            customFields={customFields}
            updateCustomField={updateParticipantCustomField}
            addCustomField={() => addParticipantCustomField(partyId)}
            removeCustomFields={(ids) => removeParticipantCustomFields(partyId, ids)}
          />
        </Stack>

        <Stack spacing={2} direction={'row'} mt={2}>
          <Button
            onClick={openPersonsModal}
            color={'primary'}
            variant={'contained'}
            startIcon={<AddOutlinedIcon />}
            size={'small'}
          >
            Persoana
          </Button>
          <Button
            onClick={openCompaniesModal}
            color={'primary'}
            variant={'contained'}
            startIcon={<AddOutlinedIcon />}
            size={'small'}
          >
            Companie
          </Button>
          <Button
            onClick={openPropertiesModal}
            color={'primary'}
            variant={'contained'}
            startIcon={<AddOutlinedIcon />}
            size={'small'}
          >
            Proprietate
          </Button>
        </Stack>

        <Stack sx={{ width: 1 }} direction={'row'} spacing={8} mt={4}>
          <Box width={0.33}>
            <PartyPersons
              personsInfo={personsInfoMap}
              persons={partyInfo.persons}
              removePerson={removePerson}
            />
          </Box>

          <Box width={0.33}>
            <PartyCompanies
              companies={partyInfo.companies}
              companiesInfo={companiesInfoMap}
              removeCompany={removeCompany}
            />
          </Box>

          <Box width={0.33}>
            <PartyProperties
              properties={partyInfo.properties}
              propertiesInfo={propertiesInfoMap}
              removeProperty={removeProperty}
            />
          </Box>
        </Stack>
        <Divider sx={{ mt: 2, mb: 2 }} variant={'fullWidth'} />
      </CardContent>
      <CardActions>
        <Button
          size={'small'}
          variant={'contained'}
          color={'error'}
          startIcon={<DeleteOutlinedIcon />}
          onClick={showRemovePartyPrompt}
        >
          <FormattedMessage id={'remove'} />
        </Button>
      </CardActions>
    </Card>
  )
}
