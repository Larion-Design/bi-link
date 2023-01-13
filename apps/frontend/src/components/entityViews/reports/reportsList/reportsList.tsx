import React, { useMemo } from 'react'
import AddOutlinedIcon from '@mui/icons-material/AddOutlined'
import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'
import OpenInNewOutlinedIcon from '@mui/icons-material/OpenInNewOutlined'
import DownloadForOfflineOutlinedIcon from '@mui/icons-material/DownloadForOfflineOutlined'
import CopyAllOutlinedIcon from '@mui/icons-material/CopyAllOutlined'
import { DataGrid, GridActionsCellItem, GridColDef, GridRowParams } from '@mui/x-data-grid'
import { GridActionsColDef } from '@mui/x-data-grid/models/colDef/gridColDef'
import { EntityType, ReportAPIOutput } from 'defs'
import { getReportsRequest } from '../../../../graphql/reports/queries/getReports'
import { getReportTemplatesRequest } from '../../../../graphql/reports/queries/getReportTemplates'
import { ToolbarMenu } from '../../../menu/toolbarMenu'

type Props = {
  entityId: string
  entityType: EntityType
  viewReportDetails: (reportId: string) => void
  createReport: () => void
}

export const ReportsList: React.FunctionComponent<Props> = ({
  entityId,
  entityType,
  createReport,
  viewReportDetails,
}) => {
  const { data: reports, loading: loadingReports } = getReportsRequest(entityId, entityType)
  const { data: templates } = getReportTemplatesRequest()

  const columns: Array<GridColDef<ReportAPIOutput> | GridActionsColDef<ReportAPIOutput>> = useMemo(
    () => [
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
    ],
    [reports?.getReports],
  )

  return (
    <Box sx={{ width: 1 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant={'h5'}>Rapoarte</Typography>
        <IconButton onClick={createReport} data-cy={'createReport'}>
          <Tooltip title={'Raport nou'}>
            <AddOutlinedIcon />
          </Tooltip>
        </IconButton>

        {templates?.getReports?.length > 0 && (
          <Tooltip title={'Raport nou dupa model'}>
            <ToolbarMenu
              icon={<CopyAllOutlinedIcon />}
              menuOptions={templates?.getReports.map(({ _id, name }) => ({
                label: name,
                onClick: () => viewReportDetails(_id),
              }))}
            />
          </Tooltip>
        )}
      </Box>

      <DataGrid
        autoHeight
        loading={loadingReports}
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
        rows={reports.getReports ?? []}
        getRowId={({ _id }) => _id}
        localeText={{ noRowsLabel: 'Nu exista rapoarte.' }}
      />
    </Box>
  )
}
