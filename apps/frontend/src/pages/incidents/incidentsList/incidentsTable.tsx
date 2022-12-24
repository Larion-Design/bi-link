import React, { useMemo } from 'react'
import Box from '@mui/material/Box'
import { PaginationParams } from '../../../graphql/shared/types/paginationParams'
import { IncidentListRecord, IncidentsSuggestions } from 'defs'
import { generatePath, useNavigate } from 'react-router-dom'
import {
  DataGrid,
  GridActionsCellItem,
  GridColDef,
  GridRowModel,
  GridRowParams,
} from '@mui/x-data-grid'
import { GridActionsColDef } from '@mui/x-data-grid/models/colDef/gridColDef'
import OpenInNewOutlinedIcon from '@mui/icons-material/OpenInNewOutlined'
import { routes } from '../../../router/routes'

type Props = {
  paginationParams: PaginationParams
  setPaginationParams: (paginationParams: PaginationParams) => void
  incidents: IncidentsSuggestions
}

export const IncidentsTable: React.FunctionComponent<Props> = ({
  incidents: { records, total },
}) => {
  const navigate = useNavigate()
  const columns: Array<GridColDef | GridActionsColDef> = useMemo(
    () => [
      {
        field: '_id',
        headerName: 'ID',
        type: 'string',
        flex: 1.5,
      },
      {
        field: 'type',
        headerName: 'Tipul de incident',
        type: 'string',
        flex: 1,
      },
      {
        field: 'date',
        headerName: 'Data',
        flex: 1,
        type: 'dateTime',
      },
      {
        field: 'location',
        headerName: 'Locatia',
        flex: 1.5,
        type: 'string',
      },
      {
        field: 'actions',
        headerName: 'Actiuni',
        flex: 1,
        editable: true,
        type: 'actions',
        getActions: ({ row: { _id } }: GridRowParams<IncidentListRecord>) => [
          <GridActionsCellItem
            showInMenu={false}
            icon={<OpenInNewOutlinedIcon />}
            label={'Vezi detalii despre incident'}
            onClick={() =>
              navigate(
                generatePath(routes.incidentDetails, {
                  incidentId: _id,
                }),
              )
            }
          />,
        ],
      },
    ],
    [],
  )
  return (
    <Box display={'flex'} justifyContent={'center'}>
      <DataGrid
        autoHeight
        rowCount={total}
        hideFooterPagination
        disableExtendRowFullWidth
        disableSelectionOnClick
        disableColumnMenu
        disableDensitySelector
        disableColumnFilter
        disableIgnoreModificationsIfProcessingProps
        rows={records}
        columns={columns}
        getRowId={({ _id }: GridRowModel<IncidentListRecord>) => _id}
        localeText={{
          noRowsLabel: 'Nu exista incidente.',
          footerRowSelected: () => '',
        }}
      />
    </Box>
  )
}
