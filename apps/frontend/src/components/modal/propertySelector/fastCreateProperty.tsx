import React, { useEffect } from 'react'
import { PropertySelectorView } from './propertySelector'
import { useFormik } from 'formik'
import CardContent from '@mui/material/CardContent'
import Grid from '@mui/material/Grid'
import CardActions from '@mui/material/CardActions'
import Button from '@mui/material/Button'
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined'
import Box from '@mui/material/Box'
import { InputField } from '../../form/inputField'
import { createPropertyRequest } from '../../../graphql/properties/mutations/createProperty'
import {
  propertyFormValidation,
  validatePropertyForm,
} from '../../form/propertyForm/validation/validation'
import { PropertyAPIInput, VehicleInfo } from 'defs'
import { Images } from '../../form/images'
import { AutocompleteField } from '../../form/autocompleteField'
import { ColorPicker } from '../../form/colorPicker'
import { ModalHeader } from '../modalHeader'

type Props = {
  closeModal: () => void
  propertiesSelected?: (propertiesIds: string[]) => void
  changeView: (view: PropertySelectorView) => void
}

export const FastCreateProperty: React.FunctionComponent<Props> = ({
  closeModal,
  propertiesSelected,
  changeView,
}) => {
  const [createProperty, { data }] = createPropertyRequest()
  const { values, errors, setFieldError, setFieldValue, submitForm, isSubmitting } = useFormik({
    initialValues: propertyInitialValues,
    validateOnMount: false,
    validateOnBlur: false,
    validateOnChange: false,
    validate: (values) => validatePropertyForm(values),
    onSubmit: (data) => createProperty({ variables: { data } }),
  })

  useEffect(() => {
    if (data?.createProperty) {
      propertiesSelected?.([data.createProperty])
      closeModal()
    }
  }, [data?.createProperty])

  return (
    <>
      <ModalHeader title={'Creaza o proprietate rapid'} closeModal={closeModal} />
      <CardContent sx={{ height: 0.8, mb: 2 }}>
        <Grid container spacing={2}>
          <Grid item xs={3}>
            <Images
              readonly={false}
              images={values.images}
              updateImages={async (images) => {
                const error = await propertyFormValidation.files(images)
                setFieldError('images', error)
                void setFieldValue('images', images)
              }}
              error={errors.images}
            />
          </Grid>
          <Grid container item xs={9} spacing={3}>
            <Grid item xs={6}>
              <InputField
                name={'name'}
                label={'Nume'}
                readonly={false}
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
            {!!values.vehicleInfo && (
              <>
                <Grid item xs={6}>
                  <InputField
                    name={'vin'}
                    label={'VIN'}
                    readonly={false}
                    value={values.vehicleInfo?.vin}
                    error={errors.vehicleInfo}
                    onChange={async (value) => {
                      const error = await propertyFormValidation.vin(value)
                      setFieldError('vin', error)
                      void setFieldValue('vin', value)
                    }}
                  />
                </Grid>
                <Grid item xs={6}>
                  <AutocompleteField
                    readonly={false}
                    label={'Marca'}
                    value={values.vehicleInfo.maker}
                    error={errors.vehicleInfo}
                    onValueChange={async (value) => {
                      const error = await propertyFormValidation.maker(value)
                      setFieldError('maker', error)
                      void setFieldValue('maker', value)
                    }}
                  />
                </Grid>
                <Grid item xs={6}>
                  <AutocompleteField
                    label={'Model'}
                    readonly={false}
                    value={values.vehicleInfo.model}
                    error={errors.vehicleInfo}
                    onValueChange={async (value) => {
                      const error = await propertyFormValidation.model(value)
                      setFieldError('model', error)
                      void setFieldValue('model', value)
                    }}
                  />
                </Grid>
                <Grid item xs={6}>
                  <ColorPicker
                    name={'color'}
                    value={values.vehicleInfo?.color}
                    label={'Culoare'}
                    error={errors.vehicleInfo}
                    onChange={async (value) => {
                      const error = await propertyFormValidation.color(value)
                      setFieldError('color', error)
                      void setFieldValue('color', value)
                    }}
                  />
                </Grid>
              </>
            )}
          </Grid>
        </Grid>
      </CardContent>
      <CardActions sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Button
          variant={'contained'}
          color={'primary'}
          startIcon={<SearchOutlinedIcon />}
          onClick={() => changeView('search')}
        >
          Cauta vehicule
        </Button>

        <Box display={'flex'}>
          <Button variant={'outlined'} color={'error'} onClick={closeModal} sx={{ mr: 2 }}>
            Inchide
          </Button>
          <Button
            variant={'contained'}
            color={'primary'}
            disabled={isSubmitting}
            onClick={submitForm}
          >
            Salvează
          </Button>
        </Box>
      </CardActions>
    </>
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

function createVehicleInfo(): VehicleInfo {
  return {
    vin: '',
    maker: '',
    model: '',
    color: '',
  }
}
