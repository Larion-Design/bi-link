import { BaseDatePickerProps } from '@mui/x-date-pickers/DatePicker/shared'
import { CalendarPickerView } from '@mui/x-date-pickers/internals/models/views'
import { ReactNode } from 'react'

export type DatePickerProps = {
  name?: string
  label: string
  error?: string
  value: string | Date | null
  minDate?: Date
  maxDate?: Date
  onChange: (value: Date | null) => void
  onReset?: () => void
  readonly?: boolean
  disableHighlightToday?: boolean
  disableFuture?: boolean
  disablePast?: boolean
  disabled?: boolean
  startIcon?: ReactNode
  endIcon?: ReactNode
  views?: CalendarPickerView[]
}
