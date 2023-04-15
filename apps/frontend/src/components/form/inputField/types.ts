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
}
