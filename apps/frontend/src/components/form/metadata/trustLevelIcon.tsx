import { trustLevelColor } from '@frontend/components/form/metadata/constants'
import { useTrustLevelLocale } from '@frontend/components/form/metadata/hooks'
import Tooltip from '@mui/material/Tooltip'
import React from 'react'
import InsightsOutlinedIcon from '@mui/icons-material/InsightsOutlined'
import QuestionMarkOutlinedIcon from '@mui/icons-material/QuestionMarkOutlined'
import CheckOutlinedIcon from '@mui/icons-material/CheckOutlined'
import ThumbUpAltOutlinedIcon from '@mui/icons-material/ThumbUpAltOutlined'
import ThumbDownAltOutlinedIcon from '@mui/icons-material/ThumbDownAltOutlined'
import PsychologyAltOutlinedIcon from '@mui/icons-material/PsychologyAltOutlined'
import { useIntl } from 'react-intl'

type Props = {
  level: number
}

export const TrustLevelIcon: React.FunctionComponent<Props> = ({ level }) => {
  const trustLevelLocale = useTrustLevelLocale()
  const { formatMessage } = useIntl()

  const color = trustLevelColor[level]
  const tooltipMessage = `${formatMessage({ id: 'Information trust level' })}: ${
    trustLevelLocale[level]
  }`
  let iconNode = null

  switch (level) {
    case 0: {
      iconNode = <QuestionMarkOutlinedIcon fontSize={'small'} sx={{ color }} />
      break
    }
    case 1: {
      iconNode = <ThumbDownAltOutlinedIcon fontSize={'small'} sx={{ color }} />
      break
    }
    case 2: {
      iconNode = <PsychologyAltOutlinedIcon fontSize={'small'} sx={{ color }} />
      break
    }
    case 3: {
      iconNode = <InsightsOutlinedIcon fontSize={'small'} sx={{ color }} />
      break
    }
    case 4: {
      iconNode = <ThumbUpAltOutlinedIcon fontSize={'small'} sx={{ color }} />
      break
    }
    case 5: {
      iconNode = <CheckOutlinedIcon fontSize={'small'} sx={{ color }} />
      break
    }
  }

  if (iconNode) {
    return (
      <Tooltip placement={'top'} title={tooltipMessage}>
        {iconNode}
      </Tooltip>
    )
  }
  return null
}
