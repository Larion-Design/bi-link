import React, { useEffect } from 'react'
import { InputField } from '../inputField'
import { useDebounce } from 'usehooks-ts'

type Props = {
  value: string
  error?: string
  readonly?: boolean
  onChange: (value: string) => void | Promise<void>
}

export const SearchCompaniesInput: React.FunctionComponent<Props> = ({
  value,
  error,
  readonly,
  onChange,
}) => {
  const debouncedValue = useDebounce(value, 500)

  useEffect(() => {
    if (debouncedValue.length) {
      // perform api call here
    }
  }, [debouncedValue])

  return (
    <InputField
      name={'name'}
      label={'Nume'}
      readonly={readonly}
      value={value}
      error={error}
      onChange={async (value) => {
        onChange(value)
      }}
    />
  )
}
