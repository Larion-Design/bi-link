import { PersonRelationshipCard } from 'components/form/company/company-relationships/person-relationship-card'
import React, { useMemo, useState } from 'react'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import AccordionSummary from '@mui/material/AccordionSummary'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import AccordionDetails from '@mui/material/AccordionDetails'
import Accordion from '@mui/material/Accordion'
import Divider from '@mui/material/Divider'
import { CompanyAPIOutput, CompanyRelationship, PersonAPIOutput } from 'defs'
import { useCompanyState } from 'state/company/companyState'
import { CompanyRelationshipCard } from './company-relationship-card'

type Props = {
  relationshipsIds: string[]
  categoryName: string
  personsInfo?: Map<string, PersonAPIOutput>
  companiesInfo?: Map<string, CompanyAPIOutput>
}

export const RelationshipsCategory: React.FunctionComponent<Props> = ({
  categoryName,
  relationshipsIds,
  personsInfo,
  companiesInfo,
}) => {
  const [expanded, setExpanded] = useState(!!relationshipsIds.length)
  const relationships = useCompanyState(({ relationships }) => relationships)

  const relationshipsMap = useMemo(() => {
    const map = new Map<string, CompanyRelationship>()
    relationshipsIds.forEach((uid) => map.set(uid, relationships.get(uid)))
    return map
  }, [relationshipsIds, relationships])

  const { persons, companies } = relationshipsMap
    ? countEntities(relationshipsMap)
    : { persons: 0, companies: 0 }

  return (
    <Accordion
      variant={'outlined'}
      expanded={expanded || !!relationshipsMap?.size}
      onChange={() => setExpanded((expanded) => (relationshipsMap.size ? !expanded : expanded))}
    >
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Stack
          sx={{ width: 0.5 }}
          direction={'row'}
          spacing={2}
          alignItems={'center'}
          divider={<Divider orientation={'vertical'} flexItem />}
        >
          <Typography sx={{ width: 0.4 }} variant={'h6'}>
            {categoryName}
          </Typography>
          <Typography variant={'caption'}>{persons} persoane</Typography>
          <Typography variant={'caption'}>{companies} companii</Typography>
        </Stack>
      </AccordionSummary>
      <AccordionDetails>
        <Stack spacing={2} sx={{ width: 1 }}>
          {relationshipsMap?.size
            ? Array.from(relationshipsMap.entries()).map(([uid, relationship]) => {
                const personId = relationship.person?._id
                if (personId) {
                  const personInfo = personsInfo?.get(personId)
                  return personInfo ? (
                    <PersonRelationshipCard key={uid} entityId={uid} personInfo={personInfo} />
                  ) : null
                }

                const companyId = relationship.company?._id

                if (companyId) {
                  const companyInfo = companiesInfo?.get(companyId)
                  return companyInfo ? (
                    <CompanyRelationshipCard key={uid} entityId={uid} companyInfo={companyInfo} />
                  ) : null
                }
              })
            : null}
        </Stack>
      </AccordionDetails>
    </Accordion>
  )
}

function countEntities(relationships: Map<string, CompanyRelationship>) {
  return Array.from(relationships.values()).reduce(
    (entitiesCount, { person, company }) => {
      if (person?._id) {
        entitiesCount.persons += 1
      } else if (company?._id) {
        entitiesCount.companies += 1
      }
      return entitiesCount
    },
    {
      persons: 0,
      companies: 0,
    },
  )
}
