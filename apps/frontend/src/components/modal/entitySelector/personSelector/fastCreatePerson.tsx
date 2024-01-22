import React, { useEffect } from 'react'
import { PersonAPIInput } from 'defs'
import CardContent from '@mui/material/CardContent'
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined'
import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'
import Box from '@mui/material/Box'
import CardActions from '@mui/material/CardActions'
import { useFormik } from 'formik'
import { FormattedMessage } from 'react-intl'
import { getDefaultPerson } from 'default-values'
import { useSecondaryPersonState } from 'state/personState'
import { InputFieldWithMetadata } from '../../../form/inputField'
import { OldNames } from '../../../form/person/oldNames'
import { PersonSelectorView } from './personSelector'
import { createPersonRequest } from '@frontend/graphql/persons/mutations/createPerson'
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
  const [createPerson, { data, loading }] = createPersonRequest()
  const { firstName, lastName, cnp, updateFirstName, updateCnp, updateLastName } =
    useSecondaryPersonState()

  const { submitForm, setFieldValue, isSubmitting, isValidating } = useFormik<PersonAPIInput>({
    enableReinitialize: true,
    validateOnMount: false,
    validateOnBlur: false,
    validateOnChange: false,
    validate: (values) => ({}),
    onSubmit: (data) => createPerson({ variables: { data } }),
    initialValues: getDefaultPerson(),
  })

  useEffect(() => void setFieldValue('firstName', firstName), [firstName])
  useEffect(() => void setFieldValue('lastName', lastName), [lastName])
  useEffect(() => void setFieldValue('cnp', cnp), [cnp])

  useEffect(() => {
    if (!loading && data?.createPerson) {
      personsSelected?.([data.createPerson])
      closeModal()
    }
  }, [loading, data?.createPerson])

  return (
    <>
      <ModalHeader title={'Creaza o persoana rapid'} closeModal={closeModal} />
      <CardContent sx={{ height: 0.8, mb: 2 }}>
        <Grid container spacing={4}>
          <Grid item xs={4}>
            <InputFieldWithMetadata
              name={'lastName'}
              label={'Nume'}
              fieldInfo={lastName}
              updateFieldInfo={updateLastName}
            />
          </Grid>
          <Grid item xs={4}>
            <InputFieldWithMetadata
              name={'firstName'}
              label={'Prenume'}
              fieldInfo={firstName}
              updateFieldInfo={updateFirstName}
            />
          </Grid>
          <Grid item xs={4}>
            <InputFieldWithMetadata
              name={'cnp'}
              label={'Cod numeric personal'}
              fieldInfo={cnp}
              updateFieldInfo={updateCnp}
            />
          </Grid>
          <Grid item xs={12}>
            <OldNames />
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
            <FormattedMessage id={'close'} />
          </Button>
          <Button
            variant={'contained'}
            color={'primary'}
            disabled={loading || isSubmitting || isValidating}
            onClick={() => void submitForm()}
          >
            <FormattedMessage id={'save'} />
          </Button>
        </Box>
      </CardActions>
    </>
  )
}
