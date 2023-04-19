import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import Stack from '@mui/material/Stack'
import AddOutlinedIcon from '@mui/icons-material/AddOutlined'
import Button from '@mui/material/Button'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import Divider from '@mui/material/Divider'
import Typography from '@mui/material/Typography'
import Grid from '@mui/material/Grid'
import Tooltip from '@mui/material/Tooltip'
import InsertChartOutlinedIcon from '@mui/icons-material/InsertChartOutlined'
import { AssociateAPI, CompanyAPIOutput, EntityType, PersonAPIOutput } from 'defs'
import { getDefaultAssociate, getDefaultMetadata } from 'tools'
import { getPersonsBasicInfoRequest } from '@frontend/graphql/persons/queries/getPersonsBasicInfo'
import { getCompaniesInfoRequest } from '@frontend/graphql/companies/queries/getCompanies'
import { useCompanyState } from '../../../../state/companyState'
import { useModal } from '../../../modal/modalProvider'
import { AssociatesCategory } from './generic/associatesCategory'
import { getShareholdersTotalEquity } from './helpers'

type Props<T = AssociateAPI> = {
  sectionTitle: string
}

type DefaultAssociateRole = 'Actionar' | 'Administrator' | ''

export const Associates: React.FunctionComponent<Props> = ({ sectionTitle }) => {
  const modal = useModal()
  const [fetchPersonsInfo, { data: personsInfo }] = getPersonsBasicInfoRequest()
  const [fetchCompaniesInfo, { data: companiesInfo }] = getCompaniesInfoRequest()

  const [isMenuOpen, setMenuState] = useState<boolean>(false)
  const buttonRef = useRef<Element | null>()
  const [entityType, setEntityType] = useState<Extract<EntityType, 'PERSON' | 'COMPANY'> | null>(
    null,
  )
  const [role, setRole] = useState<DefaultAssociateRole | null>(null)

  const [associates, updateAssociate, addAssociates, removeAssociate] = useCompanyState(
    ({ associates, updateAssociate, addAssociates, removeAssociate }) => [
      associates,
      updateAssociate,
      addAssociates,
      removeAssociate,
    ],
  )

  const selectRoleHandler = useCallback(
    (newRole: DefaultAssociateRole) => {
      setRole(newRole)
      setMenuState(false)

      const personsIds = new Set<string>()
      const companiesIds = new Set<string>()

      associates.forEach(({ person, company }) => {
        if (person?._id) {
          personsIds.add(person._id)
        } else {
          companiesIds.add(company._id)
        }
      })

      switch (entityType) {
        case 'PERSON': {
          const addSelectedPersonsAssociates = (selectedPersonsIds: string[]) => {
            if (selectedPersonsIds.length) {
              addAssociates(createPersonsAssociatesByRole(selectedPersonsIds, newRole))
            }
          }
          return modal?.openPersonSelector(addSelectedPersonsAssociates, Array.from(personsIds))
        }
        case 'COMPANY': {
          const addSelectedCompaniesAssociates = (selectedCompaniesIds: string[]) => {
            if (selectedCompaniesIds.length) {
              addAssociates(createCompaniesAssociatesByRole(selectedCompaniesIds, newRole))
            }
          }
          return modal?.openCompanySelector(
            addSelectedCompaniesAssociates,
            Array.from(companiesIds),
          )
        }
      }
    },
    [entityType, role],
  )

  useEffect(() => {
    const personsIds = new Set<string>()
    const companiesIds = new Set<string>()

    associates.forEach(({ person, company }) => {
      if (person?._id) {
        personsIds.add(person._id)
      } else if (company?._id) {
        companiesIds.add(company._id)
      }
    })

    if (personsIds.size) {
      void fetchPersonsInfo({ variables: { personsIds: Array.from(personsIds) } })
    }

    if (companiesIds.size) {
      void fetchCompaniesInfo({ variables: { companiesIds: Array.from(companiesIds) } })
    }
  }, [])

  const totalEquity = useMemo(
    () => parseFloat(getShareholdersTotalEquity(associates)),
    [associates],
  )

  const personsInfoMap = useMemo(() => {
    if (personsInfo?.getPersonsInfo) {
      const personsMap = new Map<string, PersonAPIOutput>()
      personsInfo?.getPersonsInfo.map((personInfo) => personsMap.set(personInfo._id, personInfo))
      return personsMap
    }
  }, [personsInfo?.getPersonsInfo])

  const companiesInfoMap = useMemo(() => {
    if (companiesInfo?.getCompanies) {
      const companiesMap = new Map<string, CompanyAPIOutput>()
      companiesInfo?.getCompanies.map((companyInfo) =>
        companiesMap.set(companyInfo._id, companyInfo),
      )
      return companiesMap
    }
  }, [personsInfo?.getPersonsInfo])

  return (
    <>
      {isMenuOpen && (
        <Menu
          open={isMenuOpen}
          anchorEl={buttonRef.current}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
          onClose={() => setMenuState(false)}
        >
          <MenuItem onClick={() => selectRoleHandler('Administrator')}>Administrator</MenuItem>
          <MenuItem onClick={() => selectRoleHandler('Actionar')}>Actionar</MenuItem>
          <Divider />
          <MenuItem onClick={() => selectRoleHandler('')}>Alt rol</MenuItem>
        </Menu>
      )}
      <Grid container sx={{ mt: 2, mb: 2 }} alignItems={'center'}>
        <Grid item xs={11}>
          <Stack direction={'row'} spacing={2} alignItems={'center'}>
            <Typography variant={'h5'}>{sectionTitle}</Typography>

            <Button
              variant={'contained'}
              startIcon={<AddOutlinedIcon />}
              onClick={({ currentTarget }) => {
                buttonRef.current = currentTarget
                setMenuState(true)
                setEntityType('PERSON')
              }}
            >
              Persoana
            </Button>

            <Button
              variant={'contained'}
              startIcon={<AddOutlinedIcon />}
              onClick={({ currentTarget }) => {
                buttonRef.current = currentTarget
                setMenuState(true)
                setEntityType('COMPANY')
              }}
            >
              Companie
            </Button>
          </Stack>
        </Grid>
        <Grid xs={1} item container alignItems={'center'} spacing={1}>
          <Grid item>
            <InsertChartOutlinedIcon color={totalEquity > 100 ? 'error' : 'inherit'} />
          </Grid>

          <Grid item>
            <Tooltip
              title={
                totalEquity > 100
                  ? 'Procentul total detinut de actionari nu poate depasi 100%.'
                  : 'Procentul total detinut de actionari'
              }
            >
              <Typography variant={'subtitle1'} color={totalEquity > 100 ? 'error' : 'inherit'}>
                {totalEquity}%
              </Typography>
            </Tooltip>
          </Grid>
        </Grid>
      </Grid>
      <Stack spacing={1}>
        <AssociatesCategory
          categoryName={'Administratori'}
          allowRoleChange={false}
          personsInfo={personsInfoMap}
          companiesInfo={companiesInfoMap}
          associates={getAssociatesByRole(associates, 'Administrator')}
          removeAssociate={removeAssociate}
          updateAssociate={updateAssociate}
        />

        <AssociatesCategory
          categoryName={'Actionari'}
          allowRoleChange={false}
          personsInfo={personsInfoMap}
          companiesInfo={companiesInfoMap}
          associates={getAssociatesByRole(associates, 'Actionar')}
          removeAssociate={removeAssociate}
          updateAssociate={updateAssociate}
        />

        <AssociatesCategory
          categoryName={'Alte entitati conexate'}
          allowRoleChange={true}
          personsInfo={personsInfoMap}
          companiesInfo={companiesInfoMap}
          associates={getAllAssociatesExceptRoles(associates, ['Administrator', 'Actionar'])}
          removeAssociate={removeAssociate}
          updateAssociate={updateAssociate}
        />
      </Stack>
    </>
  )
}

