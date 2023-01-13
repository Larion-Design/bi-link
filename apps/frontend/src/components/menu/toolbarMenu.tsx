import React, { ReactNode, useRef, useState } from 'react'
import IconButton from '@mui/material/IconButton'
import MuiMenu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'

type MenuOption = {
  label: string
  onClick: () => void
}

type Props = {
  icon: ReactNode
  menuOptions: MenuOption[]
}

export const ToolbarMenu: React.FunctionComponent<Props> = ({ icon, menuOptions }) => {
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
      <IconButton
        size={'small'}
        onClick={() => setMenuState(true)}
        ref={(ref) => (menuButtonRef.current = ref)}
      >
        {icon}
      </IconButton>
    </>
  )
}
