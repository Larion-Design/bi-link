import OpenInNewOutlinedIcon from '@mui/icons-material/OpenInNewOutlined'
import Box from '@mui/material/Box'
import {
  DataGrid,
  GridActionsCellItem,
  GridColDef,
  GridRowModel,
  GridRowParams,
} from '@mui/x-data-grid'
import { GridActionsColDef } from '@mui/x-data-grid/models/colDef/gridColDef'
import React, { useMemo } from 'react'
import { PersonListRecord, ProceedingListRecord, ProceedingSuggestions } from 'defs'
import { PaginationParams } from '@frontend/graphql/shared/types/paginationParams'
import { generatePath, useNavigate } from 'react-router-dom'
import { routes } from '../../../router/routes'

type Props = {
  paginationParams: PaginationParams
  setPaginationParams: (paginationParams: PaginationParams) => void
  proceedings: ProceedingSuggestions
}

export const ProceedingsTable: React.FunctionComponent<Props> = ({
  proceedings: { total, records },
}) => {
  const navigate = useNavigate()
  const columns: Array<GridColDef | GridActionsColDef> = useMemo(
    () => [
      {
        field: '_id',
        headerName: 'ID',
        type: 'string',
        flex: 1.3,
      },
      {
        field: 'name',
        headerName: 'Nume',
        flex: 1.3,
        type: 'string',
      },
      {
        field: 'type',
        headerName: 'Tip de proces',
        flex: 1,
        type: 'string',
      },
      {
        field: 'fileNumber',
        headerName: 'Numar dosar',
        flex: 1,
        type: 'string',
      },
      {
        field: 'year',
        headerName: 'An',
        flex: 1,
        type: 'number',
      },
      {
        field: 'actions',
        headerName: 'Actiuni',
        flex: 1,
        editable: true,
        type: 'actions',
        getActions: ({ row: { _id } }: GridRowParams<ProceedingListRecord>) => [
          <GridActionsCellItem
            showInMenu={false}
            icon={<OpenInNewOutlinedIcon />}
            label={'Vezi detalii despre proces'}
            onClick={() => navigate(generatePath(routes.proceedingDetails, { proceedingId: _id }))}
          />,
        ],
      },
    ],
    [],
  )

  return (
    <Box sx={{ width: 1, display: 'flex', justifyContent: 'center' }}>
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
        getRowId={({ _id }: GridRowModel<ProceedingListRecord>) => _id}
        localeText={{
          noRowsLabel: 'Nu exista persoane.',
          footerRowSelected: () => '',
        }}
      />
    </Box>
  )
}
