import { defaultLocation } from '@frontend/components/form/location'
import React, { useEffect } from 'react'
import { CompanySelectorView } from './companySelector'
import { useFormik } from 'formik'
import { CompanyAPIInput } from 'defs'
import { createCompanyRequest } from '../../../../graphql/companies/mutations/createCompany'
import {
  companyFormValidation,
  validateCompanyForm,
} from '../../../form/company/companyForm/validation/validation'
import CardContent from '@mui/material/CardContent'
import Grid from '@mui/material/Grid'
import { InputField } from '../../../form/inputField'
import CardActions from '@mui/material/CardActions'
import Button from '@mui/material/Button'
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined'
import Box from '@mui/material/Box'
import { ModalHeader } from '../../modalHeader'

type Props = {
  closeModal: () => void
  companiesSelected?: (companiesIds: string[]) => void
  changeView: (view: CompanySelectorView) => void
}

export const FastCreateCompany: React.FunctionComponent<Props> = ({
  closeModal,
  companiesSelected,
  changeView,
}) => {
  const [createCompany, { data }] = createCompanyRequest()
  const { values, errors, setFieldError, setFieldValue, submitForm, isSubmitting } = useFormik({
    initialValues: companyInitialValues,
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
      <ModalHeader title={'Creaza o companie rapid'} closeModal={closeModal} />
      <CardContent sx={{ height: 0.8, mb: 2 }}>
        <Grid container spacing={4}>
          <Grid item xs={4}>
            <InputField
              label={'Nume'}
              value={values.name}
              error={errors.name}
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
              value={values.cui}
              error={errors.cui}
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
              error={errors.registrationNumber}
              value={values.registrationNumber}
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
            Inchide
          </Button>
          <Button
            variant={'contained'}
            color={'primary'}
            disabled={isSubmitting}
            onClick={submitForm}
          >
            Salvează
          </Button>
        </Box>
      </CardActions>
    </>
  )
}

const companyInitialValues: CompanyAPIInput = {
  name: '',
  cui: '',
  registrationNumber: '',
  headquarters: defaultLocation,
  locations: [],
  files: [],
  associates: [],
  contactDetails: [],
  customFields: [],
}
