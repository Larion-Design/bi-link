import React, { useEffect, useState } from 'react'
import { FormikProps, withFormik } from 'formik'
import { FormattedMessage } from 'react-intl'
import { useCancelDialog } from '@frontend/utils/hooks/useCancelDialog'
import { Education } from '@frontend/components/form/person/education'
import { Location } from '@frontend/components/form/location'
import { OldNames } from '@frontend/components/form/person/oldNames'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Grid from '@mui/material/Grid'
import Step from '@mui/material/Step'
import StepButton from '@mui/material/StepButton'
import Stepper from '@mui/material/Stepper'
import { IdDocument, PersonAPIInput } from 'defs'
import { getDefaultLocation, getDefaultPerson } from 'tools'
import { routes } from '../../../../router/routes'
import { CONTACT_METHODS, ID_DOCUMENT_TYPES } from '@frontend/utils/constants'
import { CustomInputFields } from '../../customInputFields'
import { DatePicker } from '../../datePicker'
import { FilesManager } from '../../fileField'
import { IdDocuments } from '../idDocuments'
import { Images } from '../../images'
import { InputField } from '../../inputField'
import { Relationships } from '../relationships'
import { getBirthdateFromCnp } from './utils'
import { personFormValidation, validatePersonForm } from './validation/validation'

type Props = {
  personId?: string
  personInfo?: PersonAPIInput
  readonly?: boolean
  onSubmit: (formData: PersonAPIInput) => void | Promise<void>
}

const Form: React.FunctionComponent<Props & FormikProps<PersonAPIInput>> = ({
  personId,
  setFieldError,
  setFieldValue,
  values,
  errors,
  isSubmitting,
  isValidating,
  submitForm,
}) => {
  const [step, setStep] = useState(0)
  const cancelChanges = useCancelDialog(routes.persons)

  useEffect(() => {
    if (!values.birthdate && values.cnp.value.length) {
      const parsedBirthdate = getBirthdateFromCnp(values.cnp.value)

      if (parsedBirthdate) {
        setFieldValue('birthdate', parsedBirthdate)
      }
    }
  }, [values.cnp.value])

  const updateBirthdate = async (value: string | null) => {
    const error = await personFormValidation.birthdate(value)
    setFieldValue('birthdate', value?.toString?.() ?? null)
    setFieldError('birthdate', error)
  }

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
                  images={values.images}
                  updateImages={async (images) => {
                    const error = await personFormValidation.files(images)
                    setFieldError('images', error)
                    setFieldValue('images', images)
                  }}
                  error={errors.images}
                />
              </Grid>
              <Grid container item xs={9} spacing={3}>
                <Grid item xs={4}>
                  <InputField
                    name={'lastName'}
                    label={'Nume'}
                    value={values.lastName.value}
                    error={errors.lastName?.value}
                    onChange={async (value) => {
                      // const error = await personFormValidation.lastName(value)
                      // setFieldError('lastName', error)
                      setFieldValue('lastName', { ...values.lastName, value })
                    }}
                  />
                </Grid>

                <Grid item xs={4}>
                  <InputField
                    name={'firstName'}
                    label={'Prenume'}
                    value={values.firstName.value}
                    error={errors.firstName?.value}
                    onChange={async (value) => {
                      //const error = await personFormValidation.firstName(value)
                      //setFieldError('firstName', error)
                      setFieldValue('firstName', { ...values.firstName, value })
                    }}
                  />
                </Grid>

                <Grid item xs={4}>
                  <InputField
                    name={'cnp'}
                    label={'Cod numeric personal'}
                    value={values.cnp.value}
                    error={errors.cnp?.value}
                    onChange={async (value) => {
                      //const error = await personFormValidation.cnp(value, personId)
                      //setFieldError('cnp', error)
                      setFieldValue('cnp', { ...values.cnp, value })
                    }}
                  />
                </Grid>

                <Grid item xs={4}>
                  <DatePicker
                    label={'Data nasterii'}
                    value={values.birthdate.value}
                    onChange={updateBirthdate}
                    disableFuture
                    disableHighlightToday
                    error={errors.birthdate?.value}
                  />
                </Grid>

                <Grid item xs={12} sx={{ mt: 2 }}>
                  <Location
                    label={'Locul nasterii'}
                    location={values.birthPlace ?? getDefaultLocation()}
                    updateLocation={(location) => {
                      setFieldValue('birthPlace', location)
                    }}
                    includeFields={['locality', 'country']}
                  />
                </Grid>

                <Grid item xs={12}>
                  <Location
                    label={'Domiciliu'}
                    location={values.homeAddress ?? getDefaultLocation()}
                    updateLocation={(location) => {
                      setFieldValue('homeAddress', location)
                    }}
                  />
                </Grid>
              </Grid>

              <Grid item xs={12}>
                <OldNames
                  oldNames={values.oldNames}
                  updateOldNames={async (oldNames) => {
                    setFieldValue('oldName', oldNames)
                  }}
                />
              </Grid>
            </Grid>
          )}
          {step === 1 && (
            <Grid container spacing={2}>
              <CustomInputFields
                suggestions={CONTACT_METHODS}
                fields={values.contactDetails}
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
            <Grid container spacing={2}>
              <IdDocuments
                suggestions={ID_DOCUMENT_TYPES}
                documents={values.documents}
                setFieldValue={async (documents: IdDocument[]) => {
                  const error = await personFormValidation.documents(documents, personId)
                  setFieldValue('documents', documents)
                  setFieldError('documents', error)
                }}
                error={errors.documents as string}
              />
            </Grid>
          )}
          {step === 3 && (
            <Grid container spacing={2}>
              <Relationships
                updateRelationships={async (relationships) => {
                  const error = await personFormValidation.relationships(relationships)

                  setFieldValue('relationships', relationships)
                  setFieldError('relationships', error)
                }}
                relationships={values.relationships}
              />
            </Grid>
          )}
          {step === 4 && (
            <Grid container spacing={2}>
              <Education
                education={values.education}
                updateEducation={async (education) => {
                  setFieldValue('education', education)
                }}
              />
            </Grid>
          )}
          {step === 5 && (
            <Grid container spacing={2}>
              <FilesManager
                keepDeletedFiles={!!personId}
                files={values.files}
                updateFiles={async (uploadedFiles) => {
                  const error = await personFormValidation.files(uploadedFiles)
                  setFieldValue('files', uploadedFiles)
                  setFieldError('files', error)
                }}
              />
            </Grid>
          )}
          {step === 6 && (
            <Grid container spacing={2}>
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
        </Grid>
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

export const PersonForm = withFormik<Props, PersonAPIInput>({
  mapPropsToValues: ({ personInfo }) => personInfo ?? getDefaultPerson(),
  validate: async (values, { personId }) => validatePersonForm(values, personId),
  validateOnChange: false,
  validateOnMount: false,
  validateOnBlur: false,
  enableReinitialize: true,
  handleSubmit: (values, { props: { onSubmit } }) => void onSubmit(values),
})(Form)
