import React, { useMemo, useState } from 'react'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import AccordionSummary from '@mui/material/AccordionSummary'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import AccordionDetails from '@mui/material/AccordionDetails'
import Accordion from '@mui/material/Accordion'
import Divider from '@mui/material/Divider'
import { AssociateAPI, CompanyAPIOutput, PersonAPIOutput } from 'defs'
import { PersonAssociateCard } from './personAssociateCard'
import { CompanyAssociateCard } from './companyAssociateCard'
import { countEntities } from '../helpers'

type Props<T = AssociateAPI> = {
  associates: Map<string, T>
  updateAssociate: (uid: string, associateInfo: T) => void
  removeAssociate: (uid: string) => void
  categoryName: string
  personsInfo?: Map<string, PersonAPIOutput>
  companiesInfo?: Map<string, CompanyAPIOutput>
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
      expanded={!!associates.size && expanded}
      onChange={() => setExpandedState((expanded) => (associates.size ? !expanded : expanded))}
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
        <Stack spacing={2} sx={{ width: 1 }}></Stack>
        {Array.from(associates.entries()).map(([uid, associate]) => {
          const personId = associate.person?._id

          if (personId) {
            const personInfo = personsInfo?.get(personId)
            return personInfo ? (
              <PersonAssociateCard
                key={uid}
                associateInfo={associate}
                personInfo={personInfo}
                removeAssociate={removeAssociate}
                updateAssociate={updateAssociate}
                allowRoleChange={allowRoleChange}
              />
            ) : null
          }

          const companyId = associate.company?._id

          if (companyId) {
            const companyInfo = companiesInfo?.get(companyId)
            return companyInfo ? (
              <CompanyAssociateCard
                key={uid}
                associateInfo={associate}
                companyInfo={companyInfo}
                removeAssociate={removeAssociate}
                updateAssociate={updateAssociate}
                allowRoleChange={allowRoleChange}
              />
            ) : null
          }
        })}
      </AccordionDetails>
    </Accordion>
  )
}
