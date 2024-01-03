import React, { PropsWithChildren, useCallback, useRef, useState } from 'react'
import IconButton from '@mui/material/IconButton'
import MoreVertOutlinedIcon from '@mui/icons-material/MoreVertOutlined'
import Menu from '@mui/material/Menu'
import Button from '@mui/material/Button'
import WidgetsIcon from '@mui/icons-material/Widgets'

type Props = {
  label?: string
}

export const InputFieldMenu: React.FunctionComponent<PropsWithChildren<Props>> = ({
  label,
  children,
}) => {
  const buttonRef = useRef<Element | null>()
  const [open, setOpenState] = useState(false)
  const closeMenu = useCallback(() => {
    buttonRef.current = null
    setOpenState(false)
  }, [open])

  return (
    <>
      {label ? (
        <Button
          variant={'contained'}
          onClick={(event) => {
            setOpenState(true)
            buttonRef.current = event.currentTarget
          }}
          endIcon={<WidgetsIcon fontSize={'medium'} />}
        >
          {label}
        </Button>
      ) : (
        <IconButton
          onClick={(event) => {
            setOpenState(true)
            buttonRef.current = event.currentTarget
          }}
        >
          <MoreVertOutlinedIcon fontSize={'medium'} />
        </IconButton>
      )}
      {!!buttonRef.current && (
        <Menu open={true} anchorEl={buttonRef.current} onClose={closeMenu} onClick={closeMenu}>
          {children}
        </Menu>
      )}
    </>
  )
}
