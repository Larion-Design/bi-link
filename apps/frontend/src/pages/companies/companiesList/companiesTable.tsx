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
import { CompaniesSuggestions, CompanyListRecord } from 'defs'
import React, { useMemo } from 'react'
import { generatePath, useNavigate } from 'react-router-dom'
import { PaginationParams } from 'api/shared/types/paginationParams'
import { routes } from '../../../router/routes'

type Props = {
  paginationParams: PaginationParams
  setPaginationParams: (paginationParams: PaginationParams) => void
  companies: CompaniesSuggestions
}

export const CompaniesTable: React.FunctionComponent<Props> = ({
  companies: { total, records },
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
        field: 'name',
        headerName: 'Nume',
        flex: 1,
        type: 'string',
      },
      {
        field: 'cui',
        headerName: 'CUI / CIF',
        flex: 1,
        type: 'string',
      },
      {
        field: 'registrationNumber',
        headerName: 'Numar de inregistrare',
        flex: 1,
        type: 'string',
      },
      {
        field: 'actions',
        headerName: 'Actiuni',
        flex: 1,
        editable: true,
        type: 'actions',
        getActions: ({ row: { _id, name } }: GridRowParams<CompanyListRecord>) => [
          <GridActionsCellItem
            showInMenu={false}
            icon={<OpenInNewOutlinedIcon />}
            label={`Vezi detalii despre ${name}`}
            onClick={() =>
              navigate(
                generatePath(routes.companyDetails, {
                  companyId: _id,
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
        hideFooterSelectedRowCount
        disableExtendRowFullWidth
        disableSelectionOnClick
        disableColumnMenu
        disableDensitySelector
        disableColumnFilter
        disableIgnoreModificationsIfProcessingProps
        rows={records}
        columns={columns}
        getRowId={({ _id }: GridRowModel<CompanyListRecord>) => _id}
        localeText={{
          noRowsLabel: 'Nu exista companii.',
          footerRowSelected: () => '',
        }}
      />
    </Box>
  )
}
