import React, { useEffect, useMemo, useState } from 'react'
import Autocomplete from '@mui/material/Autocomplete'
import Chip from '@mui/material/Chip'
import TextField from '@mui/material/TextField'
import { useDebounce } from 'usehooks-ts'

type Props = {
  items: string[]
  label: string
  onChange: (items: string[]) => void
}

export const ItemListInput: React.FunctionComponent<Props> = ({ items, label, onChange }) => {
  const [itemsList, setItemsList] = useState(new Set(items))
  const updatedList = useMemo(() => Array.from(itemsList.values()), [itemsList])
  const debouncedItemsList = useDebounce(updatedList, 1000)

  useEffect(() => onChange(debouncedItemsList), [debouncedItemsList])

  return (
    <Autocomplete
      multiple
      fullWidth
      options={updatedList}
      defaultValue={updatedList}
      freeSolo
      onChange={(event, items) => setItemsList(new Set(items))}
      renderTags={(items: readonly string[], getTagProps) =>
        items.map((item: string, index: number) => (
          <Chip
            key={item}
            variant={'outlined'}
            label={item}
            onDelete={() =>
              setItemsList((itemsList) => {
                if (itemsList.has(item)) {
                  itemsList.delete(item)
                  return new Set(itemsList)
                }
                return itemsList
              })
            }
            {...getTagProps({ index })}
          />
        ))
      }
      renderInput={(params) => <TextField {...params} label={label} />}
    />
  )
}
