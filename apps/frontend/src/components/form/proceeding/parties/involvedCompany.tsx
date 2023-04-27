import React from 'react'
import { CompanyAPIOutput } from 'defs'
import Box from '@mui/material/Box'
import CardContent from '@mui/material/CardContent'
import Card from '@mui/material/Card'
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
import CardActions from '@mui/material/CardActions'
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined'
import { useProceedingState } from '../../../../state/proceedingState'
import { PartyCardGeneralInformation } from './partyCardGeneralInformation'
import { PartyCompanyInfo } from '@frontend/components/form/proceeding/parties/partyEntityInfo/partyCompanyInfo'

type Props = {
  partyId: string
  companyInfo: CompanyAPIOutput
  removeInvolvedEntity: () => void
}

export const InvolvedCompany: React.FunctionComponent<Props> = ({
  partyId,
  companyInfo,
  removeInvolvedEntity,
}) => {
  const [entityInvolvedInfo, updateInvolvedEntity] = useProceedingState(
    ({ entitiesInvolved, updateInvolvedEntity }) => [
      entitiesInvolved.get(partyId),
      updateInvolvedEntity,
    ],
  )

  const { name, cui } = companyInfo

  return (
    <Card sx={{ p: 1, mt: 4 }} variant={'outlined'}>
      <CardContent>
        <Box>
          <PartyCompanyInfo name={name.value} cui={cui.value} />

          <PartyCardGeneralInformation
            partyId={partyId}
            partyInfo={entityInvolvedInfo}
            updateParty={updateInvolvedEntity}
          />
        </Box>
      </CardContent>
      <Divider sx={{ mt: 2, mb: 2 }} />
      <CardActions>
        <Button
          size={'small'}
          variant={'contained'}
          color={'error'}
          startIcon={<DeleteOutlinedIcon />}
          onClick={removeInvolvedEntity}
        >
          Sterge
        </Button>
      </CardActions>
    </Card>
  )
}
