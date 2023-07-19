import React, { useCallback } from 'react'
import { useFormik } from 'formik'
import { InputField } from '@frontend/components/form/inputField'
import Button from '@mui/material/Button'
import Grid from '@mui/material/Grid'
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined'

type Props = {
  onSubmit: (searchTerm: string) => Promise<unknown>
}

type FormParams = {
  searchTerm: string
}

export const SearchTermeneForm: React.FunctionComponent<Props> = ({ onSubmit }) => {
  const { submitForm, setFieldValue, isSubmitting, values, errors } = useFormik<FormParams>({
    initialValues: {
      searchTerm: '',
    },
    onSubmit: ({ searchTerm }) => onSubmit(searchTerm),
  })

  const onInputChange = useCallback(
    (value: string) => void setFieldValue('searchTerm', value.trim()),
    [setFieldValue],
  )

  return (
    <Grid container spacing={3} sx={{ alignItems: 'center' }}>
      <Grid item xs={11}>
        <InputField
          size={'small'}
          placeholder={'Cauta companii dupa nume sau CUI / CIF'}
          value={values.searchTerm}
          onChange={onInputChange}
        />
      </Grid>
      <Grid item xs={1}>
        <Button
          size={'large'}
          variant={'contained'}
          onClick={() => void submitForm()}
          disabled={isSubmitting || values.searchTerm.length < 3}
        >
          <SearchOutlinedIcon />
        </Button>
      </Grid>
    </Grid>
  )
}
