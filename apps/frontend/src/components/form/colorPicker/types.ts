import { ReactNode } from 'react'

export type ColorPickerProps = {
  name: string
  value: string
  label: string
  disabled?: boolean
  onChange: (value: string) => void
  error?: string
  startIcon?: ReactNode
  endIcon?: ReactNode
}
