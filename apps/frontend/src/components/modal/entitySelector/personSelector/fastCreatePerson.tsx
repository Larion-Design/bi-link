import React, { useEffect } from 'react'
import CardContent from '@mui/material/CardContent'
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined'
import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'
import Box from '@mui/material/Box'
import CardActions from '@mui/material/CardActions'
import { useFormik } from 'formik'
import { PersonAPIInput } from 'defs'
import { InputField } from '../../../form/inputField'
import { defaultLocation } from '../../../form/location'
import { OldNames } from '../../../form/oldNames'
import {
  personFormValidation,
  validatePersonForm,
} from '../../../form/personForm/validation/validation'
import { PersonSelectorView } from './personSelector'
import { createPersonRequest } from '../../../../graphql/persons/mutations/createPerson'
import { ModalHeader } from '../../modalHeader'

type Props = {
  closeModal: () => void
  personsSelected?: (personsIds: string[]) => void
  changeView: (view: PersonSelectorView) => void
}

export const FastCreatePerson: React.FunctionComponent<Props> = ({
  closeModal,
  personsSelected,
  changeView,
}) => {
  const [createPerson, { data }] = createPersonRequest()
  const { values, errors, setFieldError, setFieldValue, submitForm, isSubmitting } = useFormik({
    initialValues: personInitialFields,
    validateOnMount: false,
    validateOnBlur: false,
    validateOnChange: false,
    validate: (values) => validatePersonForm(values),
    onSubmit: (data) => createPerson({ variables: { data } }),
  })

  useEffect(() => {
    if (data?.createPerson) {
      personsSelected?.([data.createPerson])
      closeModal()
    }
  }, [data?.createPerson])

  return (
    <>
      <ModalHeader title={'Creaza o persoana rapid'} closeModal={closeModal} />
      <CardContent sx={{ height: 0.8, mb: 2 }}>
        <Grid container spacing={4}>
          <Grid item xs={4}>
            <InputField
              label={'Nume'}
              value={values.lastName}
              error={errors.lastName}
              onChange={async (value) => {
                const error = await personFormValidation.lastName(value)
                setFieldError('lastName', error)
                await setFieldValue('lastName', value)
              }}
            />
          </Grid>
          <Grid item xs={4}>
            <InputField
              label={'Prenume'}
              value={values.firstName}
              error={errors.firstName}
              onChange={async (value) => {
                const error = await personFormValidation.firstName(value)
                setFieldError('firstName', error)
                await setFieldValue('firstName', value)
              }}
            />
          </Grid>
          <Grid item xs={4}>
            <OldNames
              oldNames={values.oldNames}
              updateOldNames={async (value) => {
                await setFieldValue('oldName', value)
              }}
            />
          </Grid>
          <Grid item xs={4}>
            <InputField
              label={'CNP'}
              value={values.cnp}
              error={errors.cnp}
              onChange={async (value) => {
                const error = await personFormValidation.cnp(value)
                setFieldError('cnp', error)
                await setFieldValue('cnp', value)
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
          Cauta persoane
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
