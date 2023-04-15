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
import { AssociateAPI, EntityType } from 'defs'
import { getDefaultAssociate, getDefaultMetadata } from 'tools'
import { getPersonsBasicInfoRequest } from '@frontend/graphql/persons/queries/getPersonsBasicInfo'
import { getCompaniesInfoRequest } from '@frontend/graphql/companies/queries/getCompanies'
import { useDebouncedMap } from '@frontend/utils/hooks/useMap'
import { useModal } from '../../../modal/modalProvider'
import { AssociatesCategory } from './generic/associatesCategory'
import { getShareholdersTotalEquity } from './helpers'

type Props = {
  sectionTitle: string
  error?: string
  associates: AssociateAPI[]
  updateAssociatesField: (associates: AssociateAPI[]) => Promise<void> | void
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
  const [entityType, setEntityType] = useState<Extract<EntityType, 'PERSON' | 'COMPANY'> | null>(
    null,
  )
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

      switch (entityType) {
        case 'PERSON': {
          const addSelectedPersonsAssociates = (personsIds: string[]) => {
            if (personsIds.length) {
              addBulk(
                createPersonsAssociatesByRole(personsIds, newRole),
                ({ person }) => person?._id,
              )
            }
          }
          return modal?.openPersonSelector(addSelectedPersonsAssociates, associatesIds, closeModal)
        }
        case 'COMPANY': {
          const addSelectedCompaniesAssociates = (companiesIds: string[]) => {
            if (companiesIds.length) {
              addBulk(
                createCompaniesAssociatesByRole(companiesIds, newRole),
                ({ company }) => company?._id,
              )
            }
          }
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
    const personsIds = new Set<string>()
    const companiesIds = new Set<string>()

    values().forEach(({ person, company }) => {
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
          <Stack direction={'row'} spacing={2} alignItems={'center'}>
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
          personsInfo={personsInfo?.getPersonsInfo}
          companiesInfo={companiesInfo?.getCompanies}
          associates={getAssociatesByRole(associatesList, 'Administrator')}
          removeAssociate={remove}
          updateAssociate={update}
        />

        <AssociatesCategory
          categoryName={'Actionari'}
          allowRoleChange={false}
          personsInfo={personsInfo?.getPersonsInfo}
          companiesInfo={companiesInfo?.getCompanies}
          associates={getAssociatesByRole(associatesList, 'Actionar')}
          removeAssociate={remove}
          updateAssociate={update}
        />

        <AssociatesCategory
          categoryName={'Alte entitati conexate'}
          allowRoleChange={true}
          personsInfo={personsInfo?.getPersonsInfo}
          companiesInfo={companiesInfo?.getCompanies}
          associates={getAllAssociatesExceptRoles(associatesList, ['Administrator', 'Actionar'])}
          removeAssociate={remove}
          updateAssociate={update}
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

const getAssociatesByRole = (associates: AssociateAPI[], associateRole: string) =>
  associates.filter(({ role: { value } }) => value === associateRole)

const getAllAssociatesExceptRoles = (associates: AssociateAPI[], excludedRoles: string[]) =>
  associates.filter(({ role: { value } }) => !excludedRoles.includes(value))
