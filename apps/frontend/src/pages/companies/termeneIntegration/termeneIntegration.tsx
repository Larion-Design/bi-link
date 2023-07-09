import { DashboardPage } from '@frontend/components/page/DashboardPage'
import React from 'react'
import { TermeneCompaniesTable } from './termeneCompaniesTable'

export const TermeneIntegration: React.FunctionComponent = () => {
  return (
    <DashboardPage title={'Companii'}>
      <TermeneCompaniesTable companies={[]} />
    </DashboardPage>
  )
}
