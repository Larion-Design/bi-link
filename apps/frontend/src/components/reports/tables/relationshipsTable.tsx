import React, { useEffect, useMemo } from 'react'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Typography from '@mui/material/Typography'
import { RelationshipAPIInput } from 'defs'
import { getPersonInfoRequest } from '../../../graphql/persons/queries/getPersonInfo'
import { getPersonsBasicInfoRequest } from '../../../graphql/persons/queries/getPersonsBasicInfo'
import { getPersonFullName } from '../../../utils/person'

type Props = {
  personId: string
}

type RelationshipInfo = { name: string } & Pick<RelationshipAPIInput, 'type' | 'proximity'>

export const RelationshipsTable: React.FunctionComponent<Props> = ({ personId }) => {
  const [fetchPerson, { data: personData }] = getPersonInfoRequest()
  const [fetchPersonsInfo, { data: personsInfo }] = getPersonsBasicInfoRequest()

  useEffect(() => {
    void fetchPerson({ variables: { personId } })
  }, [personId])

  useEffect(() => {
    if (personData?.getPersonInfo?.relationships) {
      const personsIds = personData?.getPersonInfo?.relationships.map(({ person: { _id } }) => _id)

      if (personsIds.length) {
        void fetchPersonsInfo({ variables: { personsIds } })
      }
    }
  }, [personData?.getPersonInfo?.relationships])

  const relationships: RelationshipInfo[] = useMemo(
    () =>
      personData?.getPersonInfo?.relationships.map(
        ({ person: { _id: personId }, type, proximity }) => {
          const personInfo =
            personsInfo?.getPersonsInfo?.find(({ _id }) => _id === personId) ?? null

          if (personInfo) {
            return {
              name: getPersonFullName(personInfo),
              type,
              proximity,
            }
          }
        },
      ),

    [personData?.getPersonInfo?.relationships, personsInfo?.getPersonsInfo],
  )

  return relationships?.length ? (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell></TableCell>
            <TableCell>Nume</TableCell>
            <TableCell>Relatie</TableCell>
            <TableCell>Grad de apropiere</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {relationships.map(({ name, type, proximity }, index) => (
            <TableRow key={name}>
              <TableCell>{index}</TableCell>
              <TableCell>{name}</TableCell>
              <TableCell>{type}</TableCell>
              <TableCell>{proximity}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  ) : (
    <Typography gutterBottom> Nu exista relatii cu alte persoane</Typography>
  )
}
