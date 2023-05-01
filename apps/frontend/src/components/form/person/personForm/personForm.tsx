import React, { useEffect, useState } from 'react'
import { useFormik } from 'formik'
import { FormattedMessage } from 'react-intl'
import Stack from '@mui/material/Stack'
import Button from '@mui/material/Button'
import Grid from '@mui/material/Grid'
import Step from '@mui/material/Step'
import StepButton from '@mui/material/StepButton'
import Stepper from '@mui/material/Stepper'
import { PersonAPIInput } from 'defs'
import { useCancelDialog } from '@frontend/utils/hooks/useCancelDialog'
import { Education } from '@frontend/components/form/person/education'
import { Location } from '@frontend/components/form/location'
import { OldNames } from '@frontend/components/form/person/oldNames'
import { routes } from '../../../../router/routes'
import { CONTACT_METHODS, ID_DOCUMENT_TYPES } from '@frontend/utils/constants'
import { usePersonState } from '../../../../state/personState'
import { CustomInputFields } from '../../customInputFields'
import { DatePickerWithMetadata } from '../../datePicker'
import { FilesManager } from '../../fileField'
import { IdDocuments } from '../idDocuments'
import { Images } from '../../images'
import { InputFieldWithMetadata } from '../../inputField'
import { Relationships } from '../relationships'
import { getBirthdateFromCnp } from './utils'

type Props = {
  personId?: string
  onSubmit: (formData: PersonAPIInput) => void
}

