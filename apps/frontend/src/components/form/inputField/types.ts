import { InputBaseProps } from '@mui/material/InputBase/InputBase'
import { ReactNode } from 'react'
import { BaseTextFieldProps } from '@mui/material'

export type InputFieldProps = {
  name?: string
  label?: string
  value: string
  error?: string
  autoComplete?: BaseTextFieldProps['autoComplete']
  placeholder?: string
  onChange: (value: string) => void
  readonly?: boolean
  multiline?: boolean
  rows?: number
  disabled?: boolean
  required?: boolean
  size?: BaseTextFieldProps['size']
  startIcon?: ReactNode
  endIcon?: ReactNode
  inputProps?: InputBaseProps['inputProps']
}
