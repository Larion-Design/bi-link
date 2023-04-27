import { TextFieldProps } from '@mui/material/TextField/TextField'
import { ReactNode } from 'react'

export type NumberInputProps = TextFieldProps & {
  value: number
  disabled?: boolean
  name?: string
  label?: string
  error?: string
  required?: boolean
  readonly?: boolean
  onChange: (value: number) => void
  startIcon?: ReactNode
  endIcon?: ReactNode
}
