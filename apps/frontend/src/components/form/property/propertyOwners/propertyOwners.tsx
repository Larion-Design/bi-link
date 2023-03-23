import React, { useCallback, useEffect, useRef, useState } from 'react'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Timeline from '@mui/lab/Timeline'
import AddOutlinedIcon from '@mui/icons-material/AddOutlined'
import Typography from '@mui/material/Typography'
import { timelineOppositeContentClasses } from '@mui/lab/TimelineOppositeContent'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import { getPersonsBasicInfoRequest } from '@frontend/graphql/persons/queries/getPersonsBasicInfo'
import { getCompaniesInfoRequest } from '@frontend/graphql/companies/queries/getCompanies'
import { useModal } from '../../../modal/modalProvider'
import { PersonOwnerCard } from './personOwnerCard'
import { CompanyOwnerCard } from './companyOwnerCard'
import { useDebouncedMap } from '@frontend/utils/hooks/useMap'
import { PropertyOwnerAPI } from 'defs'

type Props = {
  isVehicle: boolean
  owners: PropertyOwnerAPI[]
  updateOwners: (owners: PropertyOwnerAPI[]) => void | Promise<void>
}

export const PropertyOwners: React.FunctionComponent<Props> = ({
  isVehicle,
  owners,
  updateOwners,
}) => {
  const modal = useModal()
  const { uid, values, addBulk, remove, update } = useDebouncedMap(
    1000,
    owners,
    ({ person, company }) => person?._id ?? company?._id,
  )

  const menuButtonRef = useRef<Element | null>(null)
  const [isMenuOpen, setMenuOpenState] = useState(false)

  const [fetchPersons, { data: personsInfo }] = getPersonsBasicInfoRequest()
  const [fetchCompanies, { data: companiesInfo }] = getCompaniesInfoRequest()

  useEffect(() => {
    const personsIds: string[] = []
    const companiesIds: string[] = []
    const updatedOwners = values()

    updatedOwners.forEach(({ person, company }) => {
      if (person?._id) {
        personsIds.push(person._id)
      } else if (company?._id) {
        companiesIds.push(company._id)
      }
    })

    if (personsIds.length) {
      void fetchPersons({ variables: { personsIds } })
    }

    if (companiesIds.length) {
      void fetchCompanies({ variables: { companiesIds } })
    }
    updateOwners(updatedOwners)
  }, [uid])

  const openPersonsModal = useCallback(() => {
    const personsIds: string[] = []

    values().forEach(({ person }) => {
      if (person?._id) {
        personsIds.push(person._id)
      }
    })

    modal?.openPersonSelector((personsIds: string[]) => {
      if (personsIds.length) {
        addBulk(createPersonsOwners(personsIds, isVehicle), ({ person }) => person?._id)
      }
    }, personsIds)
  }, [uid, isVehicle])

  const openCompaniesModal = useCallback(() => {
    const companiesIds: string[] = []

    values().forEach(({ company }) => {
      if (company?._id) {
        companiesIds.push(company._id)
      }
    })

    modal?.openCompanySelector((companiesIds: string[]) => {
      if (companiesIds.length) {
        addBulk(createCompaniesOwners(companiesIds, isVehicle), ({ company }) => company?._id)
      }
    }, companiesIds)
  }, [uid, isVehicle])

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
        <Box display={'flex'} justifyContent={'space-between'}>
          <Button
            variant={'contained'}
            onClick={() => setMenuOpenState(true)}
            sx={{ mr: 1 }}
            startIcon={<AddOutlinedIcon />}
            ref={(ref) => (menuButtonRef.current = ref)}
          >
            Proprietar
          </Button>
        </Box>
      </Box>
      {owners.length ? (
        <Timeline
          sx={{
            [`& .${timelineOppositeContentClasses.root}`]: {
              flex: 0.1,
            },
          }}
        >
          {values()
            .sort(sortByOwnershipPeriod)
            .map((owner) => {
              const personId = owner.person?._id

              if (personId) {
                const personInfo = personsInfo?.getPersonsInfo?.find(({ _id }) => _id === personId)

                if (personInfo) {
                  return (
                    <PersonOwnerCard
                      key={personId}
                      ownerInfo={owner}
                      personInfo={personInfo}
                      updateOwnerInfo={update}
                      removeOwner={remove}
                    />
                  )
                }
              }

              const companyId = owner.company?._id

              if (companyId) {
                const companyInfo = companiesInfo?.getCompanies?.find(
                  ({ _id }) => _id === companyId,
                )

                if (companyInfo) {
                  return (
                    <CompanyOwnerCard
                      key={companyId}
                      ownerInfo={owner}
                      companyInfo={companyInfo}
                      updateOwnerInfo={update}
                      removeOwner={remove}
                    />
                  )
                }
              }
              return null
            })}
        </Timeline>
      ) : (
        <Box
          sx={{
            width: 1,
            height: 200,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Typography variant={'body2'}>Nu ai adăugat niciun proprietar.</Typography>
        </Box>
      )}
    </>
  )
}

const createPersonsOwners = (personsIds: string[], isVehicle: boolean): PropertyOwnerAPI[] =>
  personsIds.map((_id) => ({
    person: {
      _id,
    },
    customFields: [],
    startDate: null,
    endDate: null,
    _confirmed: true,
    vehicleOwnerInfo: isVehicle ? { plateNumbers: [] } : null,
  }))

const createCompaniesOwners = (companiesIds: string[], isVehicle: boolean): PropertyOwnerAPI[] =>
  companiesIds.map((_id) => ({
    company: {
      _id,
    },
    registrationNumber: '',
    customFields: [],
    startDate: null,
    endDate: null,
    _confirmed: true,
    vehicleOwnerInfo: isVehicle ? { plateNumbers: [] } : null,
  }))

const sortByOwnershipPeriod = (ownerA: PropertyOwnerAPI, ownerB: PropertyOwnerAPI) => {
  if (ownerA.startDate) {
    if (ownerB.startDate) {
      return ownerA.startDate <= ownerB.startDate ? -1 : 1
    }
    if (ownerB.endDate) {
      return ownerA.startDate <= ownerB.endDate ? -1 : 1
    }
  }
  if (ownerA.endDate) {
    if (ownerB.startDate) {
      return ownerA.endDate <= ownerB.startDate ? -1 : 1
    }
    if (ownerB.endDate) {
      return ownerA.endDate <= ownerB.endDate ? -1 : 1
    }
  }
  return 0
}
