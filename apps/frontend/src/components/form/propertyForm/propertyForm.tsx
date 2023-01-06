import { ApolloError } from '@apollo/client'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Grid from '@mui/material/Grid'
import Step from '@mui/material/Step'
import StepButton from '@mui/material/StepButton'
import Stepper from '@mui/material/Stepper'
import { PropertyAPIInput, VehicleInfo as VehicleInfoType } from 'defs'
import { FormikProps, withFormik } from 'formik'
import React, { useCallback, useState } from 'react'
import { FormattedMessage, useIntl } from 'react-intl'
import { useNavigate } from 'react-router-dom'
import { routes } from '../../../router/routes'
import { useDialog } from '../../dialog/dialogProvider'
import { AutocompleteField } from '../autocompleteField'
import { CustomInputFields } from '../customInputFields'
import { FilesManager } from '../fileField'
import { Images } from '../images'
import { InputField } from '../inputField'
import { PropertyOwners } from '../propertyOwners'
import { VehicleInfo } from '../vehicleInfo'
import { propertyFormValidation, validatePropertyForm } from './validation/validation'

type Props = {
  propertyId?: string
  propertyInfo?: PropertyAPIInput
  readonly: boolean
  onSubmit: (formData: PropertyAPIInput) => Promise<void> | void
  error?: ApolloError
}

const Form: React.FunctionComponent<Props & FormikProps<PropertyAPIInput>> = ({
  propertyId,
  readonly,
  setFieldError,
  setFieldValue,
  values,
  errors,
  isSubmitting,
  isValidating,
  submitForm,
}) => {
  const intl = useIntl()
  const dialog = useDialog()
  const navigate = useNavigate()
  const [step, setStep] = useState(0)

  const displayFormCancelDialog = useCallback(
    () =>
      dialog.openDialog({
        title: intl.formatMessage({
          id: "Are you sure you want to cancel the changes you've made?",
        }),
        description: intl.formatMessage({
          id: 'All unsaved changes will be lost',
        }),
        onConfirm: navigateFromPropertyFormPage,
      }),
    [dialog],
  )

  const navigateFromPropertyFormPage = useCallback(() => navigate(routes.properties), [navigate])

  return (
    <form data-cy={'propertyForm'}>
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
                <FormattedMessage id={'Additional Information'} />
              </StepButton>
            </Step>
            <Step completed={false}>
              <StepButton color={'inherit'} onClick={() => setStep(2)}>
                Proprietari
              </StepButton>
            </Step>
            <Step completed={false}>
              <StepButton color={'inherit'} onClick={() => setStep(3)}>
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
                    const error = await propertyFormValidation.files(images)
                    setFieldError('images', error)
                    setFieldValue('images', images)
                  }}
                  error={errors.images}
                />
              </Grid>
              <Grid container item xs={9} spacing={3}>
                <Grid item xs={6}>
                  <InputField
                    name={'name'}
                    label={'Nume'}
                    value={values.name}
                    error={errors.name}
                    onChange={async (value) => {
                      void setFieldValue('name', value)
                    }}
                  />
                </Grid>

                <Grid item xs={6}>
                  <AutocompleteField
                    label={'Tip de proprietate sau bun'}
                    suggestions={['Vehicul']}
                    value={values.type}
                    onValueChange={(value) => {
                      setFieldValue('type', value, false)

                      setFieldValue(
                        'vehicleInfo',
                        value === 'Vehicul' ? createVehicleInfo() : null,
                        false,
                      )
                    }}
                  />
                </Grid>
                {values.type === 'Vehicul' && (
                  <VehicleInfo
                    vehicleInfo={values.vehicleInfo ?? createVehicleInfo()}
                    updateVehicleInfo={(vehicleInfo) => setFieldValue('vehicleInfo', vehicleInfo)}
                    error={errors.vehicleInfo as string}
                  />
                )}
              </Grid>
            </Grid>
          )}
          {step === 1 && (
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <CustomInputFields
                  fields={values.customFields}
                  setFieldValue={async (customFields) => {
                    const error = await propertyFormValidation.customFields(customFields)

                    setFieldValue('customFields', customFields)
                    setFieldError('customFields', error)
                  }}
                  error={errors.customFields as string}
                />
              </Grid>
            </Grid>
          )}
          {step === 2 && (
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <PropertyOwners
                  isVehicle={!!values.vehicleInfo}
                  owners={values.owners}
                  updateOwners={async (owners) => {
                    // const error = await propertyFormValidation.owners(owners)
                    // setFieldError('owners', error)
                    setFieldValue('owners', owners)
                  }}
                />
              </Grid>
            </Grid>
          )}
          {step === 3 && (
            <Grid container spacing={2}>
              <FilesManager
                files={values.files}
                keepDeletedFiles={!!propertyId}
                updateFiles={async (uploadedFiles) => {
                  const error = await propertyFormValidation.files(uploadedFiles)
                  setFieldValue('files', uploadedFiles)
                  setFieldError('files', error)
                }}
              />
            </Grid>
          )}

          <Grid item xs={12} justifyContent={'flex-end'} mt={4}>
            <Box display={'flex'} justifyContent={'flex-end'}>
              <Button
                data-cy={'cancelForm'}
                color={'error'}
                disabled={isSubmitting || isValidating}
                variant={'text'}
                onClick={readonly ? navigateFromPropertyFormPage : () => displayFormCancelDialog()}
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
        </Grid>
      </Grid>
    </form>
  )
}

const propertyInitialValues: PropertyAPIInput = {
  name: '',
  type: '',
  images: [],
  owners: [],
  files: [],
  customFields: [],
  vehicleInfo: null,
}

export const PropertyForm = withFormik<Props, PropertyAPIInput>({
  mapPropsToValues: ({ propertyInfo }) => propertyInfo ?? propertyInitialValues,
  validate: async (values, { propertyId }) => validatePropertyForm(values, propertyId),
  validateOnChange: false,
  validateOnMount: false,
  validateOnBlur: false,
  handleSubmit: (values, { props: { onSubmit } }) => onSubmit(values),
})(Form)

function createVehicleInfo(): VehicleInfoType {
  return {
    vin: '',
    maker: '',
    model: '',
    color: '',
  }
}
