import React, { useCallback, useState } from 'react'
import { GridColDef, GridRenderEditCellParams, useGridApiContext } from '@mui/x-data-grid'
import InputBase, { InputBaseProps } from '@mui/material/InputBase'
import { Paper, Popper } from '@mui/material'

const TextareaEditor: React.FunctionComponent<GridRenderEditCellParams<string>> = ({
  id,
  field,
  value,
  colDef,
}) => {
  const [valueState, setValueState] = useState(value)
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>()
  const apiRef = useGridApiContext()

  const handleRef = useCallback((el: HTMLElement | null) => setAnchorEl(el), [])

  const handleChange = useCallback<NonNullable<InputBaseProps['onChange']>>(
    (event) => {
      const newValue = event.target.value
      setValueState(newValue)
      apiRef.current.setEditCellValue({ id, field, value: newValue, debounceMs: 400 }, event)
    },
    [apiRef, field, id],
  )

  const handleKeyDown = useCallback<NonNullable<InputBaseProps['onKeyDown']>>(
    (event) => {
      if (
        event.key === 'Escape' ||
        (event.key === 'Enter' && !event.shiftKey && (event.ctrlKey || event.metaKey))
      ) {
        const params = apiRef.current.getCellParams(id, field)
        apiRef.current.publishEvent('cellKeyDown', params, event)
      }
    },
    [apiRef, id, field],
  )

  return (
    <div style={{ position: 'relative', alignSelf: 'flex-start' }}>
      <div
        ref={handleRef}
        style={{
          height: 1,
          width: colDef.computedWidth,
          display: 'block',
          position: 'absolute',
          top: 0,
        }}
      />
      {anchorEl && (
        <Popper open anchorEl={anchorEl} placement={'bottom-start'}>
          <Paper elevation={1} sx={{ p: 1, minWidth: colDef.computedWidth }}>
            <InputBase
              multiline
              rows={7}
              value={valueState}
              sx={{ textarea: { resize: 'both' }, width: '100%' }}
              onChange={handleChange}
              autoFocus
              onKeyDown={handleKeyDown}
            />
          </Paper>
        </Popper>
      )}
    </div>
  )
}

export const Textarea: GridColDef['renderEditCell'] = (params) => (
  <TextareaEditor {...params} />
)
