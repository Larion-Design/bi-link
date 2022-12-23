import * as React from 'react'
import { useCallback, useEffect, useState } from 'react'
import {
  DataGrid,
  GridColDef,
  GridPreProcessEditCellProps,
  GridRowModel,
  GridSelectionModel,
  GridToolbarContainer,
} from '@mui/x-data-grid'
//import Popper from '@mui/material/Popper'
//import Paper from '@mui/material/Paper'
import { CustomFieldAPI } from '../../../types/customField'
import { GridSetItem, useGridSet } from '../../../utils/hooks/useGridSet'
import AddOutlinedIcon from '@mui/icons-material/AddOutlined'
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined'
import Button from '@mui/material/Button'

const columns: GridColDef[] = [
  {
    field: 'fieldName',
    headerName: 'Numele campului',
    editable: true,
    type: 'string',
    flex: 1,
    preProcessEditCellProps: (params: GridPreProcessEditCellProps) => {
      if (params.hasChanged) {
        const hasError = !params.props.value.length
        return { ...params.props, error: hasError }
      }
      return params
    },
  },
  {
    field: 'fieldValue',
    headerName: 'Continutul campului',
    flex: 2,
    editable: true,
    type: 'string',
    // renderEditCell: (params) => <EditTextarea {...params} />,
    preProcessEditCellProps: (params: GridPreProcessEditCellProps) => {
      const hasError = !params.props.value.length
      return { ...params.props, error: hasError }
    },
  },
]

type Props = {
  customFields: CustomFieldAPI[]
}

export const CustomFields: React.FunctionComponent<Props> = ({
  customFields,
}) => {
  const { values, create, update, removeBulk } = useGridSet(customFields)
  const [selectedRows, setSelectedRows] = useState<GridSelectionModel>([])

  const processRowUpdate = useCallback(
    async (newRow: GridRowModel<GridSetItem<CustomFieldAPI>>) => {
      update(newRow)
      return Promise.resolve(newRow)
    },
    [],
  )

  useEffect(() => {
    console.debug(values())
  }, [values])

  return (
    <DataGrid
      checkboxSelection
      disableSelectionOnClick
      disableIgnoreModificationsIfProcessingProps
      hideFooterPagination
      rows={values()}
      columns={columns}
      experimentalFeatures={{ newEditingApi: true }}
      getRowId={({ _id }) => _id}
      processRowUpdate={processRowUpdate}
      onSelectionModelChange={(selectedRows) => setSelectedRows(selectedRows)}
      components={{
        Toolbar: () => (
          <GridToolbarContainer sx={{ p: 2 }}>
            <Button
              size={'small'}
              variant={'contained'}
              startIcon={<AddOutlinedIcon />}
              onClick={() => {
                create({
                  fieldName: '',
                  fieldValue: '',
                })
              }}
            >
              Adaugă
            </Button>

            {!!selectedRows.length && (
              <Button
                size={'small'}
                variant={'contained'}
                color={'error'}
                startIcon={<DeleteOutlinedIcon />}
                onClick={() => removeBulk(selectedRows as string[])}
                sx={{ ml: 1 }}
              >
                Sterge
              </Button>
            )}
          </GridToolbarContainer>
        ),
      }}
      localeText={{
        noRowsLabel: 'Nu ai adăugat nicio informatie.',
        footerRowSelected: () => '',
      }}
    />
  )
}
