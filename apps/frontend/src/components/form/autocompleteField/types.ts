import { InputFieldProps } from '@frontend/components/form/inputField'

export type AutocompleteFieldProps = InputFieldProps & {
  suggestions?: string[] | Readonly<string[]>
}
