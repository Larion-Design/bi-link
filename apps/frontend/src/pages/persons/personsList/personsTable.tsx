import React, { useMemo } from 'react'
import Box from '@mui/material/Box'
import OpenInNewOutlinedIcon from '@mui/icons-material/OpenInNewOutlined'
import { PersonListRecord, PersonsSuggestions } from 'defs'
import { PaginationParams } from '../../../graphql/shared/types/paginationParams'
import {
  DataGrid,
  GridActionsCellItem,
  GridColDef,
  GridRowModel,
  GridRowParams,
} from '@mui/x-data-grid'
import { GridActionsColDef } from '@mui/x-data-grid/models/colDef/gridColDef'
import { generatePath, useNavigate } from 'react-router-dom'
import { routes } from '../../../router/routes'

type Props = {
  paginationParams: PaginationParams
  setPaginationParams: (paginationParams: PaginationParams) => void
  persons: PersonsSuggestions<PersonListRecord>
}

export const PersonsTable: React.FunctionComponent<Props> = ({ persons: { total, records } }) => {
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
        field: 'lastName',
        headerName: 'Nume',
        flex: 1,
        type: 'string',
      },
      {
        field: 'firstName',
        headerName: 'Prenume',
        flex: 1,
        type: 'string',
      },
      {
        field: 'cnp',
        headerName: 'CNP',
        flex: 1,
        type: 'string',
      },
      {
        field: 'actions',
        headerName: 'Actiuni',
        flex: 1,
        editable: true,
        type: 'actions',
        getActions: ({ row: { _id, lastName, firstName } }: GridRowParams<PersonListRecord>) => [
          <GridActionsCellItem
            showInMenu={false}
            icon={<OpenInNewOutlinedIcon />}
            label={`Vezi detalii despre ${lastName} ${firstName}`}
            onClick={() =>
              navigate(
                generatePath(routes.personDetails, {
                  personId: _id,
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
        hideFooter
        hideFooterSelectedRowCount
        disableExtendRowFullWidth
        disableSelectionOnClick
        disableColumnMenu
        disableDensitySelector
        disableColumnFilter
        disableIgnoreModificationsIfProcessingProps
        rows={records}
        columns={columns}
        getRowId={({ _id }: GridRowModel<PersonListRecord>) => _id}
        localeText={{
          noRowsLabel: 'Nu exista persoane.',
          footerRowSelected: () => '',
        }}
      />
    </Box>
  )
}
