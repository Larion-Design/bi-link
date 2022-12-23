import React, { useMemo } from 'react'
import Box from '@mui/material/Box'
import OpenInNewOutlinedIcon from '@mui/icons-material/OpenInNewOutlined'
import {
  DataGrid,
  GridActionsCellItem,
  GridColDef,
  GridRowModel,
  GridRowParams,
} from '@mui/x-data-grid'
import { GridActionsColDef } from '@mui/x-data-grid/models/colDef/gridColDef'
import { PaginationParams } from '../../../graphql/shared/types/paginationParams'
import { VehicleListRecord, VehiclesSuggestions } from '../../../types/vehicle'
import { generatePath, useNavigate } from 'react-router-dom'
import { routes } from '../../../router/routes'

type Props = {
  paginationParams: PaginationParams
  setPaginationParams: (paginationParams: PaginationParams) => void
  vehicles: VehiclesSuggestions
}

export const VehiclesTable: React.FunctionComponent<Props> = ({ vehicles: { records, total } }) => {
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
        field: 'vin',
        headerName: 'VIN',
        flex: 1,
        type: 'string',
      },
      {
        field: 'maker',
        headerName: 'Marca',
        flex: 1,
        type: 'string',
      },
      {
        field: 'model',
        headerName: 'Model',
        flex: 1,
        type: 'string',
      },
      {
        field: 'actions',
        headerName: 'Actiuni',
        flex: 1,
        editable: true,
        type: 'actions',
        getActions: ({ row: { _id, model, maker } }: GridRowParams<VehicleListRecord>) => [
          <GridActionsCellItem
            showInMenu={false}
            icon={<OpenInNewOutlinedIcon />}
            label={`Vezi detalii despre ${maker} ${model}`}
            onClick={() =>
              navigate(
                generatePath(routes.vehicleDetails, {
                  vehicleId: _id,
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
        getRowId={({ _id }: GridRowModel<VehicleListRecord>) => _id}
        localeText={{
          noRowsLabel: 'Nu exista vehicule.',
          footerRowSelected: () => '',
        }}
      />
    </Box>
  )
}
