import React, { useEffect } from 'react'
import { validateCompanyForm } from '@frontend/components/form/company/companyForm/validation/validation'
import { InputFieldWithMetadata } from '@frontend/components/form/inputField'
import { CompanySelectorView } from '@frontend/components/modal/entitySelector'
import { ModalHeader } from '@frontend/components/modal/modalHeader'
import { FormattedMessage } from 'react-intl'
import { getDefaultCompany } from 'default-values'
import { useFormik } from 'formik'
import { createCompanyRequest } from '@frontend/graphql/companies/mutations/createCompany'
import CardContent from '@mui/material/CardContent'
import Grid from '@mui/material/Grid'
import CardActions from '@mui/material/CardActions'
import Button from '@mui/material/Button'
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined'
import Box from '@mui/material/Box'
import { useCompanyState } from 'state/company/companyState'

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
  const { setFieldValue, submitForm, isSubmitting, isValidating } = useFormik({
    initialValues: getDefaultCompany(),
    validateOnMount: false,
    validateOnBlur: false,
    validateOnChange: false,
    validate: (values) => validateCompanyForm(values),
    onSubmit: (companyInfo) => createCompany({ variables: { companyInfo } }),
  })

  const { name, cui, registrationNumber, updateName, updateCui, updateRegistrationNumber } =
    useCompanyState()

  useEffect(() => void setFieldValue('name', name), [name])
  useEffect(() => void setFieldValue('cui', cui), [cui])
  useEffect(
    () => void setFieldValue('registrationNumber', registrationNumber),
    [registrationNumber],
  )

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
            <InputFieldWithMetadata
              name={'name'}
              label={'Nume'}
              fieldInfo={name}
              updateFieldInfo={updateName}
            />
          </Grid>
          <Grid item xs={4}>
            <InputFieldWithMetadata
              name={'cui'}
              label={'CIF / CUI'}
              fieldInfo={cui}
              updateFieldInfo={updateCui}
            />
          </Grid>
          <Grid item xs={4}>
            <InputFieldWithMetadata
              name={'registrationNumber'}
              label={'Numar de inregistrare'}
              fieldInfo={registrationNumber}
              updateFieldInfo={updateRegistrationNumber}
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
            disabled={isSubmitting || isValidating}
            onClick={() => void submitForm()}
          >
            <FormattedMessage id={'save'} />
          </Button>
        </Box>
      </CardActions>
    </>
  )
}
