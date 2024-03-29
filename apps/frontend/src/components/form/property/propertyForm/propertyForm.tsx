import React, { useEffect, useState } from 'react'
import { propertyTypes, realEstatePropertyTypes } from './constants'
import { RealEstateInfo } from '../realEstateInfo'
import { useCancelDialog } from '@frontend/utils/hooks/useCancelDialog'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Grid from '@mui/material/Grid'
import Step from '@mui/material/Step'
import StepButton from '@mui/material/StepButton'
import Stepper from '@mui/material/Stepper'
import { PropertyAPIInput } from 'defs'
import { useFormik } from 'formik'
import { FormattedMessage } from 'react-intl'
import { routes } from '../../../../router/routes'
import { usePropertyState } from '../../../../state/property/propertyState'
import { AutocompleteField } from '../../autocompleteField'
import { CustomInputFields } from '../../customInputFields'
import { FilesManager } from '../../fileField'
import { Images } from '../../images'
import { InputField } from '../../inputField'
import { PropertyOwners } from '../propertyOwners'
import { VehicleInfo } from '../vehicleInfo'
import { validatePropertyForm } from './validation/validation'

type Props<T = PropertyAPIInput> = {
  propertyId?: string
  onSubmit: (formData: T) => void
}

export const PropertyForm: React.FunctionComponent<Props> = ({ propertyId, onSubmit }) => {
  const [step, setStep] = useState(0)
  const cancelChanges = useCancelDialog(routes.properties)
  const {
    metadata,
    name,
    type,
    images,
    files,
    owners,
    ownersCustomFields,
    customFields,
    vehicleInfo,
    realEstateInfo,

    getProperty,
    getOwners,
    getCustomFields,
    getImages,
    getFiles,

    setFiles,
    setImages,
    addCustomField,
    addImage,
    addFile,

    updateName,
    updateType,
    updateImage,
    updateFile,
    updateCustomField,
    disableRealEstateInfo,
    enableRealEstateInfo,
    enableVehicleInfo,
    disableVehicleInfo,
    removeImages,
    removeFiles,
    removeCustomFields,
  } = usePropertyState()

  const { submitForm, isSubmitting, isValidating, setFieldValue } = useFormik<PropertyAPIInput>({
    initialValues: getProperty(),
    validate: async (values) => validatePropertyForm(values, propertyId),
    validateOnChange: false,
    validateOnMount: false,
    validateOnBlur: false,
    enableReinitialize: true,
    onSubmit,
  })

  useEffect(() => void setFieldValue('metadata', metadata), [metadata])
  useEffect(() => void setFieldValue('type', type), [type])
  useEffect(() => void setFieldValue('name', name), [name])
  useEffect(() => void setFieldValue('vehicleInfo', vehicleInfo), [vehicleInfo])
  useEffect(() => void setFieldValue('realEstateInfo', realEstateInfo), [realEstateInfo])
  useEffect(() => void setFieldValue('files', getFiles()), [files])
  useEffect(() => void setFieldValue('images', getImages()), [images])
  useEffect(() => void setFieldValue('customFields', getCustomFields()), [customFields])
  useEffect(() => void setFieldValue('owners', getOwners()), [owners, ownersCustomFields])

  const renderPropertyFieldsByType = () => {
    if (type === 'Vehicul') {
      return <VehicleInfo />
    } else if (realEstatePropertyTypes.includes(type)) {
      return <RealEstateInfo />
    }
    return null
  }

  return (
    <form data-testid={'propertyForm'}>
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
                Proprietari
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
        <Grid item xs={12}>
          {step === 0 && (
            <Grid container spacing={2}>
              <Grid item xs={3}>
                <Images
                  images={images}
                  updateImage={updateImage}
                  removeImages={removeImages}
                  addImage={addImage}
                  setImages={setImages}
                />
              </Grid>
              <Grid container item xs={9} spacing={3}>
                <Grid item xs={6}>
                  <InputField name={'name'} label={'Nume'} value={name} onChange={updateName} />
                </Grid>

                <Grid item xs={6}>
                  <AutocompleteField
                    label={'Tip de bun / proprietate'}
                    suggestions={propertyTypes}
                    value={type}
                    onChange={(type) => {
                      updateType(type)
                      if (type === 'Vehicul') {
                        enableVehicleInfo()
                        disableRealEstateInfo()
                      } else if (realEstatePropertyTypes.includes(type)) {
                        disableVehicleInfo()
                        enableRealEstateInfo()
                      }
                    }}
                  />
                </Grid>
                {renderPropertyFieldsByType()}
              </Grid>
            </Grid>
          )}
          {step === 1 && (
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <CustomInputFields
                  customFields={customFields}
                  updateCustomField={updateCustomField}
                  addCustomField={addCustomField}
                  removeCustomFields={removeCustomFields}
                />
              </Grid>
            </Grid>
          )}
          {step === 2 && (
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <PropertyOwners />
              </Grid>
            </Grid>
          )}
          {step === 3 && (
            <Grid container spacing={2}>
              <FilesManager
                removeFiles={removeFiles}
                keepDeletedFiles={!!propertyId}
                files={files}
                updateFiles={setFiles}
                updateFile={updateFile}
                addFile={addFile}
              />
            </Grid>
          )}

          <Grid item xs={12} justifyContent={'flex-end'} mt={4}>
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
      </Grid>
    </form>
  )
}
