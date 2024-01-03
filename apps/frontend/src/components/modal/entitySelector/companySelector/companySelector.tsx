import React, { useState } from 'react'
import Card from '@mui/material/Card'
import { SearchCompanies } from './searchCompanies'
import { FastCreateCompany } from '@frontend/components/form/company/companyForm/fastCreateCompany'

export type CompanySelectorView = 'search' | 'createCompany'

type Props = {
  closeModal: () => void
  companiesSelected?: (companiesIds: string[]) => void
  excludedCompaniesIds?: string[]
}

export const CompanySelector: React.FunctionComponent<Props> = ({
  closeModal,
  companiesSelected,
  excludedCompaniesIds,
}) => {
  const [view, setView] = useState<CompanySelectorView>('search')

  return (
    <Card sx={{ p: 2, width: '80vw', height: '90vh' }} variant={'elevation'}>
      {view === 'search' && (
        <SearchCompanies
          closeModal={closeModal}
          companiesSelected={companiesSelected}
          excludedCompaniesIds={excludedCompaniesIds}
          changeView={setView}
        />
      )}
      {view === 'createCompany' && (
        <FastCreateCompany
          closeModal={closeModal}
          companiesSelected={companiesSelected}
          changeView={setView}
        />
      )}
    </Card>
  )
}
