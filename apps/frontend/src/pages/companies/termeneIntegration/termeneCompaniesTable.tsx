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
import { OSINTCompany } from 'defs'

type Props = {
  companies: OSINTCompany[]
}

export const TermeneCompaniesTable: React.FunctionComponent<Props> = ({ companies }) => {
  const columns: Array<GridColDef | GridActionsColDef> = useMemo(
    () => [
      {
        field: 'name',
        headerName: 'Nume',
        flex: 1.5,
        type: 'string',
      },
      {
        field: 'cui',
        headerName: 'CUI',
        type: 'string',
        flex: 1,
      },
      {
        field: 'registrationNumber',
        headerName: 'Nr. Inmatriculare',
        flex: 1,
        type: 'string',
      },
      {
        field: 'headquarters',
        headerName: 'Sediu Social',
        flex: 1.5,
        type: 'string',
      },
      {
        field: 'actions',
        headerName: 'Actiuni',
        flex: 1,
        editable: true,
        type: 'actions',
        getActions: ({ row: { cui, name } }: GridRowParams<OSINTCompany>) => [
          <GridActionsCellItem
            showInMenu={false}
            icon={<OpenInNewOutlinedIcon />}
            label={`Importa ${name}`}
            onClick={() => null}
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
        rowCount={companies.length}
        hideFooterPagination
        hideFooter
        hideFooterSelectedRowCount
        disableExtendRowFullWidth
        disableSelectionOnClick
        disableColumnMenu
        disableDensitySelector
        disableColumnFilter
        disableIgnoreModificationsIfProcessingProps
        rows={companies}
        columns={columns}
        getRowId={({ cui }: GridRowModel<OSINTCompany>) => cui}
        localeText={{
          noRowsLabel: 'Nu exista companii.',
          footerRowSelected: () => '',
        }}
      />
    </Box>
  )
}
