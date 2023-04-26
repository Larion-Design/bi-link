import React, { useEffect, useState } from 'react'
import { AutocompleteFieldWithMetadata } from '@frontend/components/form/autocompleteField/autocompleteFieldWithMetadata'
import { DateTimeSelectorWithMetadata } from '@frontend/components/form/dateTimeSelector/dateTimeSelectorWithMetadata'
import { eventTypes } from '@frontend/components/form/event/constants'
import { useCancelDialog } from '@frontend/utils/hooks/useCancelDialog'
import { useFormik } from 'formik'
import { FormattedMessage } from 'react-intl'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Grid from '@mui/material/Grid'
import Step from '@mui/material/Step'
import StepButton from '@mui/material/StepButton'
import Stepper from '@mui/material/Stepper'
import { EventAPIInput } from 'defs'
import { getDefaultEvent } from 'tools'
import { routes } from '../../../../router/routes'
import { useEventState } from '../../../../state/eventState'
import { CustomInputFields } from '../../customInputFields'
import { FilesManager } from '../../fileField'
import { InputField } from '../../inputField'
import { Location } from '../../location'
import { Parties } from '../parties'

type Props<T = EventAPIInput> = {
  eventId?: string
  eventInfo?: T
  onSubmit: (formData: T) => void | Promise<void>
}

export const EventForm: React.FunctionComponent<Props> = ({ eventId, onSubmit, eventInfo }) => {
  const [step, setStep] = useState(0)
  const cancelChanges = useCancelDialog(routes.events)

  const {
    metadata,
    type,
    date,
    location,
    description,
    customFields,
    files,
    parties,
    participantsCustomFields,

    setFiles,

    updateType,
    updateDate,
    updateLocation,
    updateDescription,
    updateCustomField,
    updateFile,

    addFile,
    addCustomField,

    removeFiles,
    removeCustomFields,
  } = useEventState()

  const { submitForm, isSubmitting, isValidating, setFieldValue } = useFormik<EventAPIInput>({
    initialValues: eventInfo ?? getDefaultEvent(),
    validate: (values) => void {},
    validateOnChange: false,
    validateOnMount: false,
    validateOnBlur: false,
    enableReinitialize: true,
    onSubmit,
  })

  useEffect(() => void setFieldValue('metadata', metadata), [metadata])
  useEffect(() => void setFieldValue('type', type), [type])
  useEffect(() => void setFieldValue('date', date), [date])
  useEffect(() => void setFieldValue('location', location), [location])
  useEffect(() => void setFieldValue('description', description), [description])
  useEffect(() => void setFieldValue('parties', Array.from(files)), [files])
  useEffect(() => void setFieldValue('customFields', Array.from(customFields)), [customFields])

  useEffect(() => {
    void setFieldValue(
      'parties',
      Array.from(parties.values()).map((partyInfo) => ({
        metadata: partyInfo.metadata,
        type: partyInfo.type,
        description: partyInfo.description,
        customFields: Array.from(partyInfo.customFields).map((customFieldId) =>
          participantsCustomFields.get(customFieldId),
        ),
        persons: Array.from(partyInfo.persons).map((_id) => ({ _id })),
        companies: Array.from(partyInfo.companies).map((_id) => ({ _id })),
        properties: Array.from(partyInfo.properties).map((_id) => ({ _id })),
      })),
    )
  }, [parties, participantsCustomFields])

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
                <AutocompleteFieldWithMetadata
                  name={'type'}
                  label={'Tip de eveniment'}
                  fieldInfo={type}
                  updateFieldInfo={updateType}
                  suggestions={eventTypes}
                />
              </Grid>

              <Grid item xs={6}>
                <DateTimeSelectorWithMetadata
                  label={'Data si ora'}
                  fieldInfo={date}
                  updateFieldInfo={updateDate}
                  disableFuture
                />
              </Grid>

              <Grid item xs={12}>
                <Location label={'Locatie'} location={location} updateLocation={updateLocation} />
              </Grid>

              <Grid item xs={12}>
                <InputField
                  name={'description'}
                  label={'Descriere'}
                  multiline
                  rows={10}
                  value={description}
                  onChange={updateDescription}
                />
              </Grid>
            </Grid>
          )}
          {step === 1 && (
            <Grid item xs={12} container spacing={2}>
              <CustomInputFields
                customFields={customFields}
                updateCustomField={updateCustomField}
                addCustomField={addCustomField}
                removeCustomFields={removeCustomFields}
              />
            </Grid>
          )}
          {step === 2 && (
            <Grid item xs={12} container spacing={2}>
              <Parties />
            </Grid>
          )}
          {step === 3 && (
            <Grid item xs={12} container spacing={2}>
              <FilesManager
                removeFiles={removeFiles}
                keepDeletedFiles={!!eventId}
                files={files}
                updateFiles={setFiles}
                updateFile={updateFile}
                addFile={addFile}
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
