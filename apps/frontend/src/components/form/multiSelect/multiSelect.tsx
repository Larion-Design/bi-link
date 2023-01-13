import { FormControl, InputLabel } from '@mui/material'
import React, { useCallback, useId, useMemo } from 'react'
import Chip from '@mui/material/Chip'
import Box from '@mui/material/Box'
import Select from '@mui/material/Select'
import Checkbox from '@mui/material/Checkbox'
import ListItemText from '@mui/material/ListItemText'
import MenuItem from '@mui/material/MenuItem'

type MultiSelectOption = {
  value: string
  label: string
  selected: boolean
}

type Props = {
  label: string
  disabled?: boolean
  options: MultiSelectOption[]
  onSelectedOptionsChange: (options: string[]) => void
}

export const MultiSelect: React.FunctionComponent<Props> = ({
  label,
  disabled,
  options,
  onSelectedOptionsChange,
}) => {
  const labelId = useId()

  const selectedOptions = useMemo(
    () => options.filter(({ selected }) => selected).map(({ value }) => value),
    [options],
  )

  const deps = [options, selectedOptions, onSelectedOptionsChange]

  const removeOption = useCallback((optionValue: string) => {
    const set = new Set(selectedOptions)
    set.delete(optionValue)
    onSelectedOptionsChange(Array.from(set))
  }, deps)

  const addOption = useCallback((optionValue: string) => {
    const set = new Set(selectedOptions)
    set.add(optionValue)
    onSelectedOptionsChange(Array.from(set))
  }, deps)

  return (
    <FormControl variant={'outlined'} size={'small'} fullWidth>
      <InputLabel id={labelId}>{label}</InputLabel>
      <Select
        size={'small'}
        labelId={labelId}
        fullWidth
        multiple
        disabled={disabled || !options.length}
        label={label}
        value={selectedOptions}
        renderValue={() => (
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
            {options
              .filter(({ selected }) => selected)
              .map(({ value, label }) => (
                <Chip
                  key={value}
                  label={label}
                  variant={'outlined'}
                  onDelete={() => removeOption(value)}
                />
              ))}
          </Box>
        )}
      >
        {options.map(({ label, value, selected }) => (
          <MenuItem key={value} value={value} selected={selected}>
            <Checkbox
              size={'small'}
              checked={selected}
              onChange={(event, selected) => (selected ? addOption(value) : removeOption(value))}
            />
            <ListItemText primary={label} />
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  )
}
