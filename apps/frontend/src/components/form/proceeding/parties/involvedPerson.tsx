import React from 'react'
import { PersonAPIOutput } from 'defs'
import Box from '@mui/material/Box'
import CardContent from '@mui/material/CardContent'
import Card from '@mui/material/Card'
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
import CardActions from '@mui/material/CardActions'
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined'
import { useProceedingState } from 'state/proceedingState'
import { PartyCardGeneralInformation } from './partyCardGeneralInformation'
import { PartyPersonInfo } from '@frontend/components/form/proceeding/parties/partyEntityInfo/partyPersonInfo'
import { getPersonFullName } from '@frontend/utils/person'

type Props = {
  partyId: string
  personInfo: PersonAPIOutput
  removeInvolvedEntity: () => void
}

export const InvolvedPerson: React.FunctionComponent<Props> = ({
  partyId,
  personInfo,
  removeInvolvedEntity,
}) => {
  const [entityInvolvedInfo, updateInvolvedEntity] = useProceedingState(
    ({ entitiesInvolved, updateInvolvedEntity }) => [
      entitiesInvolved.get(partyId),
      updateInvolvedEntity,
    ],
  )

  const { images, cnp } = personInfo
  const fullName = getPersonFullName(personInfo)

  return (
    <Card sx={{ p: 1, mt: 4 }} variant={'outlined'}>
      <CardContent>
        <Box>
          <PartyPersonInfo name={fullName} cnp={cnp.value} imageUrl={images[0]?.url?.url ?? ''} />

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