const createPersonsAssociatesByRole = (personsIds: string[], role: string | null) =>
  personsIds.map(
    (personId): AssociateAPI => ({
      ...getDefaultAssociate(),
      person: {
        _id: personId,
      },
      role: {
        value: role ?? '',
        metadata: getDefaultMetadata(),
      },
    }),
  )

const createCompaniesAssociatesByRole = (companiesIds: string[], role: string | null) =>
  companiesIds.map(
    (companyId): AssociateAPI => ({
      ...getDefaultAssociate(),
      company: {
        _id: companyId,
      },
      role: {
        value: role ?? '',
        metadata: getDefaultMetadata(),
      },
    }),
  )

const getAssociatesByRole = (associates: Map<string, AssociateAPI>, associateRole: string) => {
  const associatesMap = new Map<string, AssociateAPI>()
  associates.forEach((associate, uid) => {
    if (associate.role.value === associateRole) {
      associatesMap.set(uid, associate)
    }
  })
  return associatesMap
}

const getAllAssociatesExceptRoles = (
  associates: Map<string, AssociateAPI>,
  excludedRoles: string[],
) => {
  const associatesMap = new Map<string, AssociateAPI>()
  associates.forEach((associate, uid) => {
    if (!excludedRoles.includes(associate.role.value)) {
      associatesMap.set(uid, associate)
    }
  })
  return associatesMap
}
