import React, { PropsWithChildren, useContext, useState } from 'react'
import { ConfirmationDialog } from './confirmationDialog'

type DialogOptions = {
  title?: string
  description?: string
  onConfirm?: () => void
  onClose?: () => void
}

type Context = {
  openDialog: (options: DialogOptions) => void
  isOpen: boolean
}

const DialogContext = React.createContext<Context>({
  openDialog: () => null,
  isOpen: false,
})

export const useDialog = () => useContext(DialogContext)

export const DialogProvider: React.FunctionComponent<PropsWithChildren> = ({
  children,
}) => {
  const [dialogInfo, setDialogInfo] = useState<DialogOptions | null>(null)
  const [isDialogOpen, setDialogState] = useState<boolean>(false)

  const openDialog = (options: DialogOptions) => {
    setDialogInfo(options)
    setDialogState(true)
  }

  const closeDialog = () => {
    setDialogState(false)
    setDialogInfo(null)
  }

  return (
    <DialogContext.Provider
      value={{
        openDialog,
        isOpen: isDialogOpen,
      }}
    >
      {isDialogOpen && (
        <ConfirmationDialog
          open={true}
          title={dialogInfo?.title}
          description={dialogInfo?.description}
          closeDialog={closeDialog}
          confirmAction={dialogInfo?.onConfirm}
        />
      )}
      {children}
    </DialogContext.Provider>
  )
}
