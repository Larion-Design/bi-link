import Stack from '@mui/material/Stack'
import React, { useMemo, useState } from 'react'
import Typography from '@mui/material/Typography'
import AccordionSummary from '@mui/material/AccordionSummary'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import AccordionDetails from '@mui/material/AccordionDetails'
import Accordion from '@mui/material/Accordion'
import Box from '@mui/material/Box'
import Divider from '@mui/material/Divider'
import { AssociateAPI, CompanyAPIOutput, PersonAPIOutput } from 'defs'
import { PersonAssociateCard } from './personAssociateCard'
import { CompanyAssociateCard } from './companyAssociateCard'
import { countEntities } from '../helpers'

type Props<T = AssociateAPI> = {
  associates: T[]
  updateAssociate: (associateId: string, associateInfo: T) => void
  categoryName: string
  personsInfo?: PersonAPIOutput[]
  companiesInfo?: CompanyAPIOutput[]
  removeAssociate: (associateId: string) => void
  allowRoleChange: boolean
}

export const AssociatesCategory: React.FunctionComponent<Props> = ({
  categoryName,
  associates,
  personsInfo,
  companiesInfo,
  removeAssociate,
  updateAssociate,
  allowRoleChange,
}) => {
  const [expanded, setExpandedState] = useState(false)
  const { persons, companies } = useMemo(() => countEntities(associates), [associates])
  return (
    <Accordion
      variant={'outlined'}
      expanded={!!associates.length && expanded}
      onChange={() => setExpandedState((expanded) => (associates.length ? !expanded : expanded))}
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
        {associates.map((associate) => {
          const personId = associate.person?._id

          if (personId) {
            const personInfo = personsInfo?.find(({ _id }) => _id === personId)
            return personInfo ? (
              <Box key={personId} sx={{ width: 1, mb: 1 }}>
                <PersonAssociateCard
                  associateInfo={associate}
                  personInfo={personInfo}
                  removeAssociate={removeAssociate}
                  updateAssociate={updateAssociate}
                  allowRoleChange={allowRoleChange}
                />
              </Box>
            ) : null
          }

          const companyId = associate.company?._id

          if (companyId) {
            const companyInfo = companiesInfo?.find(({ _id }) => _id === companyId)
            return companyInfo ? (
              <Box key={personId} sx={{ width: 1, mb: 1 }}>
                <CompanyAssociateCard
                  associateInfo={associate}
                  companyInfo={companyInfo}
                  removeAssociate={removeAssociate}
                  updateAssociate={updateAssociate}
                  allowRoleChange={allowRoleChange}
                />
              </Box>
            ) : null
          }
        })}
      </AccordionDetails>
    </Accordion>
  )
}
