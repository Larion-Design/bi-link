import React from 'react'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import OpenInNewOutlinedIcon from '@mui/icons-material/OpenInNewOutlined'
import Link from '@mui/material/Link'
import { generatePath } from 'react-router-dom'
import { routes } from '../../../router/routes'

type Props = {
  name: string
  companyId: string
}

export const ViewCompanyPage: React.FunctionComponent<Props> = ({ name, companyId }) => (
  <Link href={generatePath(routes.companyDetails, { companyId })}>
    <IconButton size={'small'}>
      <Tooltip title={`Vezi detalii despre ${name}`}>
        <OpenInNewOutlinedIcon color={'secondary'} />
      </Tooltip>
    </IconButton>
  </Link>
)
