import React, { useState } from 'react'
import { ApolloError } from '@apollo/client'
import { getDefaultCompany } from '@frontend/components/form/company/constants'
import { useCancelDialog } from '@frontend/utils/hooks/useCancelDialog'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Grid from '@mui/material/Grid'
import Step from '@mui/material/Step'
import StepButton from '@mui/material/StepButton'
import Stepper from '@mui/material/Stepper'
import { CompanyAPIInput } from 'defs'
import { FormikProps, withFormik } from 'formik'
import { FormattedMessage } from 'react-intl'
import { getCompanyFrequentCustomFieldsRequest } from '@frontend/graphql/companies/queries/getCompanyFrequentCustomFields'
import { routes } from '../../../../router/routes'
import { CONTACT_METHODS } from '@frontend/utils/constants'
import { Associates } from '../associates'
import { CustomInputFields } from '../../customInputFields'
import { FilesManager } from '../../fileField'
import { InputField } from '../../inputField'
import { Location } from '../../location'
import { Locations } from '../../locations'
import { personFormValidation } from '../../person/personForm/validation/validation'
import { companyFormValidation, validateCompanyForm } from './validation/validation'

type Props = {
  companyId?: string
  companyInfo?: CompanyAPIInput
  readonly?: boolean
  onSubmit: (formData: CompanyAPIInput) => void | Promise<void>
  error?: ApolloError
}