export const PersonForm: React.FunctionComponent<Props> = ({ personId, onSubmit }) => {
  const [step, setStep] = useState(0)
  const cancelChanges = useCancelDialog(routes.persons)
  const {
    metadata,
    firstName,
    lastName,
    oldNames,
    cnp,
    birthdate,
    birthPlace,
    homeAddress,
    images,
    files,
    documents,
    relationships,
    customFields,
    contactDetails,
    education,

    getPerson,
    getRelationships,
    getEducation,
    getOldNames,
    getDocuments,
    getFiles,
    getImages,
    getCustomFields,
    getContactDetails,

    setFiles,
    addFile,
    setImages,
    addImage,
    addContactDetails,
    addCustomField,

    updateFile,
    updateCustomField,
    updateContactDetails,
    updateFirstName,
    updateBirthPlace,
    updateCnp,
    updateLastName,
    updateHomeAddress,
    updateBirthdate,
    updateImage,

    removeFiles,
    removeCustomFields,
    removeContactDetails,
    removeImages,
  } = usePersonState()

  const { submitForm, setFieldValue, isSubmitting, isValidating } = useFormik<PersonAPIInput>({
    enableReinitialize: true,
    validateOnBlur: false,
    validateOnChange: false,
    validateOnMount: true,
    validate: (values) => ({}),
    onSubmit,
    initialValues: getPerson(),
  })

  useEffect(() => {
    void setFieldValue('cnp', cnp)

    if (!birthdate?.value) {
      const parsedBirthdate = getBirthdateFromCnp(cnp.value)

      if (parsedBirthdate) {
        updateBirthdate({ ...birthdate, value: parsedBirthdate })
      }
    }
  }, [cnp])

  useEffect(() => void setFieldValue('metadata', metadata), [metadata])
  useEffect(() => void setFieldValue('firstName', firstName), [firstName])
  useEffect(() => void setFieldValue('lastName', lastName), [lastName])
  useEffect(() => void setFieldValue('birthdate', birthdate), [birthdate])
  useEffect(() => void setFieldValue('birthPlace', birthPlace), [birthPlace])
  useEffect(() => void setFieldValue('homeAddress', homeAddress), [homeAddress])
  useEffect(() => void setFieldValue('education', getEducation()), [education])
  useEffect(() => void setFieldValue('oldNames', getOldNames()), [oldNames])
  useEffect(() => void setFieldValue('relationships', getRelationships()), [relationships])
  useEffect(() => void setFieldValue('files', getFiles()), [files])
  useEffect(() => void setFieldValue('images', getImages()), [images])
  useEffect(() => void setFieldValue('customFields', getCustomFields()), [customFields])
  useEffect(() => void setFieldValue('contactDetails', getContactDetails()), [contactDetails])
  useEffect(() => void setFieldValue('documents', getDocuments()), [documents])

  return (
    <form data-cy={'personsForm'}>
      <Grid container spacing={10}>
        <Grid item xs={12}>
          <Stepper nonLinear alternativeLabel activeStep={step}>
            <Step completed={false}>
              <StepButton color={'inherit'} onClick={() => setStep(0)}>
                <FormattedMessage id={'General Information'} />
              </StepButton>
            </Step>
            <Step completed={false}>
              <StepButton color={'inherit'} onClick={() => setStep(1)}>
                Date de contact
              </StepButton>
            </Step>
            <Step completed={false}>
              <StepButton color={'inherit'} onClick={() => setStep(2)}>
                Documente identitate
              </StepButton>
            </Step>
            <Step completed={false}>
              <StepButton color={'inherit'} onClick={() => setStep(3)}>
                <FormattedMessage id={'Relationships'} />
              </StepButton>
            </Step>
            <Step completed={false}>
              <StepButton color={'inherit'} onClick={() => setStep(4)}>
                <FormattedMessage id={'Education'} />
              </StepButton>
            </Step>
            <Step completed={false}>
              <StepButton color={'inherit'} onClick={() => setStep(5)}>
                <FormattedMessage id={'Files'} />
              </StepButton>
            </Step>
            <Step completed={false}>
              <StepButton color={'inherit'} onClick={() => setStep(6)}>
                <FormattedMessage id={'Additional Information'} />
              </StepButton>
            </Step>
          </Stepper>
        </Grid>
        <Grid item xs={12} container>
          {step === 0 && (
            <Grid container spacing={2}>
              <Grid item xs={3}>
                <Images
                  images={images}
                  setImages={setImages}
                  updateImage={updateImage}
                  removeImages={removeImages}
                  addImage={addImage}
                />
              </Grid>
              <Grid container item xs={9} spacing={3}>
                <Grid item xs={4}>
                  <InputFieldWithMetadata
                    name={'lastName'}
                    label={'Nume'}
                    fieldInfo={lastName}
                    updateFieldInfo={updateLastName}
                  />
                </Grid>

                <Grid item xs={4}>
                  <InputFieldWithMetadata
                    name={'firstName'}
                    label={'Prenume'}
                    fieldInfo={firstName}
                    updateFieldInfo={updateFirstName}
                  />
                </Grid>

                <Grid item xs={4}>
                  <InputFieldWithMetadata
                    name={'cnp'}
                    label={'Cod numeric personal'}
                    fieldInfo={cnp}
                    updateFieldInfo={updateCnp}
                  />
                </Grid>

                <Grid item xs={4}>
                  <DatePickerWithMetadata
                    label={'Data nasterii'}
                    fieldInfo={birthdate}
                    updateFieldInfo={updateBirthdate}
                    disableFuture
                    disableHighlightToday
                  />
                </Grid>

                <Grid item xs={12} sx={{ mt: 2 }}>
                  <Location
                    label={'Locul nasterii'}
                    location={birthPlace}
                    updateLocation={updateBirthPlace}
                    includeFields={['locality', 'country']}
                  />
                </Grid>

                <Grid item xs={12}>
                  <Location
                    label={'Domiciliu'}
                    location={homeAddress}
                    updateLocation={updateHomeAddress}
                  />
                </Grid>
              </Grid>

              <Grid item xs={12}>
                <OldNames />
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
            <Grid container spacing={2}>
              <IdDocuments suggestions={ID_DOCUMENT_TYPES} />
            </Grid>
          )}
          {step === 3 && (
            <Grid container spacing={2}>
              <Relationships personId={personId} />
            </Grid>
          )}
          {step === 4 && (
            <Grid container spacing={2}>
              <Education />
            </Grid>
          )}
          {step === 5 && (
            <Grid container spacing={2}>
              <FilesManager
                removeFiles={removeFiles}
                keepDeletedFiles={!!personId}
                files={files}
                updateFiles={setFiles}
                updateFile={updateFile}
                addFile={addFile}
              />
            </Grid>
          )}
          {step === 6 && (
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
      </Grid>

      <Grid item xs={12} justifyContent={'flex-end'} mt={4}>
        <Stack direction={'row'} justifyContent={'flex-end'} spacing={4}>
          <Button
            data-cy={'cancelForm'}
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
            data-cy={'submitForm'}
          >
            <FormattedMessage id={'save'} />
          </Button>
        </Stack>
      </Grid>
    </form>
  )
}
