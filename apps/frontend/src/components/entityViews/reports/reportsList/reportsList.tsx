import AddOutlinedIcon from '@mui/icons-material/AddOutlined'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Grid from '@mui/material/Grid'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'
import React from 'react'
import { DataGrid, GridActionsCellItem, GridColDef, GridRowParams } from '@mui/x-data-grid'
import { GridActionsColDef } from '@mui/x-data-grid/models/colDef/gridColDef'
import { ReportAPIOutput } from 'defs'
import OpenInNewOutlinedIcon from '@mui/icons-material/OpenInNewOutlined'
import DownloadForOfflineOutlinedIcon from '@mui/icons-material/DownloadForOfflineOutlined'
import { getReportsRequest } from '../../../../graphql/reports/queries/getReports'

type Props = {
  entityId: string
  entityType: 'PERSON' | 'COMPANY' | 'PROPERTY' | 'INCIDENT'
  createReport: () => void
  viewReportDetails: (reportId: string) => void
}

export const ReportsList: React.FunctionComponent<Props> = ({
  entityId,
  entityType,
  createReport,
  viewReportDetails,
}) => {
  const { data, loading } = getReportsRequest(entityId, entityType)

  const columns: Array<GridColDef<ReportAPIOutput> | GridActionsColDef<ReportAPIOutput>> = [
    {
      field: 'name',
      headerName: 'Nume',
      flex: 1.5,
      type: 'string',
    },
    {
      field: 'actions',
      headerName: 'Actiuni',
      flex: 1,
      type: 'actions',
      getActions: ({ row: { _id } }: GridRowParams<ReportAPIOutput>) => [
        <GridActionsCellItem
          showInMenu={true}
          icon={<OpenInNewOutlinedIcon />}
          label={'Vezi detalii'}
          onClick={() => viewReportDetails(_id)}
        />,
        <GridActionsCellItem
          showInMenu={true}
          icon={<DownloadForOfflineOutlinedIcon />}
          label={'Genereaza PDF'}
          onClick={() => null}
        />,
      ],
    },
  ]
  return (
    <Box sx={{ width: 1 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant={'h5'}>Rapoarte</Typography>
        <Button variant={'contained'} onClick={createReport} data-cy={'createReport'}>
          <Tooltip title={'Raport nou'}>
            <AddOutlinedIcon />
          </Tooltip>
        </Button>
      </Box>

      <DataGrid
        autoHeight
        loading={loading}
        disableVirtualization
        hideFooterPagination
        disableExtendRowFullWidth
        disableSelectionOnClick
        disableColumnMenu
        hideFooterSelectedRowCount
        disableDensitySelector
        disableColumnSelector
        disableColumnFilter
        disableIgnoreModificationsIfProcessingProps
        columns={columns}
        rows={data.getReports ?? []}
        getRowId={({ _id }) => _id}
        localeText={{ noRowsLabel: 'Nu exista rapoarte.' }}
      />
    </Box>
  )
}
