import React, { useState } from 'react'
import AddOutlinedIcon from '@mui/icons-material/AddOutlined'
import Button from '@mui/material/Button'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import Divider from '@mui/material/Divider'

type Props = {
  defaultOption: string
  options?: string[]
  optionSelected: (value: string) => void
}

export const AddSuggestionsToolbarButton: React.FunctionComponent<Props> = ({
  defaultOption,
  options,
  optionSelected,
}) => {
  const [menuTriggerRef, setMenuRef] = useState<null | HTMLElement>(null)
  const [isMenuOpen, setMenuState] = useState<boolean>(false)

  return (
    <>
      {isMenuOpen && (
        <Menu
          open={isMenuOpen}
          anchorEl={menuTriggerRef}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
          onClose={() => setMenuState(false)}
        >
          <MenuItem onClick={() => optionSelected(defaultOption)}>
            {defaultOption.length ? defaultOption : 'Camp gol'}
          </MenuItem>
          <Divider />

          {options?.map((option) => (
            <MenuItem key={option} onClick={() => optionSelected(option)}>
              {option}
            </MenuItem>
          ))}
        </Menu>
      )}
      <Button
        size={'small'}
        variant={'contained'}
        startIcon={<AddOutlinedIcon />}
        ref={(ref) => setMenuRef(ref)}
        onClick={() =>
          options?.length ? setMenuState(true) : optionSelected(defaultOption)
        }
      >
        Adaugă
      </Button>
    </>
  )
}
