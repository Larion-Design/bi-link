import React, { useMemo } from 'react'
import { UserAPI } from 'defs'
import { generatePath, useNavigate } from 'react-router-dom'
import { routes } from '../../router/routes'
import Box from '@mui/material/Box'
import FactCheckOutlinedIcon from '@mui/icons-material/FactCheckOutlined'
import {
  DataGrid,
  GridActionsCellItem,
  GridColDef,
  GridRowModel,
  GridRowParams,
} from '@mui/x-data-grid'
import { GridActionsColDef } from '@mui/x-data-grid/models/colDef/gridColDef'

type Props = {
  users: UserAPI[]
}

export const UsersTable: React.FunctionComponent<Props> = ({ users }) => {
  const navigate = useNavigate()
  const columns: Array<GridColDef | GridActionsColDef> = useMemo(
    () => [
      {
        field: '_id',
        headerName: 'ID',
        type: 'string',
        flex: 2,
      },
      {
        field: 'name',
        headerName: 'Nume',
        flex: 1,
        type: 'string',
      },
      {
        field: 'email',
        headerName: 'Email',
        flex: 1,
        type: 'string',
      },
      {
        field: 'role',
        headerName: 'Rol',
        flex: 1,
        type: 'singleSelect',
        valueOptions: ['Administrator', 'Operator'],
        editable: true,
      },
      {
        field: 'active',
        headerName: 'Activ?',
        flex: 1,
        type: 'boolean',
        editable: true,
      },
      {
        field: 'actions',
        headerName: 'Actiuni',
        flex: 1,
        editable: true,
        type: 'actions',
        getActions: ({ row: { _id, name } }: GridRowParams<UserAPI>) => [
          <GridActionsCellItem
            showInMenu={false}
            icon={<FactCheckOutlinedIcon />}
            label={`Vezi activitatea lui ${name}`}
            onClick={() =>
              navigate(
                generatePath(routes.history, {
                  userId: _id,
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
        rowCount={users.length}
        hideFooterPagination
        disableExtendRowFullWidth
        disableSelectionOnClick
        disableColumnMenu
        disableDensitySelector
        disableColumnFilter
        disableIgnoreModificationsIfProcessingProps
        rows={users}
        columns={columns}
        getRowId={({ _id }: GridRowModel<UserAPI>) => _id}
        localeText={{
          noRowsLabel: 'Nu exista utilizatori.',
          footerRowSelected: () => '',
        }}
      />
    </Box>
  )
}
