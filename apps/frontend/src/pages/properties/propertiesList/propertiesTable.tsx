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
import { generatePath, useNavigate } from 'react-router-dom'
import { routes } from '../../../router/routes'
import { PropertiesSuggestions, PropertyListRecord } from 'defs'

type Props = {
  paginationParams: PaginationParams
  setPaginationParams: (paginationParams: PaginationParams) => void
  properties: PropertiesSuggestions
}

export const PropertiesTable: React.FunctionComponent<Props> = ({
  properties: { records, total },
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
        headerName: 'Tip de proprietate',
        flex: 1,
        type: 'string',
      },
      {
        field: 'name',
        headerName: 'Nume',
        flex: 1,
        type: 'string',
      },
      {
        field: 'actions',
        headerName: 'Actiuni',
        flex: 1,
        editable: false,
        type: 'actions',
        getActions: ({ row: { _id, name } }: GridRowParams<PropertyListRecord>) => [
          <GridActionsCellItem
            showInMenu={false}
            icon={<OpenInNewOutlinedIcon />}
            label={`Vezi detalii despre ${name}`}
            onClick={() =>
              navigate(
                generatePath(routes.propertyDetails, {
                  propertyId: _id,
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
        getRowId={({ _id }: GridRowModel<PropertyListRecord>) => _id}
        localeText={{
          noRowsLabel: 'Nu exista properties.',
          footerRowSelected: () => '',
        }}
      />
    </Box>
  )
}
