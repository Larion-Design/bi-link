import React, { useCallback, useEffect } from 'react'
import Grid from '@mui/material/Grid'
import CardContent from '@mui/material/CardContent'
import Card from '@mui/material/Card'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import AddOutlinedIcon from '@mui/icons-material/AddOutlined'
import Divider from '@mui/material/Divider'
import CardActions from '@mui/material/CardActions'
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined'
import Stack from '@mui/material/Stack'
import { PartyAPI } from 'defs'
import { getPersonsBasicInfoRequest } from '@frontend/graphql/persons/queries/getPersonsBasicInfo'
import { useModal } from '../../../modal/modalProvider'
import { PartyCardGeneralInformation } from './partyCardGeneralInformation'
import { LinkedEntityCustomFields } from '../../linkedEntityCustomFields'
import { useDialog } from '../../../dialog/dialogProvider'
import { getCompaniesInfoRequest } from '@frontend/graphql/companies/queries/getCompanies'
import { PartyPersons } from './partyPersons'
import { PartyCompanies } from './partyCompanies'
import { PartyProperties } from './partyProperties'
import {
  createConnectedEntities,
  findEntityIndex,
  getEntitiesIds,
} from '@frontend/utils/connectedEntityHelpers'
import { getPropertiesRequest } from '@frontend/graphql/properties/queries/getProperties'

type Props = {
  partyId: string
  partyInfo: PartyAPI
  removeParty: (partyId: string) => void
  updateParty: (partyId: string, partyInfo: PartyAPI) => void
}

export const PartyCard: React.FunctionComponent<Props> = ({
  partyId,
  partyInfo,
  updateParty,
  removeParty,
}) => {
  const modal = useModal()
  const { openDialog } = useDialog()

  const showRemovePartyPrompt = useCallback(
    () =>
      openDialog({
        title: 'Esti sigur(a) ca vrei sa stergi informatiile selectate?',
        description: 'Odata sterse, acestea nu vor mai putea fi recuperate.',
        onConfirm: () => removeParty(partyId),
      }),
    [openDialog],
  )

  const [fetchPersons, { data: personsInfo }] = getPersonsBasicInfoRequest()
  const [fetchProperties, { data: propertiesInfo }] = getPropertiesRequest()
  const [fetchCompanies, { data: companiesInfo }] = getCompaniesInfoRequest()

  const openPersonsModal = useCallback(() => {
    const personsIds = getEntitiesIds(partyInfo.persons)
    modal?.openPersonSelector((selectedPersonsIds) => {
      const updatedPersons = createConnectedEntities(
        Array.from(new Set([...personsIds, ...selectedPersonsIds])),
      )
      updateParty(partyId, { ...partyInfo, persons: updatedPersons })
    }, personsIds)
  }, [partyInfo])

  const openPropertiesModal = useCallback(() => {
    const propertiesIds = getEntitiesIds(partyInfo.properties)

    modal?.openPropertySelector((selectedPropertiesIds) => {
      const updateProperties = createConnectedEntities(
        Array.from(new Set([...propertiesIds, ...selectedPropertiesIds])),
      )
      updateParty(partyId, { ...partyInfo, properties: updateProperties })
    }, propertiesIds)
  }, [partyInfo])

  const openCompaniesModal = useCallback(() => {
    const companiesIds = getEntitiesIds(partyInfo.companies)

    modal?.openCompanySelector((selectedCompaniesIds) => {
      const updatedCompanies = createConnectedEntities(
        Array.from(new Set([...companiesIds, ...selectedCompaniesIds])),
      )
      updateParty(partyId, { ...partyInfo, companies: updatedCompanies })
    }, companiesIds)
  }, [partyInfo])

  const removePerson = useCallback(
    (personId: string) => {
      const personIndex = findEntityIndex(personId, partyInfo.persons)

      if (personIndex > -1) {
        partyInfo.persons.splice(personIndex, 1)
        updateParty(partyId, {
          ...partyInfo,
          persons: [...partyInfo.persons],
        })
      }
    },
    [partyInfo.persons],
  )

  const removeCompany = useCallback(
    (companyId: string) => {
      const companyIndex = findEntityIndex(companyId, partyInfo.companies)

      if (companyIndex > -1) {
        partyInfo.companies.splice(companyIndex, 1)
        updateParty(partyId, {
          ...partyInfo,
          companies: [...partyInfo.companies],
        })
      }
    },
    [partyInfo.companies],
  )

  const removeProperty = useCallback(
    (propertyId: string) => {
      const propertyIndex = findEntityIndex(propertyId, partyInfo.properties)

      if (propertyIndex > -1) {
        partyInfo.properties.splice(propertyIndex, 1)
        updateParty(partyId, {
          ...partyInfo,
          properties: [...partyInfo.properties],
        })
      }
    },
    [partyInfo.properties],
  )

  useEffect(() => {
    const personsIds = getEntitiesIds(partyInfo.persons)

    if (personsIds.length) {
      void fetchPersons({ variables: { personsIds } })
    }
  }, [partyInfo.persons])

  useEffect(() => {
    const propertiesIds = getEntitiesIds(partyInfo.properties)

    if (propertiesIds.length) {
      void fetchProperties({ variables: { propertiesIds } })
    }
  }, [partyInfo.properties])

  useEffect(() => {
    const companiesIds = getEntitiesIds(partyInfo.companies)

    if (companiesIds.length) {
      void fetchCompanies({ variables: { companiesIds } })
    }
  }, [partyInfo.companies])

  return (
    <Card sx={{ p: 1, mt: 4 }} variant={'outlined'}>
      <CardContent>
        <Grid container spacing={5}>
          <Grid item xs={6}>
            <PartyCardGeneralInformation
              partyId={partyId}
              partyInfo={partyInfo}
              updateParty={updateParty}
            />
          </Grid>
          <Grid item xs={6}>
            <LinkedEntityCustomFields
              customFields={partyInfo.customFields}
              updateCustomFields={(customFields) =>
                updateParty(partyId, {
                  ...partyInfo,
                  customFields,
                })
              }
            />
          </Grid>
        </Grid>

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

        <Stack direction={'row'} spacing={8} mt={4}>
          <Box width={0.33}>
            <PartyPersons
              personsInfo={personsInfo?.getPersonsInfo}
              persons={partyInfo.persons}
              removePerson={removePerson}
            />
          </Box>

          <Box width={0.33}>
            <PartyCompanies
              companies={partyInfo.companies}
              companiesInfo={companiesInfo?.getCompanies}
              removeCompany={removeCompany}
            />
          </Box>

          <Box width={0.33}>
            <PartyProperties
              properties={partyInfo.properties}
              propertiesInfo={propertiesInfo?.getProperties}
              removeProperty={removeProperty}
            />
          </Box>
        </Stack>
        <Divider sx={{ mt: 2, mb: 2 }} />
      </CardContent>
      <CardActions>
        <Button
          size={'small'}
          variant={'contained'}
          color={'error'}
          startIcon={<DeleteOutlinedIcon />}
          onClick={showRemovePartyPrompt}
        >
          Sterge
        </Button>
      </CardActions>
    </Card>
  )
}
