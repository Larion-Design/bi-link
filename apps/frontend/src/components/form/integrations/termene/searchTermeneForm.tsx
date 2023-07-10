import React, { useCallback } from 'react'
import { useFormik } from 'formik'
import { DropdownList } from '@frontend/components/form/dropdownList'
import { InputField } from '@frontend/components/form/inputField'
import Button from '@mui/material/Button'
import Grid from '@mui/material/Grid'

type Props = {
  onSubmit: (name: string | null, cui: string | null) => void
}

type FormParams = {
  name?: string
  cui?: string
  searchField: string
}

const dropdownOptions = {
  name: 'Nume',
  cui: 'CIF / CUI',
}

export const SearchTermeneForm: React.FunctionComponent<Props> = ({ onSubmit }) => {
  const { submitForm, setFieldValue, isSubmitting, values, errors } = useFormik<FormParams>({
    initialValues: {
      name: '',
      cui: '',
      searchField: 'name',
    },
    onSubmit: ({ name, cui }) => onSubmit(name, cui),
  })

  const changeSearchParam = useCallback(
    (value) => void setFieldValue('searchField', value),
    [setFieldValue],
  )

  const onInputChange = useCallback(
    (value) => void setFieldValue(values.searchField, value),
    [values.searchField, setFieldValue],
  )

  return (
    <Grid container spacing={2} sx={{ alignItems: 'center' }}>
      <Grid item xs={2}>
        <DropdownList
          value={values.searchField}
          options={dropdownOptions}
          onChange={changeSearchParam}
        />
      </Grid>
      <Grid item xs={8}>
        <InputField
          value={values.cui ?? values.name}
          onChange={onInputChange}
          error={errors.cui ?? errors.name}
        />
      </Grid>
      <Grid item xs={2}>
        <Button
          size={'large'}
          variant={'contained'}
          onClick={() => void submitForm()}
          disabled={isSubmitting}
        >
          Cauta
        </Button>
      </Grid>
    </Grid>
  )
}
