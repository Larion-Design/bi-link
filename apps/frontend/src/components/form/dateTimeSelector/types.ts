import { ReactNode } from 'react'

export type DateTimeProps = {
  value: Date | null
  onChange: (value: Date | null) => void
  label: string
  disabled?: boolean
  disableFuture?: boolean
  disablePast?: boolean
  error?: string
  startIcon?: ReactNode
  endIcon?: ReactNode
}
