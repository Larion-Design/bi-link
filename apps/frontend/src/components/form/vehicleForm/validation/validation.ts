import { FormikErrors } from 'formik'
import { vinExists } from '../../../../graphql/properties/queries/vehicles/vinExists'
import { VehicleInfo } from '../../../../types/property'

export const validateVehicleForm = async (vehicleInfo: VehicleInfo, propertyId?: string) => {
  const errors: FormikErrors<VehicleInfo> = {
    vin: await vehicleFormValidation.vin(vehicleInfo.vin, propertyId),
    maker: await vehicleFormValidation.maker(vehicleInfo.maker),
    model: await vehicleFormValidation.model(vehicleInfo.model),
    color: await vehicleFormValidation.color(vehicleInfo.color),
  }

  for (const fieldName in errors) {
    if (errors[fieldName]) {
      return errors
    }
  }
}

export const vehicleFormValidation = {
  vin: async (vin: string, propertyId?: string) => {
    if (vin.length) {
      return vinExists(vin, propertyId)
    }
  },
  maker: async (value: string) => {
    if (value.length) {
      if (value.length < 3) {
        return Promise.resolve('Numele mărcii este prea scurt.')
      }
    }
  },
  model: async (value: string) => {
    if (value.length) {
      if (value.length < 3) {
        return Promise.resolve('Denumirea modelului este prea scurt.')
      }
    }
  },
  color: async (value: string) => {
    if (value.length) {
      if (value.length < 2) {
        return Promise.resolve('Numele culorii este prea scurt.')
      }
    }
  },
}
