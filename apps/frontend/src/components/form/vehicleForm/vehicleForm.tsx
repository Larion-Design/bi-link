import React, { useState } from 'react'
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
import { validateVehicleForm, vehicleFormValidation } from './validation/validation'
import { VehicleAPIInput } from '../../../types/vehicle'
import { ImageField } from '../imageField'
import { Owners } from '../owners'
import { getVehicleFrequentCustomFieldsRequest } from '../../../graphql/vehicles/queries/getVehicleFrequentCustomFields'

type Props = {
  vehicleId?: string
  vehicleInfo?: VehicleAPIInput
  readonly: boolean
  onSubmit: (formData: VehicleAPIInput) => void
  error?: ApolloError
}

const Form: React.FunctionComponent<Props & FormikProps<VehicleAPIInput>> = ({
  vehicleId,
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
  const { data: frequentFields } = getVehicleFrequentCustomFieldsRequest()
  const [step, setStep] = useState(0)

  const displayFormCancelDialog = () =>
    dialog.openDialog({
      title: 'Esti sigur(a) ca vrei sa anulezi modificarile?',
      description: 'Toate modificarile nesalvate vor fi pierdute.',
      onConfirm: navigateFromVehicleFormPage,
    })

  const navigateFromVehicleFormPage = () => navigate(routes.vehicles)

  return (
    <form data-cy={'vehicleForm'}>
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
                <ImageField
                  readonly={readonly}
                  fileInfo={values.image}
                  updateImage={async (fileInfo) => {
                    const error = await vehicleFormValidation.image(fileInfo)
                    setFieldError('image', error)
                    setFieldValue('image', fileInfo)
                  }}
                  error={errors.image}
                />
              </Grid>
              <Grid container item xs={9} spacing={3}>
                <Grid item xs={6}>
                  <InputField
                    name={'vin'}
                    label={'VIN'}
                    readonly={readonly}
                    value={values.vin}
                    error={errors.vin}
                    onChange={async (value) => {
                      const error = await vehicleFormValidation.vin(
                        value,
                        vehicleId,
                      )
                      setFieldError('vin', error)
                      setFieldValue('vin', value)
                    }}
                  />
                </Grid>
                <Grid item xs={6}>
                  <InputField
                    name={'maker'}
                    label={'Marca'}
                    readonly={readonly}
                    value={values.maker}
                    error={errors.maker}
                    onChange={async (value) => {
                      const error = await vehicleFormValidation.maker(value)
                      setFieldError('maker', error)
                      setFieldValue('maker', value)
                    }}
                  />
                </Grid>
                <Grid item xs={6}>
                  <InputField
                    name={'model'}
                    label={'Model'}
                    readonly={readonly}
                    value={values.model}
                    error={errors.model}
                    onChange={async (value) => {
                      const error = await vehicleFormValidation.model(value)
                      setFieldError('model', error)
                      setFieldValue('model', value)
                    }}
                  />
                </Grid>
                <Grid item xs={6}>
                  <InputField
                    name={'color'}
                    label={'Culoare'}
                    readonly={readonly}
                    value={values.color}
                    error={errors.color}
                    onChange={async (value) => {
                      const error = await vehicleFormValidation.color(value)
                      setFieldError('color', error)
                      setFieldValue('color', value)
                    }}
                  />
                </Grid>
              </Grid>
            </Grid>
          )}
          {step === 1 && (
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <CustomInputFields
                  readonly={readonly}
                  fields={values.customFields}
                  suggestions={frequentFields?.getVehicleFrequentCustomFields}
                  setFieldValue={async (customFields) => {
                    const error = await vehicleFormValidation.customFields(
                      customFields,
                    )

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
                <Owners
                  owners={values.owners}
                  updateOwners={async (owners) => {
                    const error = await vehicleFormValidation.owners(owners)
                    setFieldError('owners', error)
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
                keepDeletedFiles={!!vehicleId}
                updateFiles={async (uploadedFiles) => {
                  const error = await vehicleFormValidation.files(uploadedFiles)
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
                onClick={
                  readonly
                    ? navigateFromVehicleFormPage
                    : () => displayFormCancelDialog()
                }
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
      </Grid>
    </form>
  )
}

const vehicleInitialValues: VehicleAPIInput = {
  vin: '',
  maker: '',
  model: '',
  color: '',
  image: null,
  owners: [],
  files: [],
  customFields: [],
}

export const VehicleForm = withFormik<Props, VehicleAPIInput>({
  mapPropsToValues: ({ vehicleInfo }) => vehicleInfo ?? vehicleInitialValues,
  validate: async (values, { vehicleId }) =>
    validateVehicleForm(values, vehicleId),
  validateOnChange: false,
  validateOnMount: false,
  validateOnBlur: false,
  handleSubmit: (values, { props: { onSubmit } }) => onSubmit(values),
})(Form)
