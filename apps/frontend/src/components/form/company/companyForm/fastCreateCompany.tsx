import React, { useEffect } from 'react'
import {
  companyFormValidation,
  validateCompanyForm,
} from '@frontend/components/form/company/companyForm/validation/validation'
import { InputField } from '@frontend/components/form/inputField'
import { CompanySelectorView } from '@frontend/components/modal/entitySelector'
import { ModalHeader } from '@frontend/components/modal/modalHeader'
import { FormattedMessage } from 'react-intl'
import { getDefaultCompany } from 'tools'
import { useFormik } from 'formik'
import { createCompanyRequest } from '@frontend/graphql/companies/mutations/createCompany'
import CardContent from '@mui/material/CardContent'
import Grid from '@mui/material/Grid'
import CardActions from '@mui/material/CardActions'
import Button from '@mui/material/Button'
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined'
import Box from '@mui/material/Box'

type Props = {
  closeModal: () => void
  companiesSelected?: (companiesIds: string[]) => void
  changeView: (view: CompanySelectorView) => void
  onSubmit: (companyId: string) => void
  onCancel: () => void
}

export const FastCreateCompany: React.FunctionComponent<Props> = ({
  closeModal,
  companiesSelected,
  changeView,
}) => {
  const [createCompany, { data }] = createCompanyRequest()
  const { values, errors, setFieldError, setFieldValue, submitForm, isSubmitting } = useFormik({
    initialValues: getDefaultCompany(),
    validateOnMount: false,
    validateOnBlur: false,
    validateOnChange: false,
    validate: (values) => validateCompanyForm(values),
    onSubmit: (companyInfo) => createCompany({ variables: { companyInfo } }),
  })

  useEffect(() => {
    if (data?.createCompany) {
      companiesSelected?.([data.createCompany])
      closeModal()
    }
  }, [data?.createCompany])

  return (
    <>
      <ModalHeader title={'Creaza o companie'} closeModal={closeModal} />
      <CardContent sx={{ height: 0.8, mb: 2 }}>
        <Grid container spacing={4}>
          <Grid item xs={4}>
            <InputField
              label={'Nume'}
              value={values.name.value}
              error={errors.name.value}
              onChange={async (value) => {
                const error = await companyFormValidation.name(value)
                setFieldError('name', error)
                await setFieldValue('name', value)
              }}
            />
          </Grid>
          <Grid item xs={4}>
            <InputField
              label={'CUI / CIF'}
              value={values.cui.value}
              error={errors.cui.value}
              onChange={async (value) => {
                const error = await companyFormValidation.cui(value)
                setFieldError('cui', error)
                await setFieldValue('cui', value)
              }}
            />
          </Grid>
          <Grid item xs={4}>
            <InputField
              label={'Numar de inregistrare'}
              error={errors.registrationNumber.value}
              value={values.registrationNumber.value}
              onChange={async (value) => {
                const error = await companyFormValidation.registrationNumber(value)
                setFieldError('registrationNumber', error)
                await setFieldValue('registrationNumber', value)
              }}
            />
          </Grid>
        </Grid>
      </CardContent>
      <CardActions sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Button
          variant={'contained'}
          color={'primary'}
          startIcon={<SearchOutlinedIcon />}
          onClick={() => changeView('search')}
        >
          Cauta companii
        </Button>

        <Box display={'flex'}>
          <Button variant={'outlined'} color={'error'} onClick={closeModal} sx={{ mr: 2 }}>
            <FormattedMessage id={'close'} />
          </Button>
          <Button
            variant={'contained'}
            color={'primary'}
            disabled={isSubmitting}
            onClick={submitForm}
          >
            <FormattedMessage id={'save'} />
          </Button>
        </Box>
      </CardActions>
    </>
  )
}
