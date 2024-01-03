import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import Stack from '@mui/material/Stack'
import AddOutlinedIcon from '@mui/icons-material/AddOutlined'
import Button from '@mui/material/Button'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import Divider from '@mui/material/Divider'
import Typography from '@mui/material/Typography'
import Tooltip from '@mui/material/Tooltip'
import InsertChartOutlinedIcon from '@mui/icons-material/InsertChartOutlined'
import { AssociateAPI, EntityType } from 'defs'
import { getDefaultAssociate, getDefaultMetadata } from 'default-values'
import { getPersonsBasicInfoMap } from '@frontend/graphql/persons/queries/getPersonsBasicInfo'
import { getCompaniesInfoMap } from '@frontend/graphql/companies/queries/getCompanies'
import { CompanyAssociateInfoState } from 'state/company/companyAssociatesState'
import { useCompanyState } from 'state/company/companyState'
import { useModal } from '../../../modal/modalProvider'
import { AssociatesCategory } from './generic/associatesCategory'
import { getShareholdersTotalEquity } from './helpers'

type Props = {
  sectionTitle: string
}

type DefaultAssociateRole = 'Actionar' | 'Administrator' | ''

export const Associates: React.FunctionComponent<Props> = ({ sectionTitle }) => {
  const modal = useModal()

  const { fetchPersons, personsMap } = getPersonsBasicInfoMap()
  const { fetchCompanies, companiesMap } = getCompaniesInfoMap()

  const [isMenuOpen, setMenuState] = useState<boolean>(false)
  const buttonRef = useRef<Element | null>()
  const [entityType, setEntityType] = useState<Extract<EntityType, 'PERSON' | 'COMPANY'> | null>(
    null,
  )
  const [role, setRole] = useState<DefaultAssociateRole | null>(null)

  const [associates, addAssociates] = useCompanyState(
    ({ associates, addAssociates, removeAssociate }) => [
      associates,
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
      void fetchPersons({ variables: { personsIds: Array.from(personsIds) } })
    }

    if (companiesIds.size) {
      void fetchCompanies({ variables: { companiesIds: Array.from(companiesIds) } })
    }
  }, [associates])

  const totalEquity = useMemo(
    () => Number(parseFloat(getShareholdersTotalEquity(associates)).toFixed(2)),
    [associates],
  )

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
      <Stack
        sx={{ my: 3, width: 1 }}
        direction={'row'}
        alignItems={'center'}
        justifyContent={'space-between'}
      >
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

        <Equity totalEquity={totalEquity} />
      </Stack>

      <Stack spacing={1} width={1}>
        <AssociatesCategory
          categoryName={'Administratori'}
          allowRoleChange={false}
          personsInfo={personsMap}
          companiesInfo={companiesMap}
          associatesIds={getAssociatesByRole(associates, 'Administrator')}
        />

        <AssociatesCategory
          categoryName={'Actionari'}
          allowRoleChange={false}
          personsInfo={personsMap}
          companiesInfo={companiesMap}
          associatesIds={getAssociatesByRole(associates, 'Actionar')}
        />

        <AssociatesCategory
          categoryName={'Alte entitati conexate'}
          allowRoleChange={true}
          personsInfo={personsMap}
          companiesInfo={companiesMap}
          associatesIds={getAllAssociatesExceptRoles(associates, ['Administrator', 'Actionar'])}
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

const getAssociatesByRole = (
  associates: Map<string, CompanyAssociateInfoState>,
  associateRole: string,
) => {
  const associatesIds: string[] = []

  associates.forEach((associate, uid) => {
    if (associate.role.value === associateRole) {
      associatesIds.push(uid)
    }
  })
  return associatesIds
}

const getAllAssociatesExceptRoles = (
  associates: Map<string, CompanyAssociateInfoState>,
  excludedRoles: string[],
) => {
  const associatesIds: string[] = []
  associates.forEach((associate, uid) => {
    if (!excludedRoles.includes(associate.role.value)) {
      associatesIds.push(uid)
    }
  })
  return associatesIds
}

const Equity: React.FunctionComponent<{ totalEquity: number }> = ({ totalEquity }) => (
  <Stack direction={'row'} spacing={1} alignItems={'center'}>
    <InsertChartOutlinedIcon color={totalEquity > 100 ? 'error' : 'inherit'} />

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
  </Stack>
)
