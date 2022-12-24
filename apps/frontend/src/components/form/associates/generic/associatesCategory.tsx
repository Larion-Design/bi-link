import React, { useMemo, useState } from 'react'
import Typography from '@mui/material/Typography'
import AccordionSummary from '@mui/material/AccordionSummary'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import AccordionDetails from '@mui/material/AccordionDetails'
import Accordion from '@mui/material/Accordion'
import Box from '@mui/material/Box'
import Divider from '@mui/material/Divider'
import { AssociateAPIInput, CompanyListRecord, PersonListRecordWithImage } from 'defs'
import { PersonAssociateCard } from './personAssociateCard'
import { CompanyAssociateCard } from './companyAssociateCard'
import { countEntities } from '../helpers'

type Props = {
  categoryName: string
  personsInfo?: PersonListRecordWithImage[]
  companiesInfo?: CompanyListRecord[]
  associates: AssociateAPIInput[]
  removeAssociate: (associateId: string) => void
  allowRoleChange: boolean
  updateAssociate: (associateId: string, associateInfo: AssociateAPIInput) => void
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
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: 0.5,
          }}
        >
          <Box sx={{ width: 0.4 }}>
            <Typography variant={'h6'}>{categoryName}</Typography>
          </Box>
          <Divider orientation={'vertical'} />
          <Typography variant={'caption'}>{persons} persoane</Typography>
          <Divider orientation={'vertical'} />
          <Typography variant={'caption'}>{companies} companii</Typography>
        </Box>
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
