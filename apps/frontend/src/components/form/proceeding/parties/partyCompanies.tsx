import React, { useCallback } from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { CompanyAPIOutput, ConnectedEntity } from 'defs'
import { PartyEntity } from './partyEntity'
import { generatePath, useNavigate } from 'react-router-dom'
import { routes } from '../../../../router/routes'
import { PartyEntitiesPlaceholder } from './partyEntitiesPlaceholder'
import { PartyCompanyInfo } from './partyEntityInfo/partyCompanyInfo'

type Props = {
  companies: ConnectedEntity[]
  companiesInfo?: CompanyAPIOutput[]
}

export const PartyCompanies: React.FunctionComponent<Props> = ({ companies, companiesInfo }) => {
  const navigate = useNavigate()
  const viewCompanyDetails = useCallback(
    (companyId: string) => navigate(generatePath(routes.companyDetails, { companyId })),
    [navigate],
  )

  return (
    <>
      <Box sx={{ width: 1, mb: 2 }}>
        <Typography variant={'h6'}>Companii</Typography>
      </Box>
      {companies.length > 0 ? (
        companies.map(({ _id }) => {
          const companyInfo = companiesInfo?.find(({ _id: companyId }) => companyId === _id)
          if (companyInfo) {
            const {
              _id,
              name: { value: companyName },
              cui: { value: companyCui },
            } = companyInfo
            return (
              <PartyEntity key={_id} entityId={_id} viewEntityDetails={viewCompanyDetails}>
                <PartyCompanyInfo name={companyName} cui={companyCui} />
              </PartyEntity>
            )
          }
          return null
        })
      ) : (
        <PartyEntitiesPlaceholder placeholder={'Nu exista companii.'} />
      )}
    </>
  )
}
