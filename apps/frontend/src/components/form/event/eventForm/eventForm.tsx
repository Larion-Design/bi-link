import React, { useState } from 'react'
import { eventTypes } from '@frontend/components/form/event/constants'
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
import { EventAPIInput } from 'defs'
import { getEventFrequentCustomFieldsRequest } from '@frontend/graphql/events/queries/getEventFrequentCustomFields'
import { getDefaultEvent, getDefaultLocation } from 'tools'
import { routes } from '../../../../router/routes'
import { AutocompleteField } from '../../autocompleteField'
import { CustomInputFields } from '../../customInputFields'
import { DateTimeSelector } from '../../dateTimeSelector'
import { FilesManager } from '../../fileField'
import { InputField } from '../../inputField'
import { Location } from '../../location'
import { Parties } from '../parties'
import { personFormValidation } from '../../person/personForm/validation/validation'

type Props = {
  eventId?: string
  eventInfo?: EventAPIInput
  onSubmit: (formData: EventAPIInput) => void | Promise<void>
  error?: ApolloError
}

const Form: React.FunctionComponent<Props & FormikProps<EventAPIInput>> = ({
  eventId,
  setFieldError,
  setFieldValue,
  values,
  errors,
  isSubmitting,
  isValidating,
  submitForm,
}) => {
  const { data: frequentFields } = getEventFrequentCustomFieldsRequest()
  const [step, setStep] = useState(0)
  const cancelChanges = useCancelDialog(routes.events)

  return (
    <form data-cy={'eventForm'}>
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
              <Grid item xs={6}>
                <AutocompleteField
                  name={'type'}
                  label={'Tip de eveniment'}
                  value={values.type.value}
                  error={errors.type.value}
                  onValueChange={(value) => setFieldValue('type', value)}
                  suggestions={eventTypes}
                />
              </Grid>

              <Grid item xs={6}>
                <DateTimeSelector
                  label={'Data si ora'}
                  disableFuture
                  value={values.date.value ? new Date(values.date.value) : null}
                  error={errors.date as string}
                  onChange={(date) => setFieldValue('date', date)}
                />
              </Grid>

              <Grid item xs={12}>
                <Location
                  label={'Locatie'}
                  location={values.location ?? getDefaultLocation()}
                  updateLocation={(location) => {
                    setFieldValue('location', location)
                  }}
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
            <Grid item xs={12} container spacing={2}>
              <CustomInputFields
                fields={values.customFields}
                suggestions={frequentFields?.getEventFrequentCustomFields}
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
                parties={values.parties}
                updateParties={(parties) => setFieldValue('parties', parties)}
              />
            </Grid>
          )}
          {step === 3 && (
            <Grid item xs={12} container spacing={2}>
              <FilesManager
                files={values.files}
                keepDeletedFiles={!!eventId}
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

export const EventForm = withFormik<Props, EventAPIInput>({
  mapPropsToValues: ({ eventInfo }) => eventInfo ?? getDefaultEvent(),
  validate: (values, { eventId }) => void {},
  validateOnChange: false,
  validateOnMount: false,
  validateOnBlur: false,
  enableReinitialize: true,
  handleSubmit: (values, { props: { onSubmit } }) => void onSubmit(values),
})(Form)
