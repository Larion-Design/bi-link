import { BaseTextFieldProps } from '@mui/material'
import { ReactNode } from 'react'

export type InputFieldProps = {
  name?: string
  label?: string
  value: string
  error?: string
  onChange: (value: string) => void | Promise<void>
  readonly?: boolean
  multiline?: boolean
  rows?: number
  disabled?: boolean
  required?: boolean
  size?: BaseTextFieldProps['size']
  startIcon?: ReactNode
  endIcon?: ReactNode
}
