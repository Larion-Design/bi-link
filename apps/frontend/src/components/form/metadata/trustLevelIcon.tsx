import React from 'react'
import Tooltip from '@mui/material/Tooltip'
import InsightsOutlinedIcon from '@mui/icons-material/InsightsOutlined'
import QuestionMarkOutlinedIcon from '@mui/icons-material/QuestionMarkOutlined'
import CheckOutlinedIcon from '@mui/icons-material/CheckOutlined'
import ThumbUpAltOutlinedIcon from '@mui/icons-material/ThumbUpAltOutlined'
import ThumbDownAltOutlinedIcon from '@mui/icons-material/ThumbDownAltOutlined'
import PsychologyAltOutlinedIcon from '@mui/icons-material/PsychologyAltOutlined'
import { useIntl } from 'react-intl'
import { trustLevelColor } from '@frontend/components/form/metadata/constants'
import { useTrustLevelLocale } from '@frontend/components/form/metadata/hooks'

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

  const icons = {
    0: <QuestionMarkOutlinedIcon fontSize={'small'} sx={{ color }} />,
    1: <ThumbDownAltOutlinedIcon fontSize={'small'} sx={{ color }} />,
    2: <PsychologyAltOutlinedIcon fontSize={'small'} sx={{ color }} />,
    3: <InsightsOutlinedIcon fontSize={'small'} sx={{ color }} />,
    4: <ThumbUpAltOutlinedIcon fontSize={'small'} sx={{ color }} />,
    5: <CheckOutlinedIcon fontSize={'small'} sx={{ color }} />,
  }

  return level in icons ? (
    <Tooltip placement={'top'} title={tooltipMessage}>
      {icons[level]}
    </Tooltip>
  ) : null
}
