import React from 'react'
import { toFormikValidationSchema } from 'zod-formik-adapter'
import AssignmentIndOutlinedIcon from '@mui/icons-material/AssignmentIndOutlined'
import Avatar from '@mui/material/Avatar'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import { useFormik } from 'formik'
import { InputField } from '../inputField'
import { InputPassword } from '../inputPassword'
import { SignupInfo, signupValidationSchema } from './validation'

type Props = {
  error?: string
  disabled?: boolean
  onSubmit: (signupInfo: SignupInfo) => Promise<void>
}

export const SignupForm: React.FunctionComponent<Props> = ({ error, disabled, onSubmit }) => {
  const { values, errors, isSubmitting, isValidating, setSubmitting, setFieldValue, submitForm } =
    useFormik<SignupInfo>({
      initialValues: {
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
      },
      onSubmit,
      enableReinitialize: true,
      validateOnChange: false,
      validateOnMount: false,
      validateOnBlur: false,
      validate: (values) => toFormikValidationSchema(signupValidationSchema).validate(values),
    })

  if (error) {
    setSubmitting(false)
  }
  const isDisabled = disabled || isValidating || isSubmitting

  return (
    <Box mt={8} display={'flex'} flexDirection={'column'} alignItems={'center'}>
      <Avatar sx={{ width: 70, height: 70, m: 2, bgcolor: 'primary.main' }}>
        <AssignmentIndOutlinedIcon fontSize={'large'} />
      </Avatar>
      <Typography variant={'h5'} gutterBottom>
        Autentificare
      </Typography>

      <form onSubmit={() => void submitForm()}>
        <Box sx={{ mt: 2, width: 1 }}>
          <InputField
            required
            name={'name'}
            label={'Nume'}
            value={values.name}
            onChange={(value) => void setFieldValue('name', value)}
            error={errors?.name}
            disabled={isDisabled}
          />
        </Box>

        <Box sx={{ mt: 2, width: 1 }}>
          <InputField
            required
            name={'email'}
            label={'Email'}
            value={values.email}
            onChange={(value) => void setFieldValue('email', value)}
            error={errors?.email}
            disabled={isDisabled}
          />
        </Box>

        <Box sx={{ mt: 4, width: 1 }}>
          <InputPassword
            label={'Parola'}
            onChange={(value) => void setFieldValue('password', value)}
            error={errors?.password}
            disabled={isDisabled}
          />
        </Box>

        <Box sx={{ mt: 4, width: 1 }}>
          <InputPassword
            label={'Confirma parola'}
            onChange={(value) => void setFieldValue('confirmPassword', value)}
            error={errors?.confirmPassword}
            disabled={isDisabled}
          />
        </Box>

        <Box display={'flex'} justifyContent={'flex-end'} alignItems={'baseline'}>
          <Button
            type={'submit'}
            variant={'contained'}
            sx={{ mt: 3, mb: 2 }}
            disabled={isDisabled}
            data-testid={'signupButton'}
          >
            Înregistrare
          </Button>
        </Box>
      </form>
    </Box>
  )
}
