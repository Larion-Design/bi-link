import React, { useEffect, useMemo } from 'react'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Typography from '@mui/material/Typography'
import { AssociateAPI } from 'defs'
import { getCompaniesInfoRequest } from '../../../graphql/companies/queries/getCompanies'
import { getCompanyInfoRequest } from '../../../graphql/companies/queries/getCompany'
import { getPersonsBasicInfoRequest } from '../../../graphql/persons/queries/getPersonsBasicInfo'
import { getPersonFullName } from '../../../utils/person'

type Props = {
  companyId: string
}

type AssociateInfo = { name: string } & Pick<AssociateAPI, 'role' | 'equity' | 'isActive'>

export const AssociatesTable: React.FunctionComponent<Props> = ({ companyId }) => {
  const [fetchCompany, { data: companyData }] = getCompanyInfoRequest()
  const [fetchPersonsInfo, { data: personsInfo }] = getPersonsBasicInfoRequest()
  const [fetchCompaniesInfo, { data: companiesInfo }] = getCompaniesInfoRequest()

  useEffect(() => {
    void fetchCompany({ variables: { id: companyId } })
  }, [companyId])

  useEffect(() => {
    if (companyData?.getCompany?.associates) {
      const personsIds = new Set<string>()
      const companiesIds = new Set<string>()

      companyData.getCompany.associates.forEach(({ company, person }) => {
        if (person) personsIds.add(person._id)
        if (company) companiesIds.add(company._id)
      })

      if (personsIds.size) {
        void fetchPersonsInfo({ variables: { personsIds: Array.from(personsIds) } })
      }
      if (companiesIds.size) {
        void fetchCompaniesInfo({ variables: { companiesIds: Array.from(companiesIds) } })
      }
    }
  }, [companyData?.getCompany?.associates])

  const associates: AssociateInfo[] = useMemo(
    () =>
      companyData?.getCompany?.associates.map(({ company, person, equity, role, isActive }) => {
        if (person?._id) {
          const { _id: personId } = person
          const personInfo =
            personsInfo?.getPersonsInfo?.find(({ _id }) => _id === personId) ?? null

          if (personInfo) {
            return {
              name: getPersonFullName(personInfo),
              role,
              equity,
              isActive,
            }
          }
        } else if (company?._id) {
          const { _id: companyId } = company
          const companyInfo =
            companiesInfo?.getCompanies?.find(({ _id }) => _id === companyId) ?? null

          if (companyInfo) {
            return {
              name: companyInfo.name.value,
              role,
              equity,
              isActive,
            }
          }
        }
      }),

    [companyData?.getCompany?.associates, personsInfo?.getPersonsInfo, companiesInfo?.getCompanies],
  )

  return associates?.length ? (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell></TableCell>
            <TableCell>Nume</TableCell>
            <TableCell>Rol</TableCell>
            <TableCell>% Actiuni</TableCell>
            <TableCell>Activ?</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {associates.map(({ name, role, equity, isActive }, index) => (
            <TableRow key={name}>
              <TableCell>{index}</TableCell>
              <TableCell>{name}</TableCell>
              <TableCell>{role.value}</TableCell>
              <TableCell>{equity.value > 0 ? `${equity.value}%` : ' - '}</TableCell>
              <TableCell>{isActive ? 'Da' : 'Nu'}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  ) : (
    <Typography gutterBottom variant={'body2'}>
      Nu exista asociati.
    </Typography>
  )
}
