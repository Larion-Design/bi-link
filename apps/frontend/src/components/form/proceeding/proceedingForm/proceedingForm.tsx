import React, { useMemo, useState } from 'react'
import { useCancelDialog } from '@frontend/utils/hooks/useCancelDialog'
import { ApolloError } from '@apollo/client'
import { FormikProps, withFormik } from 'formik'
import { FormattedMessage } from 'react-intl'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Grid from '@mui/material/Grid'
import Step from '@mui/material/Step'
import StepButton from '@mui/material/StepButton'
import Stepper from '@mui/material/Stepper'
import { ProceedingAPIInput } from 'defs'
import { getDefaultProceeding } from 'tools'
import { routes } from '../../../../router/routes'
import { AutocompleteField } from '../../autocompleteField'
import { CustomInputFields } from '../../customInputFields'
import { FilesManager } from '../../fileField'
import { InputField } from '../../inputField'
import { personFormValidation } from '../../person/personForm/validation/validation'
import { Parties } from '../parties'

type Props = {
  proceedingId?: string
  proceedingInfo?: ProceedingAPIInput
  onSubmit: (formData: ProceedingAPIInput) => void | Promise<void>
  error?: ApolloError
}

const Form: React.FunctionComponent<Props & FormikProps<ProceedingAPIInput>> = ({
  proceedingId,
  setFieldError,
  setFieldValue,
  values,
  errors,
  isSubmitting,
  isValidating,
  submitForm,
}) => {
  const [step, setStep] = useState(0)
  const cancelChanges = useCancelDialog(routes.events)

  const proceedingYears = useMemo(() => {
    const years: string[] = ['']
    let year = 1970
    const currentYear = new Date().getFullYear()

    while (++year <= currentYear) {
      years.push(year.toString())
    }
    return years
  }, [])

  return (
    <form data-cy={'proceedingForm'}>
      <Grid container spacing={10}>
        <Grid item xs={12}>
          <Stepper nonLinear alternativeLabel activeStep={step}>
            <Step completed={false}>
              <StepButton color={'inherit'} onClick={() => setStep(0)}>
                <FormattedMessage id={'General Information'} />
              </StepButton>
            </Step>
            <Step completed={false}>
              <StepButton color={'inherit'} onClick={() => setStep(2)}>
                Parti implicate
              </StepButton>
            </Step>
            <Step completed={false}>
              <StepButton color={'inherit'} onClick={() => setStep(3)}>
                <FormattedMessage id={'Files'} />
              </StepButton>
            </Step>
            <Step completed={false}>
              <StepButton color={'inherit'} onClick={() => setStep(1)}>
                <FormattedMessage id={'Additional Information'} />
              </StepButton>
            </Step>
          </Stepper>
        </Grid>
        <Grid item xs={12} container>
          {step === 0 && (
            <Grid item xs={12} container spacing={2}>
              <Grid item xs={4}>
                <AutocompleteField
                  name={'name'}
                  label={'Nume'}
                  value={values.name}
                  error={errors.name}
                  onValueChange={(value) => setFieldValue('name', value)}
                />
              </Grid>

              <Grid item xs={4}>
                <AutocompleteField
                  name={'type'}
                  label={'Tip de dosar'}
                  value={values.type}
                  error={errors.type}
                  onValueChange={(value) => setFieldValue('type', value)}
                />
              </Grid>

              <Grid item xs={4}>
                <AutocompleteField
                  name={'fileNumber'}
                  label={'Numar dosar'}
                  value={values.type}
                  error={errors.type}
                  onValueChange={(value) => setFieldValue('fileNumber', value)}
                />
              </Grid>

              <Grid item xs={4}>
                <AutocompleteField
                  name={'reason'}
                  label={'Motivul investigatiei'}
                  value={values.reason.value}
                  error={errors.reason.value}
                  onValueChange={(value) => setFieldValue('reason', value)}
                />
              </Grid>

              <Grid item xs={4}>
                <AutocompleteField
                  name={'year'}
                  label={'Anul deschiderii dosarului'}
                  value={values.year ? values.year.toString() : ''}
                  error={errors.reason.value}
                  onValueChange={(value) => setFieldValue('year', parseInt(value) ?? 0)}
                  suggestions={proceedingYears}
                />
              </Grid>

              <Grid item xs={8}>
                <InputField
                  name={'description'}
                  label={'Descriere'}
                  multiline
                  rows={10}
                  value={values.description}
                  error={errors.description}
                  onChange={(value) => setFieldValue('description', value)}
                />
              </Grid>
            </Grid>
          )}
          {step === 1 && (
            <Grid item xs={12} container spacing={2}>
              <CustomInputFields
                fields={values.customFields}
                setFieldValue={async (customFields) => {
                  const error = await personFormValidation.customFields(customFields)
                  setFieldValue('customFields', customFields)
                  setFieldError('customFields', error)
                }}
                error={errors.customFields as string}
              />
            </Grid>
          )}
          {step === 2 && (
            <Grid item xs={12} container spacing={2}>
              <Parties
                parties={values.entitiesInvolved}
                updateParties={(parties) => setFieldValue('entitiesInvolved', parties)}
              />
            </Grid>
          )}
          {step === 3 && (
            <Grid item xs={12} container spacing={2}>
              <FilesManager
                files={values.files}
                keepDeletedFiles={!!proceedingId}
                updateFiles={async (uploadedFiles) => {
                  const error = await personFormValidation.files(uploadedFiles)
                  setFieldValue('files', uploadedFiles)
                  setFieldError('files', error)
                }}
              />
            </Grid>
          )}
        </Grid>

        <Grid item xs={12} justifyContent={'flex-end'}>
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
      </Grid>
    </form>
  )
}

export const ProceedingForm = withFormik<Props, ProceedingAPIInput>({
  mapPropsToValues: ({ proceedingInfo }) => proceedingInfo ?? getDefaultProceeding(),
  validate: (values, { proceedingId }) => void {},
  validateOnChange: false,
  validateOnMount: false,
  validateOnBlur: false,
  enableReinitialize: true,
  handleSubmit: (values, { props: { onSubmit } }) => void onSubmit(values),
})(Form)
