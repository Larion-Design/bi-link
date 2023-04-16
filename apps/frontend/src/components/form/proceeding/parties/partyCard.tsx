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
import { ProceedingEntityInvolvedAPI } from 'defs'
import { getPersonsBasicInfoRequest } from '@frontend/graphql/persons/queries/getPersonsBasicInfo'
import { useModal } from '../../../modal/modalProvider'
import { PartyCardGeneralInformation } from './partyCardGeneralInformation'
import { useDialog } from '../../../dialog/dialogProvider'
import { getCompaniesInfoRequest } from '@frontend/graphql/companies/queries/getCompanies'
import { PartyPersons } from './partyPersons'
import { PartyCompanies } from './partyCompanies'
import { getEntitiesIds } from '@frontend/utils/connectedEntityHelpers'

type Props<T = ProceedingEntityInvolvedAPI> = {
  partyId: string
  partyInfo: T
  updateParty: (partyId: string, partyInfo: T) => void
  removeParty: (partyId: string) => void
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
  const [fetchCompanies, { data: companiesInfo }] = getCompaniesInfoRequest()

  const openPersonsModal = useCallback(() => {
    const personsIds = partyInfo.person ? getEntitiesIds([partyInfo.person]) : []
    modal?.openPersonSelector((selectedPersonsIds) => {
      updateParty(partyId, {
        ...partyInfo,
        person: selectedPersonsIds.length ? { _id: selectedPersonsIds[0] } : null,
      })
    }, personsIds)
  }, [partyInfo])

  const openCompaniesModal = useCallback(() => {
    modal?.openCompanySelector(
      (selectedCompaniesIds) => {
        updateParty(partyId, {
          ...partyInfo,
          company: selectedCompaniesIds.length ? { _id: selectedCompaniesIds[0] } : null,
        })
      },
      partyInfo.company?._id ? [partyInfo.company?._id] : [],
    )
  }, [partyInfo])

  useEffect(() => {
    if (partyInfo.person?._id) {
      void fetchPersons({ variables: { personsIds: [partyInfo.person?._id] } })
    }
  }, [partyInfo.person?._id])

  useEffect(() => {
    if (partyInfo.company?._id) {
      void fetchCompanies({ variables: { companiesIds: [partyInfo.company?._id] } })
    }
  }, [partyInfo.company?._id])

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
        </Stack>

        <Stack direction={'row'} spacing={8} mt={4}>
          {!!partyInfo.person && (
            <Box>
              <PartyPersons
                personsInfo={personsInfo?.getPersonsInfo}
                persons={[partyInfo.person]}
              />
            </Box>
          )}

          {!!partyInfo.company && (
            <Box>
              <PartyCompanies
                companies={[partyInfo.company]}
                companiesInfo={companiesInfo?.getCompanies}
              />
            </Box>
          )}
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
