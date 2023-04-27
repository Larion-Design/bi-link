import React, { useCallback, useEffect, useRef, useState } from 'react'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Timeline from '@mui/lab/Timeline'
import AddOutlinedIcon from '@mui/icons-material/AddOutlined'
import Typography from '@mui/material/Typography'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import { PropertyOwnerAPI } from 'defs'
import { timelineOppositeContentClasses } from '@mui/lab/TimelineOppositeContent'
import { getPersonsBasicInfoMap } from '@frontend/graphql/persons/queries/getPersonsBasicInfo'
import { getCompaniesInfoMap } from '@frontend/graphql/companies/queries/getCompanies'
import { getDefaultOwner } from 'tools'
import { PropertyOwnerInfoState } from '../../../../state/property/propertyOwnerState'
import { usePropertyState } from '../../../../state/property/propertyState'
import { useModal } from '../../../modal/modalProvider'
import { PersonOwnerCard } from './personOwnerCard'
import { CompanyOwnerCard } from './companyOwnerCard'

export const PropertyOwners: React.FunctionComponent = () => {
  const { owners, vehicleInfo, addOwners } = usePropertyState()
  const modal = useModal()
  const menuButtonRef = useRef<Element | null>(null)
  const [isMenuOpen, setMenuOpenState] = useState(false)

  const { fetchPersons, personsMap } = getPersonsBasicInfoMap()
  const { fetchCompanies, companiesMap } = getCompaniesInfoMap()

  useEffect(() => {
    const personsIds = new Set<string>()
    const companiesIds = new Set<string>()

    owners.forEach(({ person, company }) => {
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
  }, [owners])

  const openPersonsModal = useCallback(() => {
    const personsIds = new Set<string>()

    owners.forEach(({ person }) => {
      if (person?._id) {
        personsIds.add(person._id)
      }
    })

    modal?.openPersonSelector((personsIds: string[]) => {
      if (personsIds.length) {
        addOwners(createPersonsOwners(personsIds, !!vehicleInfo))
      }
    }, Array.from(personsIds))
  }, [owners, vehicleInfo])

  const openCompaniesModal = useCallback(() => {
    const companiesIds = new Set<string>()

    owners.forEach(({ company }) => {
      if (company?._id) {
        companiesIds.add(company._id)
      }
    })

    modal?.openCompanySelector((companiesIds: string[]) => {
      if (companiesIds.length) {
        addOwners(createCompaniesOwners(companiesIds, !!vehicleInfo))
      }
    }, Array.from(companiesIds))
  }, [owners, vehicleInfo])

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
      {owners.size ? (
        <Timeline
          sx={{
            [`& .${timelineOppositeContentClasses.root}`]: {
              flex: 0.1,
            },
          }}
        >
          {Array.from(owners.entries())
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            .sort(([uidA, ownerInfoA], [uidB, ownerInfoB]) =>
              sortByOwnershipPeriod(ownerInfoA, ownerInfoB),
            )
            .map(([uid, owner]) => {
              const personId = owner.person?._id

              if (personId) {
                const personInfo = personsMap?.get(personId)

                if (personInfo) {
                  return <PersonOwnerCard key={uid} ownerId={uid} personInfo={personInfo} />
                }
              }

              const companyId = owner.company?._id

              if (companyId) {
                const companyInfo = companiesMap?.get(companyId)

                if (companyInfo) {
                  return <CompanyOwnerCard key={uid} ownerId={uid} companyInfo={companyInfo} />
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

const createPersonsOwners = (personsIds: string[], isVehicle: boolean) =>
  personsIds.map(
    (_id): PropertyOwnerAPI => ({
      ...getDefaultOwner(),
      person: { _id },
      customFields: [],
      startDate: null,
      endDate: null,
      vehicleOwnerInfo: isVehicle ? { plateNumbers: [] } : null,
    }),
  )

const createCompaniesOwners = (companiesIds: string[], isVehicle: boolean) =>
  companiesIds.map(
    (_id): PropertyOwnerAPI => ({
      ...getDefaultOwner(),
      company: { _id },
      vehicleOwnerInfo: isVehicle ? { plateNumbers: [] } : null,
    }),
  )

const sortByOwnershipPeriod = (ownerA: PropertyOwnerInfoState, ownerB: PropertyOwnerInfoState) => {
  if (ownerA.startDate?.value) {
    if (ownerB.startDate?.value) {
      return ownerA.startDate?.value <= ownerB.startDate?.value ? -1 : 1
    }
    if (ownerB.endDate?.value) {
      return ownerA.startDate?.value <= ownerB.endDate?.value ? -1 : 1
    }
  }
  if (ownerA.endDate?.value) {
    if (ownerB.startDate?.value) {
      return ownerA.endDate?.value <= ownerB.startDate?.value ? -1 : 1
    }
    if (ownerB.endDate?.value) {
      return ownerA.endDate <= ownerB.endDate ? -1 : 1
    }
  }
  return 0
}
