import { ReactNode } from 'react'

export type DatePickerProps = {
  name?: string
  label: string
  error?: string
  value: string | Date | null
  minDate?: Date
  maxDate?: Date
  onChange: (value: Date | null) => Promise<void> | void
  onReset: () => void
  readonly?: boolean
  disableHighlightToday?: boolean
  disableFuture?: boolean
  disablePast?: boolean
  disabled?: boolean
  startIcon?: ReactNode
  endIcon?: ReactNode
}
