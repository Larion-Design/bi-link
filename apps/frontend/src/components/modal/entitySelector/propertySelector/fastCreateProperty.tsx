import {
  propertyTypes,
  realEstatePropertyTypes,
} from '@frontend/components/form/property/propertyForm/constants'
import { RealEstateInfo } from '@frontend/components/form/property/realEstateInfo'
import { VehicleInfo } from '@frontend/components/form/property/vehicleInfo'
import { PropertyAPIInput } from 'defs'
import React, { useEffect } from 'react'
import { getDefaultProperty } from 'tools'
import { usePropertyState } from '../../../../state/property/propertyState'
import { PropertySelectorView } from './propertySelector'
import { useFormik } from 'formik'
import CardContent from '@mui/material/CardContent'
import Grid from '@mui/material/Grid'
import CardActions from '@mui/material/CardActions'
import Button from '@mui/material/Button'
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined'
import Box from '@mui/material/Box'
import { InputField } from '../../../form/inputField'
import { createPropertyRequest } from '@frontend/graphql/properties/mutations/createProperty'
import { validatePropertyForm } from '../../../form/property/propertyForm/validation/validation'
import { Images } from '../../../form/images'
import { AutocompleteField } from '../../../form/autocompleteField'
import { ModalHeader } from '../../modalHeader'

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
  const {
    name,
    type,
    images,
    vehicleInfo,
    realEstateInfo,
    setImages,
    addImage,
    updateName,
    updateType,
    updateImage,
    disableRealEstateInfo,
    enableRealEstateInfo,
    enableVehicleInfo,
    disableVehicleInfo,
    removeImages,
  } = usePropertyState()

  const { submitForm, isSubmitting, isValidating, setFieldValue } = useFormik<PropertyAPIInput>({
    initialValues: getDefaultProperty(),
    validate: async (values) => validatePropertyForm(values),
    validateOnChange: false,
    validateOnMount: false,
    validateOnBlur: false,
    enableReinitialize: true,
    onSubmit: (data) => createProperty({ variables: { data } }),
  })

  useEffect(() => {
    if (data?.createProperty) {
      propertiesSelected?.([data.createProperty])
      closeModal()
    }
  }, [data?.createProperty])

  useEffect(() => void setFieldValue('name', name), [name])
  useEffect(() => void setFieldValue('type', type), [type])
  useEffect(() => void setFieldValue('vehicleInfo', vehicleInfo), [vehicleInfo])
  useEffect(() => void setFieldValue('realEstateInfo', realEstateInfo), [realEstateInfo])
  useEffect(() => void setFieldValue('images', Array.from(images)), [images])

  const renderPropertyFieldsByType = () => {
    if (type === 'Vehicul') {
      return <VehicleInfo />
    } else if (realEstatePropertyTypes.includes(type)) {
      return <RealEstateInfo />
    }
    return null
  }

  return (
    <>
      <ModalHeader title={'Creaza o proprietate rapid'} closeModal={closeModal} />
      <CardContent sx={{ height: 0.8, mb: 2 }}>
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
            onClick={() => void submitForm()}
          >
            Salvează
          </Button>
        </Box>
      </CardActions>
    </>
  )
}
