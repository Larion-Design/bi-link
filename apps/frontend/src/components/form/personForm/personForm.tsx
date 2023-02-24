import { defaultLocation, Location } from '@frontend/components/form/location'
import { OldNames } from '@frontend/components/form/oldNames'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Grid from '@mui/material/Grid'
import Step from '@mui/material/Step'
import StepButton from '@mui/material/StepButton'
import Stepper from '@mui/material/Stepper'
import { IdDocument, PersonAPIInput } from 'defs'
import { FormikProps, withFormik } from 'formik'
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getPersonFrequentCustomFieldsRequest } from '../../../graphql/persons/queries/getPersonFrequentCustomFields'
import { routes } from '../../../router/routes'
import { CONTACT_METHODS, ID_DOCUMENT_TYPES } from '../../../utils/constants'
import { useDialog } from '../../dialog/dialogProvider'
import { CustomInputFields } from '../customInputFields'
import { DatePicker } from '../datePicker'
import { FilesManager } from '../fileField'
import { IdDocuments } from '../idDocuments'
import { Images } from '../images'
import { InputField } from '../inputField'
import { Relationships } from '../relationships'
import { getBirthdateFromCnp } from './utils'
import { personFormValidation, validatePersonForm } from './validation/validation'

type Props = {
  personId?: string
  personInfo?: PersonAPIInput
  readonly: boolean
  onSubmit: (formData: PersonAPIInput) => void | Promise<void>
}

const Form: React.FunctionComponent<Props & FormikProps<PersonAPIInput>> = ({
  personId,
  readonly,
  setFieldError,
  setFieldValue,
  values,
  errors,
  isSubmitting,
  isValidating,
  submitForm,
}) => {
  const dialog = useDialog()
  const navigate = useNavigate()
  const { data: frequentFields } = getPersonFrequentCustomFieldsRequest()
  const [step, setStep] = useState(0)

  useEffect(() => {
    if (!values.birthdate && values.cnp.length) {
      const parsedBirthdate = getBirthdateFromCnp(values.cnp)

      if (parsedBirthdate) {
        setFieldValue('birthdate', parsedBirthdate)
      }
    }
  }, [values.cnp])

  const navigateFromPersonFormPage = () => navigate(routes.persons)

  const updateBirthdate = async (value: string | null) => {
    const error = await personFormValidation.birthdate(value)
    setFieldValue('birthdate', value?.toString?.() ?? null)
    setFieldError('birthdate', error)
  }

  const openDialog = () =>
    dialog.openDialog({
      title: 'Esti sigur(a) ca vrei sa anulezi modificarile pe care le-ai facut?',
      description: 'Toate modificarile nesalvate vor fi pierdute.',
      onConfirm: navigateFromPersonFormPage,
    })

  return (
    <form data-cy={'personsForm'}>
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
                Date contact
              </StepButton>
            </Step>
            <Step completed={false}>
              <StepButton color={'inherit'} onClick={() => setStep(3)}>
                Documente identitate
              </StepButton>
            </Step>
            <Step completed={false}>
              <StepButton color={'inherit'} onClick={() => setStep(4)}>
                Relatii cu persoane
              </StepButton>
            </Step>
            <Step completed={false}>
              <StepButton color={'inherit'} onClick={() => setStep(5)}>
                Fisiere
              </StepButton>
            </Step>
          </Stepper>
        </Grid>
        <Grid item xs={12}>
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
                    value={values.lastName}
                    error={errors.lastName}
                    onChange={async (value) => {
                      const error = await personFormValidation.lastName(value)
                      setFieldValue('lastName', value)
                      setFieldError('lastName', error)
                    }}
                  />
                </Grid>

                <Grid item xs={4}>
                  <InputField
                    name={'firstName'}
                    label={'Prenume'}
                    value={values.firstName}
                    error={errors.firstName}
                    onChange={async (value) => {
                      const error = await personFormValidation.firstName(value)
                      setFieldValue('firstName', value)
                      setFieldError('firstName', error)
                    }}
                  />
                </Grid>

                <Grid item xs={4}>
                  <InputField
                    name={'cnp'}
                    label={'Cod numeric personal'}
                    value={values.cnp}
                    error={errors.cnp}
                    onChange={async (value) => {
                      const error = await personFormValidation.cnp(value, personId)
                      setFieldValue('cnp', value)
                      setFieldError('cnp', error)
                    }}
                  />
                </Grid>

                <Grid item xs={4}>
                  <DatePicker
                    label={'Data nasterii'}
                    value={values.birthdate}
                    onChange={updateBirthdate}
                    disableFuture
                    disableHighlightToday
                    error={errors.birthdate}
                  />
                </Grid>

                <Grid item xs={4}>
                  <Location
                    label={'Locul nasterii'}
                    location={values.birthPlace}
                    updateLocation={(location) => {
                      setFieldValue('birthPlace', location)
                    }}
                  />
                </Grid>

                <Grid item xs={8}>
                  <Location
                    label={'Domiciliu'}
                    location={values.homeAddress}
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
                fields={values.customFields}
                suggestions={frequentFields?.getPersonFrequentCustomFields}
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
          {step === 3 && (
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
          {step === 4 && (
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
        </Grid>
      </Grid>

      <Grid item xs={12} justifyContent={'flex-end'} mt={4}>
        <Box display={'flex'} justifyContent={'flex-end'}>
          <Button
            data-cy={'cancelForm'}
            color={'error'}
            disabled={isSubmitting}
            variant={'text'}
            onClick={readonly ? navigateFromPersonFormPage : openDialog}
            sx={{ mr: 4 }}
          >
            Anulează
          </Button>
          <Button
            disabled={isSubmitting || isValidating}
            variant={'contained'}
            onClick={() => void submitForm()}
            data-cy={'submitForm'}
          >
            Salvează
          </Button>
        </Box>
      </Grid>
    </form>
  )
}

const personInitialFields: PersonAPIInput = {
  firstName: '',
  lastName: '',
  oldNames: [],
  cnp: '',
  birthdate: null,
  birthPlace: defaultLocation,
  homeAddress: defaultLocation,
  customFields: [],
  contactDetails: [],
  images: [],
  documents: [],
  files: [],
  relationships: [],
  education: [],
}

export const PersonForm = withFormik<Props, PersonAPIInput>({
  mapPropsToValues: ({ personInfo }) => personInfo ?? personInitialFields,
  validate: async (values, { personId }) => validatePersonForm(values, personId),
  validateOnChange: false,
  validateOnMount: false,
  validateOnBlur: false,
  handleSubmit: (values, { props: { onSubmit } }) => void onSubmit(values),
})(Form)
