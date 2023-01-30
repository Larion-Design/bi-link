import Tooltip from '@mui/material/Tooltip'
import React, { ReactNode, useCallback, useRef, useState } from 'react'
import IconButton from '@mui/material/IconButton'
import MuiMenu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'

type MenuOption = {
  label: string
  onClick: () => void
  addDivider?: boolean
}

type Props = {
  label?: string
  icon: ReactNode
  menuOptions: MenuOption[]
}

export const ToolbarMenu: React.FunctionComponent<Props> = ({ icon, menuOptions, label }) => {
  const menuButtonRef = useRef<Element | null>(null)
  const [isMenuOpen, setMenuState] = useState(false)

  const closeMenu = useCallback(() => {
    menuButtonRef.current = null
    setMenuState(false)
  }, [menuButtonRef, setMenuState])

  const button = (
    <IconButton
      size={'small'}
      onClick={() => setMenuState(true)}
      ref={(ref) => (menuButtonRef.current = ref)}
    >
      {icon}
    </IconButton>
  )

  return (
    <>
      {isMenuOpen && (
        <MuiMenu
          open={isMenuOpen}
          anchorEl={menuButtonRef.current}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
          onClose={closeMenu}
        >
          {menuOptions?.map(({ label, onClick, addDivider }) => (
            <MenuItem
              key={label}
              onClick={() => {
                onClick()
                closeMenu()
              }}
              divider={addDivider}
            >
              {label}
            </MenuItem>
          ))}
        </MuiMenu>
      )}
      {label ? <Tooltip title={label}>{button}</Tooltip> : button}
    </>
  )
}
