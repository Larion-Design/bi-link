import AddOutlinedIcon from '@mui/icons-material/AddOutlined'
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
import React, { useRef, useState } from 'react'
import MuiMenu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'

type MenuOption = {
  label: string
  onClick: () => void
}

type Props = {
  buttonLabel: string
  menuOptions: MenuOption[]
}

export const ToolbarMenu: React.FunctionComponent<Props> = ({ buttonLabel, menuOptions }) => {
  const menuButtonRef = useRef<Element | null>(null)
  const [isMenuOpen, setMenuState] = useState(false)

  return (
    <>
      {isMenuOpen && (
        <MuiMenu
          open={isMenuOpen}
          anchorEl={menuButtonRef.current}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
          onClose={() => (menuButtonRef.current = null)}
        >
          {menuOptions?.map(({ label, onClick }) => (
            <MenuItem key={label} onClick={onClick}>
              {label}
            </MenuItem>
          ))}
        </MuiMenu>
      )}
      <Button
        size={'small'}
        variant={'contained'}
        startIcon={<AddOutlinedIcon />}
        onClick={() => setMenuState(true)}
        ref={(ref) => (menuButtonRef.current = ref)}
      >
        {buttonLabel}
      </Button>
    </>
  )
}
