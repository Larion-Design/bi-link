import React, { useEffect } from 'react'
import { VehicleSelectorView } from './vehicleSelector'
import { useFormik } from 'formik'
import CardHeader from '@mui/material/CardHeader'
import IconButton from '@mui/material/IconButton'
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined'
import CardContent from '@mui/material/CardContent'
import Grid from '@mui/material/Grid'
import CardActions from '@mui/material/CardActions'
import Button from '@mui/material/Button'
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined'
import Box from '@mui/material/Box'
import { InputField } from '../../form/inputField'
import { createVehicleRequest } from '../../../graphql/vehicles/mutations/createVehicle'
import { VehicleAPIInput } from '../../../types/vehicle'
import {
  validateVehicleForm,
  vehicleFormValidation,
} from '../../form/vehicleForm/validation/validation'

type Props = {
  closeModal: () => void
  vehiclesSelected?: (vehiclesIds: string[]) => void
  changeView: (view: VehicleSelectorView) => void
}

export const FastCreateVehicle: React.FunctionComponent<Props> = ({
  closeModal,
  vehiclesSelected,
  changeView,
}) => {
  const [createVehicle, { data }] = createVehicleRequest()
  const {
    values,
    errors,
    setFieldError,
    setFieldValue,
    submitForm,
    isSubmitting,
  } = useFormik({
    initialValues: vehicleInitialValues,
    validateOnMount: false,
    validateOnBlur: false,
    validateOnChange: false,
    validate: (values) => validateVehicleForm(values),
    onSubmit: (data) => createVehicle({ variables: { data } }),
  })

  useEffect(() => {
    if (data?.createVehicle) {
      vehiclesSelected?.([data.createVehicle])
      closeModal()
    }
  }, [data?.createVehicle])

  return (
    <>
      <CardHeader
        title={'Creaza un vehicul rapid'}
        action={
          <IconButton title={'Inchide'} onClick={closeModal}>
            <CloseOutlinedIcon color={'error'} />
          </IconButton>
        }
      />
      <CardContent sx={{ height: 0.8, mb: 2 }}>
        <Grid container spacing={4}>
          <Grid item xs={4}>
            <InputField
              name={'vin'}
              label={'VIN'}
              readonly={false}
              value={values.vin}
              error={errors.vin}
              onChange={async (value) => {
                const error = await vehicleFormValidation.vin(value)
                setFieldError('vin', error)
                await setFieldValue('vin', value)
              }}
            />
          </Grid>
          <Grid item xs={4}>
            <InputField
              name={'maker'}
              label={'Marca'}
              readonly={false}
              value={values.maker}
              error={errors.maker}
              onChange={async (value) => {
                const error = await vehicleFormValidation.maker(value)
                setFieldError('maker', error)
                await setFieldValue('maker', value)
              }}
            />
          </Grid>
          <Grid item xs={4}>
            <InputField
              name={'model'}
              label={'Model'}
              readonly={false}
              value={values.model}
              error={errors.model}
              onChange={async (value) => {
                const error = await vehicleFormValidation.model(value)
                setFieldError('model', error)
                await setFieldValue('model', value)
              }}
            />
          </Grid>
          <Grid item xs={4}>
            <InputField
              name={'color'}
              label={'Culoare'}
              readonly={false}
              value={values.color}
              error={errors.color}
              onChange={async (value) => {
                const error = await vehicleFormValidation.color(value)
                setFieldError('color', error)
                await setFieldValue('color', value)
              }}
            />
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
          <Button
            variant={'outlined'}
            color={'error'}
            onClick={closeModal}
            sx={{ mr: 2 }}
          >
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
