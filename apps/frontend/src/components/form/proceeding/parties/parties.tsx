import React, { useCallback, useEffect, useRef, useState } from 'react'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import Stack from '@mui/material/Stack'
import Box from '@mui/material/Box'
import AddOutlinedIcon from '@mui/icons-material/AddOutlined'
import Tooltip from '@mui/material/Tooltip'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import { getDefaultInvolvedCompany, getDefaultInvolvedPerson } from 'tools'
import { useProceedingState } from '../../../../state/proceedingState'
import { useDialog } from '@frontend/components/dialog/dialogProvider'
import { InvolvedCompany } from '@frontend/components/form/proceeding/parties/involvedCompany'
import { InvolvedPerson } from '@frontend/components/form/proceeding/parties/involvedPerson'
import { useModal } from '@frontend/components/modal/modalProvider'
import { getCompaniesInfoMap } from '@frontend/graphql/companies/queries/getCompanies'
import { getPersonsBasicInfoMap } from '@frontend/graphql/persons/queries/getPersonsBasicInfo'

export const Parties: React.FunctionComponent = () => {
  const { openDialog } = useDialog()
  const { entitiesInvolved, addInvolvedEntities, removeInvolvedEntity } = useProceedingState()

  const modal = useModal()
  const menuButtonRef = useRef<Element | null>(null)
  const [isMenuOpen, setMenuOpenState] = useState(false)

  const { fetchPersons, personsMap } = getPersonsBasicInfoMap()
  const { fetchCompanies, companiesMap } = getCompaniesInfoMap()

  const showRemovePartyPrompt = useCallback(
    (partyId: string) =>
      openDialog({
        title: 'Esti sigur(a) ca vrei sa stergi informatiile selectate?',
        description: 'Odata sterse, acestea nu vor mai putea fi recuperate.',
        onConfirm: () => removeInvolvedEntity(partyId),
      }),
    [openDialog, removeInvolvedEntity],
  )

  useEffect(() => {
    const personsIds = new Set<string>()
    const companiesIds = new Set<string>()

    entitiesInvolved.forEach(({ person, company }) => {
      if (person?._id) {
        personsIds.add(person._id)
      } else if (company?._id) {
        companiesIds.add(company._id)
      }
    })

    if (personsIds.size) {
      void fetchPersons({ variables: { personsIds: Array.from(personsIds) } })
    }

    if (companiesIds.size) {
      void fetchCompanies({ variables: { companiesIds: Array.from(companiesIds) } })
    }
  }, [entitiesInvolved])

  const openPersonsModal = useCallback(() => {
    const personsIds = new Set<string>()

    entitiesInvolved.forEach(({ person }) => {
      if (person?._id) {
        personsIds.add(person._id)
      }
    })

    modal?.openPersonSelector((personsIds: string[]) => {
      if (personsIds.length) {
        addInvolvedEntities(personsIds.map(getDefaultInvolvedPerson))
      }
    }, Array.from(personsIds))
  }, [entitiesInvolved])

  const openCompaniesModal = useCallback(() => {
    const companiesIds = new Set<string>()

    entitiesInvolved.forEach(({ company }) => {
      if (company?._id) {
        companiesIds.add(company._id)
      }
    })

    modal?.openCompanySelector((companiesIds: string[]) => {
      if (companiesIds.length) {
        addInvolvedEntities(companiesIds.map(getDefaultInvolvedCompany))
      }
    }, Array.from(companiesIds))
  }, [entitiesInvolved])

  const closeMenu = useCallback(() => setMenuOpenState(false), [setMenuOpenState])

  return (
    <>
      {isMenuOpen && !!menuButtonRef.current && (
        <Menu
          anchorEl={menuButtonRef.current}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
          open={isMenuOpen}
          onClose={closeMenu}
        >
          <MenuItem onClick={openPersonsModal}>Persoana</MenuItem>
          <MenuItem onClick={openCompaniesModal}>Companie</MenuItem>
        </Menu>
      )}
      <Box display={'flex'} justifyContent={'space-between'} alignItems={'baseline'}>
        <Tooltip title={'Adaugă o noua parte implicata in proces.'}>
          <Button
            variant={'contained'}
            onClick={() => setMenuOpenState(true)}
            startIcon={<AddOutlinedIcon />}
            ref={(ref) => (menuButtonRef.current = ref)}
          >
            <AddOutlinedIcon />
          </Button>
        </Tooltip>
      </Box>
      <Stack spacing={2}>
        {entitiesInvolved.size ? (
          Array.from(entitiesInvolved.entries()).map(([uid, { person, company }]) => {
            if (person?._id) {
              const personInfo = personsMap?.get(person._id)

              if (personInfo) {
                return (
                  <InvolvedPerson
                    key={uid}
                    partyId={uid}
                    personInfo={personInfo}
                    removeInvolvedEntity={() => showRemovePartyPrompt(uid)}
                  />
                )
              }
            } else if (company?._id) {
              const companyInfo = companiesMap?.get(company._id)

              if (companyInfo) {
                return (
                  <InvolvedCompany
                    key={uid}
                    partyId={uid}
                    companyInfo={companyInfo}
                    removeInvolvedEntity={() => showRemovePartyPrompt(uid)}
                  />
                )
              }
            }
          })
        ) : (
          <NoPartiesPlaceholder />
        )}
      </Stack>
    </>
  )
}

const NoPartiesPlaceholder: React.FunctionComponent = () => (
  <Box
    sx={{
      width: 1,
      height: 200,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    }}
  >
    <Typography variant={'body2'}>Nu ai adăugat nicio parte implicata in incident.</Typography>
  </Box>
)
