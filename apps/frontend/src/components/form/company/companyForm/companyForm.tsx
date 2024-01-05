import { DatePickerWithMetadata } from 'components/form/datePicker'
import React, { useEffect, useState } from 'react'
import { CompanyAPIInput } from 'defs'
import { useFormik } from 'formik'
import Stack from '@mui/material/Stack'
import Button from '@mui/material/Button'
import Grid from '@mui/material/Grid'
import Step from '@mui/material/Step'
import StepButton from '@mui/material/StepButton'
import Stepper from '@mui/material/Stepper'
import { FormattedMessage } from 'react-intl'
import { useCancelDialog } from '@frontend/utils/hooks/useCancelDialog'
import { routes } from '../../../../router/routes'
import { CONTACT_METHODS } from '@frontend/utils/constants'
import { useCompanyState } from '../../../../state/company/companyState'
import { Associates } from '../associates'
import { CustomInputFields } from '../../customInputFields'
import { FilesManager } from '../../fileField'
import { InputFieldWithMetadata } from '../../inputField'
import { Location } from '../../location'
import { Locations } from '../../locations'

type Props<T = CompanyAPIInput> = {
  companyId?: string
  onSubmit: (formData: T) => void
}

export const CompanyForm: React.FunctionComponent<Props> = ({ companyId, onSubmit }) => {
  const {
    metadata,
    name,
    cui,
    registrationNumber,
    registrationDate,
    customFields,
    contactDetails,
    associates,
    locations,
    headquarters,
    files,

    setFiles,

    updateName,
    updateCui,
    updateRegistrationNumber,
    updateRegistrationDate,
    updateHeadquarters,
    updateBranch,
    updateFile,
    updateCustomField,
    updateContactDetails,

    addBranch,
    addFile,
    addContactDetails,
    addCustomField,

    removeFiles,
    removeCustomFields,
    removeBranches,
    removeContactDetails,

    getCompany,
    getAssociates,
    getBranches,
    getFiles,
    getCustomFields,
    getContactDetails,
  } = useCompanyState()

  const [step, setStep] = useState(0)
  const cancelChanges = useCancelDialog(routes.companies)
  const { isSubmitting, isValidating, submitForm, setFieldValue } = useFormik<CompanyAPIInput>({
    validate: (values) => ({}),
    validateOnChange: false,
    validateOnMount: false,
    validateOnBlur: false,
    enableReinitialize: true,
    onSubmit,
    initialValues: getCompany(),
  })

  useEffect(() => void setFieldValue('metadata', metadata), [metadata])
  useEffect(() => void setFieldValue('name', name), [name])
  useEffect(() => void setFieldValue('cui', cui), [cui])
  useEffect(
    () => void setFieldValue('registrationNumber', registrationNumber),
    [registrationNumber],
  )
  useEffect(() => void setFieldValue('files', getFiles()), [files, getFiles])
  useEffect(
    () => void setFieldValue('customFields', getCustomFields()),
    [customFields, getCustomFields],
  )
  useEffect(
    () => void setFieldValue('contactDetails', getContactDetails()),
    [contactDetails, getContactDetails],
  )

  useEffect(() => void setFieldValue('locations', getBranches()), [locations, getBranches])

  useEffect(() => {
    void setFieldValue('associates', getAssociates())
  }, [associates, getAssociates])

  return (
    <form data-testid={'companyForm'}>
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

            <Grid item xs={4}>
              <DatePickerWithMetadata
                disableFuture
                label={'Data inregistrarii'}
                fieldInfo={registrationDate}
                updateFieldInfo={updateRegistrationDate}
              />
            </Grid>

            <Grid item xs={12}>
              <Location
                label={'Sediu social'}
                location={headquarters}
                updateLocation={updateHeadquarters}
              />
            </Grid>
          </Grid>
        )}
        {step === 1 && (
          <Grid container spacing={2}>
            <CustomInputFields
              customFields={contactDetails}
              suggestions={CONTACT_METHODS}
              updateCustomField={updateContactDetails}
              addCustomField={addContactDetails}
              removeCustomFields={removeContactDetails}
            />
          </Grid>
        )}
        {step === 2 && (
          <Grid container spacing={3}>
            <Locations
              locations={locations}
              updateLocation={updateBranch}
              addLocation={addBranch}
              removeLocations={removeBranches}
            />
          </Grid>
        )}
        {step === 3 && (
          <Grid container spacing={2}>
            <Associates sectionTitle={'Entitati asociate'} />
          </Grid>
        )}
        {step === 4 && (
          <Grid container spacing={2}>
            <FilesManager
              removeFiles={removeFiles}
              keepDeletedFiles={!!companyId}
              files={files}
              updateFiles={setFiles}
              updateFile={updateFile}
              addFile={addFile}
            />
          </Grid>
        )}
        {step === 5 && (
          <Grid container spacing={2}>
            <CustomInputFields
              customFields={customFields}
              updateCustomField={updateCustomField}
              addCustomField={addCustomField}
              removeCustomFields={removeCustomFields}
            />
          </Grid>
        )}
      </Grid>
      <Grid item xs={12} justifyContent={'flex-end'} mt={4}>
        <Stack direction={'row'} justifyContent={'flex-end'} spacing={4}>
          <Button
            data-testid={'cancelForm'}
            color={'error'}
            disabled={isSubmitting || isValidating}
            variant={'text'}
            onClick={cancelChanges}
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
        </Stack>
      </Grid>
    </form>
  )
}
