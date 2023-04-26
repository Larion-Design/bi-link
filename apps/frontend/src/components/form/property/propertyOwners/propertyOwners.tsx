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
import { getPersonsBasicInfoRequest } from '@frontend/graphql/persons/queries/getPersonsBasicInfo'
import { getCompaniesInfoRequest } from '@frontend/graphql/companies/queries/getCompanies'
import { getDefaultOwner } from 'tools'
import { usePropertyState } from '../../../../state/propertyState'
import { useModal } from '../../../modal/modalProvider'
import { PersonOwnerCard } from './personOwnerCard'
import { CompanyOwnerCard } from './companyOwnerCard'
import { useDebouncedMap } from '@frontend/utils/hooks/useMap'

export const PropertyOwners: React.FunctionComponent = () => {
  const { owners, vehicleInfo, realEstateInfo, addOwner, updateOwner, removeOwner } =
    usePropertyState()
  const modal = useModal()
  const menuButtonRef = useRef<Element | null>(null)
  const [isMenuOpen, setMenuOpenState] = useState(false)

  const [fetchPersons, { data: personsInfo }] = getPersonsBasicInfoRequest()
  const [fetchCompanies, { data: companiesInfo }] = getCompaniesInfoRequest()

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
        addOwner(createPersonsOwners(personsIds, !!vehicleInfo))
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
