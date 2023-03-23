import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import Box from '@mui/material/Box'
import AddOutlinedIcon from '@mui/icons-material/AddOutlined'
import Button from '@mui/material/Button'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import Divider from '@mui/material/Divider'
import Typography from '@mui/material/Typography'
import Grid from '@mui/material/Grid'
import Tooltip from '@mui/material/Tooltip'
import InsertChartOutlinedIcon from '@mui/icons-material/InsertChartOutlined'
import { getPersonsBasicInfoRequest } from '@frontend/graphql/persons/queries/getPersonsBasicInfo'
import { AssociateAPIInput } from 'defs'
import { getCompaniesInfoRequest } from '@frontend/graphql/companies/queries/getCompanies'
import { useDebouncedMap } from '@frontend/utils/hooks/useMap'
import { useModal } from '../../../modal/modalProvider'
import { AssociatesCategory } from './generic/associatesCategory'
import { getShareholdersTotalEquity } from './helpers'

type Props = {
  sectionTitle: string
  error?: string
  associates: AssociateAPIInput[]
  updateAssociatesField: (associates: AssociateAPIInput[]) => Promise<void> | void
}

type DefaultAssociateRole = 'Actionar' | 'Administrator' | ''

export const Associates: React.FunctionComponent<Props> = ({
  associates,
  updateAssociatesField,
}) => {
  const modal = useModal()
  const [fetchPersonsInfo, { data: personsInfo }] = getPersonsBasicInfoRequest()
  const [fetchCompaniesInfo, { data: companiesInfo }] = getCompaniesInfoRequest()

  const [isMenuOpen, setMenuState] = useState<boolean>(false)
  const buttonRef = useRef<Element | null>()
  const [entityType, setEntityType] = useState<'PERSON' | 'COMPANY' | null>(null)
  const [role, setRole] = useState<DefaultAssociateRole | null>(null)
  const { uid, values, keys, addBulk, update, remove } = useDebouncedMap(
    1000,
    associates,
    ({ person, company }) => person?._id ?? company?._id,
  )
  const associatesList = useMemo(() => values(), [uid])

  const selectRoleHandler = useCallback(
    (newRole: DefaultAssociateRole) => {
      setRole(newRole)
      setMenuState(false)

      const associatesIds = keys()
      const closeModal = () => null

      const addSelectedPersonsAssociates = (personsIds: string[]) => {
        if (personsIds.length) {
          addBulk(createPersonsAssociatesByRole(personsIds, newRole), ({ person }) => person?._id)
        }
      }

      const addSelectedCompaniesAssociates = (companiesIds: string[]) => {
        if (companiesIds.length) {
          addBulk(
            createCompaniesAssociatesByRole(companiesIds, newRole),
            ({ company }) => company?._id,
          )
        }
      }

      switch (entityType) {
        case 'PERSON': {
          return modal?.openPersonSelector(addSelectedPersonsAssociates, associatesIds, closeModal)
        }
        case 'COMPANY': {
          return modal?.openCompanySelector(
            addSelectedCompaniesAssociates,
            associatesIds,
            closeModal,
          )
        }
      }
    },
    [uid, entityType, role],
  )

  useEffect(() => {
    const personsIds: string[] = []
    const companiesIds: string[] = []

    values().forEach(({ person, company }) => {
      if (person?._id) {
        personsIds.push(person._id)
      } else if (company?._id) {
        companiesIds.push(company._id)
      }
    })

    if (personsIds.length) {
      void fetchPersonsInfo({ variables: { personsIds } })
    }

    if (companiesIds.length) {
      void fetchCompaniesInfo({ variables: { companiesIds } })
    }

    void updateAssociatesField(values())
  }, [uid])

  const totalEquity = useMemo(
    () => parseFloat(getShareholdersTotalEquity(associates)),
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
      <Grid container sx={{ mt: 2, mb: 2 }} alignItems={'center'}>
        <Grid item xs={11}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Button
              variant={'contained'}
              startIcon={<AddOutlinedIcon />}
              onClick={(event) => {
                buttonRef.current = event.currentTarget
                setMenuState(true)
                setEntityType('PERSON')
              }}
            >
              Persoana
            </Button>

            <Button
              sx={{ ml: 1 }}
              variant={'contained'}
              startIcon={<AddOutlinedIcon />}
              onClick={(event) => {
                buttonRef.current = event.currentTarget
                setMenuState(true)
                setEntityType('COMPANY')
              }}
            >
              Companie
            </Button>
          </Box>
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
      <Box sx={{ width: 1, mb: 1 }}>
        <AssociatesCategory
          categoryName={'Administratori'}
          allowRoleChange={false}
          personsInfo={personsInfo?.getPersonsInfo}
          companiesInfo={companiesInfo?.getCompanies}
          associates={getAssociatesByRole(associatesList, 'Administrator')}
          removeAssociate={remove}
          updateAssociate={update}
        />
      </Box>
      <Box sx={{ width: 1, mb: 1 }}>
        <AssociatesCategory
          categoryName={'Actionari'}
          allowRoleChange={false}
          personsInfo={personsInfo?.getPersonsInfo}
          companiesInfo={companiesInfo?.getCompanies}
          associates={getAssociatesByRole(associatesList, 'Actionar')}
          removeAssociate={remove}
          updateAssociate={update}
        />
      </Box>
      <Box sx={{ width: 1 }}>
        <AssociatesCategory
          categoryName={'Alte entitati conexate'}
          allowRoleChange={true}
          personsInfo={personsInfo?.getPersonsInfo}
          companiesInfo={companiesInfo?.getCompanies}
          associates={getAllAssociatesExceptRoles(associatesList, ['Administrator', 'Actionar'])}
          removeAssociate={remove}
          updateAssociate={update}
        />
      </Box>
    </>
  )
}

const createPersonsAssociatesByRole = (
  personsIds: string[],
  role: string | null,
): AssociateAPIInput[] =>
  personsIds.map((_id) => ({
    person: { _id },
    role: role ?? '',
    isActive: true,
    customFields: [],
    startDate: null,
    endDate: null,
    equity: 0,
    _confirmed: true,
  }))

const createCompaniesAssociatesByRole = (
  companiesIds: string[],
  role: string | null,
): AssociateAPIInput[] =>
  companiesIds.map((_id) => ({
    company: { _id },
    role: role ?? '',
    isActive: true,
    customFields: [],
    startDate: null,
    endDate: null,
    equity: 0,
    _confirmed: true,
  }))

const getAssociatesByRole = (associates: AssociateAPIInput[], associateRole: string) =>
  associates.filter(({ role }) => role === associateRole)

const getAllAssociatesExceptRoles = (associates: AssociateAPIInput[], excludedRoles: string[]) =>
  associates.filter(({ role }) => !excludedRoles.includes(role))
