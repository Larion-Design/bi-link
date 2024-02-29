import React, { useCallback, useEffect, useRef, useState } from 'react'
import { RelationshipsCategory } from 'components/form/company/company-relationships/relationships-category'
import Stack from '@mui/material/Stack'
import AddOutlinedIcon from '@mui/icons-material/AddOutlined'
import Button from '@mui/material/Button'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import Typography from '@mui/material/Typography'
import { CompanyRelationship, CompanyRelationshipType, EntityType } from 'defs'
import { getDefaultCompanyRelationship } from 'default-values'
import { getPersonsBasicInfoMap } from '@frontend/graphql/persons/queries/getPersonsBasicInfo'
import { getCompaniesInfoMap } from '@frontend/graphql/companies/queries/getCompanies'
import { useCompanyState } from 'state/company/companyState'
import { useModal } from '../../../modal/modalProvider'

type Props = {
  sectionTitle: string
}

export const CompanyRelationships: React.FunctionComponent<Props> = ({ sectionTitle }) => {
  const modal = useModal()

  const { fetchPersons, personsMap } = getPersonsBasicInfoMap()
  const { fetchCompanies, companiesMap } = getCompaniesInfoMap()

  const [isMenuOpen, setMenuState] = useState<boolean>(false)
  const buttonRef = useRef<Element | null>()
  const [entityType, setEntityType] = useState<Extract<EntityType, 'PERSON' | 'COMPANY'> | null>(
    null,
  )
  const [role, setRole] = useState<CompanyRelationshipType | null>(null)

  const [relationships, addRelationships] = useCompanyState(
    ({ relationships, addRelationships }) => [relationships, addRelationships],
  )

  const selectRoleHandler = useCallback(
    (newRole: CompanyRelationshipType) => {
      setRole(newRole)
      setMenuState(false)

      const personsIds = new Set<string>()
      const companiesIds = new Set<string>()

      relationships.forEach(({ person, company }) => {
        if (person?._id) {
          personsIds.add(person._id)
        } else {
          companiesIds.add(company._id)
        }
      })

      switch (entityType) {
        case 'PERSON': {
          const addSelectedRelationshipsWithPersons = (selectedPersonsIds: string[]) => {
            if (selectedPersonsIds.length) {
              addRelationships(createPersonsRelationshipsWithType(selectedPersonsIds, newRole))
            }
          }
          return modal?.openPersonSelector(
            addSelectedRelationshipsWithPersons,
            Array.from(personsIds),
          )
        }
        case 'COMPANY': {
          const addSelectedCompaniesRelationships = (selectedCompaniesIds: string[]) => {
            if (selectedCompaniesIds.length) {
              addRelationships(createCompaniesRelationshipsWithType(selectedCompaniesIds, newRole))
            }
          }
          return modal?.openCompanySelector(
            addSelectedCompaniesRelationships,
            Array.from(companiesIds),
          )
        }
      }
    },
    [entityType, role],
  )

  useEffect(() => {
    if (relationships.size) {
      const personsIds = new Set<string>()
      const companiesIds = new Set<string>()

      relationships.forEach(({ person, company }) => {
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
    }
  }, [relationships])

  return (
    <>
      {isMenuOpen && (
        <Menu
          open={isMenuOpen}
          anchorEl={buttonRef.current}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
          onClose={() => setMenuState(false)}
        >
          <MenuItem onClick={() => selectRoleHandler('SUPPLIER')}>Furnizor</MenuItem>
          <MenuItem onClick={() => selectRoleHandler('COMPETITOR')}>Competitor</MenuItem>
          <MenuItem onClick={() => selectRoleHandler('DISPUTING')}>
            Parte aflata in litigii
          </MenuItem>
        </Menu>
      )}
      <Stack
        sx={{ my: 3, width: 1 }}
        direction={'row'}
        alignItems={'center'}
        justifyContent={'space-between'}
      >
        <Typography variant={'h5'}>{sectionTitle}</Typography>

        <Stack direction={'row'} spacing={2} alignItems={'center'}>
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
      </Stack>

      <Stack spacing={1} width={1}>
        <RelationshipsCategory
          categoryName={'Furnizori'}
          personsInfo={personsMap}
          companiesInfo={companiesMap}
          relationshipsIds={getRelationshipsByType(relationships, 'SUPPLIER')}
        />

        <RelationshipsCategory
          categoryName={'Competitori'}
          personsInfo={personsMap}
          companiesInfo={companiesMap}
          relationshipsIds={getRelationshipsByType(relationships, 'COMPETITOR')}
        />

        <RelationshipsCategory
          categoryName={'Parti aflate in litigii'}
          personsInfo={personsMap}
          companiesInfo={companiesMap}
          relationshipsIds={getRelationshipsByType(relationships, 'COMPETITOR')}
        />
      </Stack>
    </>
  )
}

function createPersonsRelationshipsWithType(personsIds: string[], type: CompanyRelationshipType) {
  return personsIds.map(
    (personId): CompanyRelationship => ({
      ...getDefaultCompanyRelationship(type),
      person: {
        _id: personId,
      },
    }),
  )
}

function createCompaniesRelationshipsWithType(
  companiesIds: string[],
  type: CompanyRelationshipType,
) {
  return companiesIds.map(
    (companyId): CompanyRelationship => ({
      ...getDefaultCompanyRelationship(type),
      company: {
        _id: companyId,
      },
    }),
  )
}

function getRelationshipsByType(
  relationships: Map<string, CompanyRelationship>,
  type: CompanyRelationshipType,
) {
  const relationshipsIds: string[] = []

  relationships.forEach((relationship, uid) => {
    if (relationship.type === type) {
      relationshipsIds.push(uid)
    }
  })
  return relationshipsIds
}
