import React from 'react'
import { generatePath } from 'react-router-dom'
import { routes } from '../../../router/routes'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import OpenInNewOutlinedIcon from '@mui/icons-material/OpenInNewOutlined'
import Link from '@mui/material/Link'

type Props = {
  name: string
  personId: string
}

export const ViewPersonPage: React.FunctionComponent<Props> = ({
  name,
  personId,
}) => (
  <Link
    href={generatePath(routes.personDetails, {
      personId,
    })}
    target={'_blank'}
  >
    <IconButton>
      <Tooltip title={`Vezi detalii despre ${name}`}>
        <OpenInNewOutlinedIcon fontSize={'small'} color={'secondary'} />
      </Tooltip>
    </IconButton>
  </Link>
)
