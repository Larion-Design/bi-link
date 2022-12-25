import React, { useCallback, useState } from 'react'
import Grid from '@mui/material/Grid'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Stepper from '@mui/material/Stepper'
import Step from '@mui/material/Step'
import StepButton from '@mui/material/StepButton'
import { ApolloError } from '@apollo/client'
import { useNavigate } from 'react-router-dom'
import { FormikProps, withFormik } from 'formik'
import { routes } from '../../../router/routes'
import { FilesManager } from '../fileField'
import { CustomInputFields } from '../customInputFields'
import { InputField } from '../inputField'
import { useDialog } from '../../dialog/dialogProvider'
import { IncidentAPIInput } from 'defs'
import { DateTimeSelector } from '../dateTimeSelector'
import { Parties } from '../parties'
import { getIncidentFrequentCustomFieldsRequest } from '../../../graphql/incidents/queries/getIncidentFrequentCustomFields'
import { AutocompleteField } from '../autocompleteField'
import { personFormValidation } from '../personForm/validation/validation'

type Props = {
  incidentId?: string
  incidentInfo?: IncidentAPIInput
  readonly: boolean
  onSubmit: (formData: IncidentAPIInput) => Promise<void>
  error?: ApolloError
}

const Form: React.FunctionComponent<Props & FormikProps<IncidentAPIInput>> = ({
  incidentId,
  readonly,
  setFieldError,
  setFieldValue,
  values,
  errors,
  isSubmitting,
  isValidating,
  submitForm,
}) => {
  const navigate = useNavigate()
  const { data: frequentFields } = getIncidentFrequentCustomFieldsRequest()
  const dialog = useDialog()
  const [step, setStep] = useState(0)

  const cancelChanges = useCallback(
    () =>
      dialog.openDialog({
        title: 'Esti sigur(a) ca vrei sa anulezi modificarile?',
        description: 'Toate modificarile nesalvate vor fi pierdute.',
        onConfirm: () => navigate(routes.incidents),
      }),
    [],
  )

  return (
    <form data-cy={'incidentForm'}>
      <Grid container spacing={10}>
        <Grid item xs={12}>
          <Stepper nonLinear alternativeLabel activeStep={step}>
            <Step completed={false}>
              <StepButton color={'inherit'} onClick={() => setStep(0)}>
                Informatii generale
              </StepButton>
            </Step>
            <Step completed={false}>
              <StepButton color={'inherit'} onClick={() => setStep(1)}>
                Informatii suplimentare
              </StepButton>
            </Step>
            <Step completed={false}>
              <StepButton color={'inherit'} onClick={() => setStep(2)}>
                Parti implicate
              </StepButton>
            </Step>
            <Step completed={false}>
              <StepButton color={'inherit'} onClick={() => setStep(3)}>
                Fisiere
              </StepButton>
            </Step>
          </Stepper>
        </Grid>
        <Grid item xs={12} container justifyContent={'center'}>
          {step === 0 && (
            <Grid item xs={6} container spacing={2}>
              <Grid item xs={6}>
                <AutocompleteField
                  name={'type'}
                  label={'Tipul incidentului'}
                  value={values.type}
                  error={errors.type}
                  onValueChange={(value) => setFieldValue('type', value)}
                  suggestions={['Accident rutier']}
                />
              </Grid>

              <Grid item xs={6}>
                <DateTimeSelector
                  label={'Data si ora'}
                  disableFuture
                  value={values.date}
                  error={errors.date as string}
                  onChange={(date) => setFieldValue('date', date)}
                />
              </Grid>

              <Grid item xs={12}>
                <InputField
                  name={'location'}
                  label={'Locatie'}
                  value={values.location}
                  error={errors.location}
                  onChange={(value) => setFieldValue('location', value)}
                />
              </Grid>

              <Grid item xs={12}>
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
            <Grid container spacing={2}>
              <CustomInputFields
                fields={values.customFields}
                suggestions={frequentFields?.getIncidentFrequentCustomFields}
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
            <Grid container spacing={2}>
              <Parties
                parties={values.parties}
                updateParties={(parties) => setFieldValue('parties', parties)}
              />
            </Grid>
          )}
          {step === 3 && (
            <Grid container spacing={2}>
              <FilesManager
                files={values.files}
                keepDeletedFiles={!!incidentId}
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
              Anulează
            </Button>
            <Button
              disabled={isSubmitting || isValidating || readonly}
              variant={'contained'}
              onClick={() => void submitForm()}
              data-cy={'submitForm'}
            >
              Salvează
            </Button>
          </Box>
        </Grid>
      </Grid>
    </form>
  )
}

const incidentInitialValues: IncidentAPIInput = {
  description: '',
  type: '',
  date: null,
  location: '',
  parties: [],
  files: [],
  customFields: [],
}

export const IncidentForm = withFormik<Props, IncidentAPIInput>({
  mapPropsToValues: ({ incidentInfo }) => incidentInfo ?? incidentInitialValues,
  validate: (values, { incidentId }) => void {},
  validateOnChange: false,
  validateOnMount: false,
  validateOnBlur: false,
  handleSubmit: (values, { props: { onSubmit } }) => onSubmit(values),
})(Form)
