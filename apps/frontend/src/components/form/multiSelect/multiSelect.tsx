import CheckBoxIcon from '@mui/icons-material/CheckBox'
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank'
import { Checkbox } from '@mui/material'
import Autocomplete from '@mui/material/Autocomplete'
import TextField from '@mui/material/TextField'
import React, { useEffect, useState } from 'react'
import { useDebounce } from 'usehooks-ts'

type Props = {
  label: string
  disabled?: boolean
  options: string[]
  checkedOptions: string[]
  onSelectedOptionsChange: (options: string[]) => void
}

export const MultiSelect: React.FunctionComponent<Props> = ({
  label,
  disabled,
  options,
  checkedOptions,
  onSelectedOptionsChange,
}) => {
  const [selectedOptions, setSelectedOptions] = useState(new Set(checkedOptions))
  const debouncedSeletedOptions = useDebounce(selectedOptions, 2000)

  useEffect(
    () => onSelectedOptionsChange(Array.from(debouncedSeletedOptions)),
    [debouncedSeletedOptions],
  )

  return (
    <Autocomplete
      multiple
      fullWidth
      options={options}
      disabled={disabled}
      disableCloseOnSelect
      getOptionLabel={(option) => option}
      renderOption={(props, option) => (
        <li {...props}>
          <Checkbox
            icon={<CheckBoxOutlineBlankIcon fontSize={'small'} />}
            checkedIcon={<CheckBoxIcon fontSize={'small'} />}
            style={{ marginRight: 8 }}
            checked={selectedOptions.has(option)}
            onChange={(event, checked) =>
              setSelectedOptions((selectedOptions) => {
                if (checked) {
                  selectedOptions.delete(option)
                } else selectedOptions.add(option)

                return new Set(selectedOptions)
              })
            }
          />
          {option}
        </li>
      )}
      style={{ width: 500 }}
      renderInput={(params) => <TextField {...params} label={label} />}
    />
  )
}