const Form: React.FunctionComponent<Props & FormikProps<CompanyAPIInput>> = ({
  companyId,
  setFieldError,
  setFieldValue,
  values,
  errors,
  isSubmitting,
  isValidating,
  submitForm,
}) => {
  const { data: frequentFields } = getCompanyFrequentCustomFieldsRequest()
  const [step, setStep] = useState(0)
  const cancelChanges = useCancelDialog(routes.companies)

  return (
    <form data-cy={'companyForm'}>
      <Grid container item xs={12} spacing={10}>
        <Grid item xs={12}>
          <Stepper nonLinear alternativeLabel activeStep={step}>
            <Step completed={false}>
              <StepButton color={'inherit'} onClick={() => setStep(0)}>
                <FormattedMessage id={'General Information'} />
              </StepButton>
            </Step>
            <Step completed={false}>
              <StepButton color={'inherit'} onClick={() => setStep(1)}>
                Date contact
              </StepButton>
            </Step>
            <Step completed={false}>
              <StepButton color={'inherit'} onClick={() => setStep(2)}>
                <FormattedMessage id={'Branches'} />
              </StepButton>
            </Step>
            <Step completed={false}>
              <StepButton color={'inherit'} onClick={() => setStep(3)}>
                <FormattedMessage id={'Associates'} />
              </StepButton>
            </Step>
            <Step completed={false}>
              <StepButton color={'inherit'} onClick={() => setStep(4)}>
                <FormattedMessage id={'Files'} />
              </StepButton>
            </Step>
            <Step completed={false}>
              <StepButton color={'inherit'} onClick={() => setStep(5)}>
                <FormattedMessage id={'Additional Information'} />
              </StepButton>
            </Step>
          </Stepper>
        </Grid>
      </Grid>
      <Grid item xs={12} mt={7}>
        {step === 0 && (
          <Grid container spacing={2}>
            <Grid item xs={4}>
              <InputField
                name={'name'}
                label={'Nume'}
                value={values.name}
                error={errors.name}
                onChange={async (value) => {
                  const error = await companyFormValidation.name(value)
                  setFieldValue('name', value)
                  setFieldError('name', error)
                }}
              />
            </Grid>

            <Grid item xs={4}>
              <InputField
                name={'cui'}
                label={'CIF / CUI'}
                value={values.cui}
                error={errors.cui}
                onChange={async (value) => {
                  const error = await companyFormValidation.cui(value, companyId)
                  setFieldValue('cui', value)
                  setFieldError('cui', error)
                }}
              />
            </Grid>

            <Grid item xs={4}>
              <InputField
                name={'registrationNumber'}
                label={'Numar de inregistrare'}
                value={values.registrationNumber}
                error={errors.registrationNumber}
                onChange={async (value) => {
                  const error = await companyFormValidation.registrationNumber(value, companyId)
                  setFieldValue('registrationNumber', value)
                  setFieldError('registrationNumber', error)
                }}
              />
            </Grid>

            <Grid item xs={12}>
              <Location
                label={'Sediu social'}
                location={values.headquarters}
                updateLocation={async (value) => {
                  const error = await companyFormValidation.headquarters(value)
                  setFieldValue('headquarters', value)
                  setFieldError('headquarters', error)
                }}
              />
            </Grid>
          </Grid>
        )}
        {step === 1 && (
          <Grid container spacing={2}>
            <CustomInputFields
              fields={values.contactDetails}
              suggestions={CONTACT_METHODS}
              setFieldValue={async (contactDetails) => {
                const error = await personFormValidation.contactDetails(contactDetails)
                setFieldValue('contactDetails', contactDetails)
                setFieldError('contactDetails', error)
              }}
              error={errors.contactDetails as string}
            />
          </Grid>
        )}
        {step === 2 && (
          <Grid container spacing={3}>
            <Locations
              locations={values.locations}
              updateLocations={async (locations) => {
                const error = await companyFormValidation.locations(locations)
                setFieldValue('locations', locations)
                setFieldError('locations', error)
              }}
            />
          </Grid>
        )}
        {step === 3 && (
          <Grid container spacing={2}>
            <Associates
              sectionTitle={'Entitati asociate'}
              error={errors.associates as string}
              associates={values.associates}
              updateAssociatesField={async (associates) => {
                const error = await companyFormValidation.associates(associates)
                setFieldValue('associates', associates)
                setFieldError('associates', error)
              }}
            />
          </Grid>
        )}
        {step === 4 && (
          <Grid container spacing={2}>
            <FilesManager
              keepDeletedFiles={!!companyId}
              files={values.files}
              updateFiles={async (uploadedFiles) => {
                const error = await companyFormValidation.files(uploadedFiles)
                setFieldValue('files', uploadedFiles)
                setFieldError('files', error)
              }}
            />
          </Grid>
        )}
        {step === 5 && (
          <Grid container spacing={2}>
            <CustomInputFields
              fields={values.customFields}
              suggestions={frequentFields?.getCompanyFrequentCustomFields}
              error={errors.customFields as string}
              setFieldValue={async (customFields) => {
                const error = await personFormValidation.customFields(customFields)
                setFieldValue('customFields', customFields)
                setFieldError('customFields', error)
              }}
            />
          </Grid>
        )}
      </Grid>
      <Grid item xs={12} justifyContent={'flex-end'} mt={4}>
        <Box display={'flex'} justifyContent={'flex-end'}>
          <Button
            data-cy={'cancelForm'}
            color={'error'}
            disabled={isSubmitting || isValidating}
            variant={'text'}
            onClick={cancelChanges}
            sx={{ mr: 4 }}
          >
            <FormattedMessage id={'cancel'} />
          </Button>
          <Button
            disabled={isSubmitting || isValidating}
            variant={'contained'}
            onClick={() => void submitForm()}
            data-cy={'submitForm'}
          >
            <FormattedMessage id={'save'} />
          </Button>
        </Box>
      </Grid>
    </form>
  )
}

export const CompanyForm = withFormik<Props, CompanyAPIInput>({
  mapPropsToValues: ({ companyInfo }) => companyInfo ?? getDefaultCompany(),
  validate: async (values, { companyId }) => validateCompanyForm(values, companyId),
  validateOnChange: false,
  validateOnMount: false,
  validateOnBlur: false,
  handleSubmit: (values, { props: { onSubmit } }) => onSubmit(values),
})(Form)
