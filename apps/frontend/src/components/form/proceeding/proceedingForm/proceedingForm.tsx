import { DatePickerWithMetadata } from '@frontend/components/form/datePicker'
import React, { useEffect, useState } from 'react'
import { AutocompleteFieldWithMetadata } from '@frontend/components/form/autocompleteField/autocompleteFieldWithMetadata'
import { useFormik } from 'formik'
import { useCancelDialog } from '@frontend/utils/hooks/useCancelDialog'
import { FormattedMessage } from 'react-intl'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Grid from '@mui/material/Grid'
import Step from '@mui/material/Step'
import StepButton from '@mui/material/StepButton'
import Stepper from '@mui/material/Stepper'
import { ProceedingAPIInput } from 'defs'
import { routes } from '../../../../router/routes'
import { useProceedingState } from '../../../../state/proceedingState'
import { AutocompleteField } from '../../autocompleteField'
import { CustomInputFields } from '../../customInputFields'
import { FilesManager } from '../../fileField'
import { InputField } from '../../inputField'
import { Parties } from '../parties'

type Props = {
  proceedingId?: string
  onSubmit: (formData: ProceedingAPIInput) => void
}

export const ProceedingForm: React.FunctionComponent<Props> = ({ proceedingId, onSubmit }) => {
  const [step, setStep] = useState(0)
  const cancelChanges = useCancelDialog(routes.events)

  const {
    metadata,
    name,
    type,
    year,
    description,
    entitiesInvolved,
    reason,
    fileNumber,
    files,
    customFields,

    getProceeding,
    getEntitiesInvolved,
    getFiles,
    getCustomFields,

    updateYear,
    updateName,
    updateDescription,
    updateReason,
    updateType,
    updateFile,
    updateFileNumber,
    updateCustomField,

    setFiles,
    addFile,
    addCustomField,

    removeFiles,
    removeCustomFields,
  } = useProceedingState()

  const { isValidating, isSubmitting, submitForm, setFieldValue } = useFormik<ProceedingAPIInput>({
    initialValues: getProceeding(),
    validate: (values) => void {},
    validateOnChange: false,
    validateOnMount: false,
    validateOnBlur: false,
    enableReinitialize: true,
    onSubmit,
  })

  useEffect(() => void setFieldValue('metadata', metadata), [metadata])
  useEffect(() => void setFieldValue('name', name), [name])
  useEffect(() => void setFieldValue('type', type), [type])
  useEffect(() => void setFieldValue('year', year), [year])
  useEffect(() => void setFieldValue('description', description), [description])
  useEffect(() => void setFieldValue('reason', reason), [reason])
  useEffect(() => void setFieldValue('fileNumber', fileNumber), [fileNumber])
  useEffect(() => void setFieldValue('entitiesInvolved', getEntitiesInvolved()), [entitiesInvolved])
  useEffect(() => void setFieldValue('files', getFiles()), [files])
  useEffect(() => void setFieldValue('customFields', getCustomFields()), [customFields])

  return (
    <form data-testid={'proceedingForm'}>
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
                  value={name}
                  onChange={updateName}
                />
              </Grid>

              <Grid item xs={4}>
                <AutocompleteField
                  name={'type'}
                  label={'Tip de dosar'}
                  value={type}
                  onChange={updateType}
                />
              </Grid>

              <Grid item xs={4}>
                <AutocompleteFieldWithMetadata
                  name={'fileNumber'}
                  label={'Numar dosar'}
                  fieldInfo={fileNumber}
                  updateFieldInfo={updateFileNumber}
                />
              </Grid>

              <Grid item xs={4}>
                <AutocompleteFieldWithMetadata
                  name={'reason'}
                  label={'Motivul investigatiei'}
                  fieldInfo={reason}
                  updateFieldInfo={updateReason}
                />
              </Grid>

              <Grid item xs={4}>
                <DatePickerWithMetadata
                  label={'Anul deschiderii dosarului'}
                  fieldInfo={year}
                  updateFieldInfo={updateYear}
                  views={['year']}
                  minDate={new Date(1970)}
                  disableFuture
                />
              </Grid>

              <Grid item xs={8}>
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
                keepDeletedFiles={!!proceedingId}
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
              data-testid={'cancelForm'}
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
              data-testid={'submitForm'}
            >
              <FormattedMessage id={'save'} />
            </Button>
          </Box>
        </Grid>
      </Grid>
    </form>
  )
}
