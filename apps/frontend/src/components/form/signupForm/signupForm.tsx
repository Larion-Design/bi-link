import React from 'react'
import AssignmentIndOutlinedIcon from '@mui/icons-material/AssignmentIndOutlined'
import Avatar from '@mui/material/Avatar'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import { FormikProps, withFormik } from 'formik'
import { InputField } from '../inputField'
import { InputPassword } from '../inputPassword'
import { signupValidationSchema } from './validation'

type SignupInfo = {
  name: string
  email: string
  password: string
  confirmPassword: string
}

type Props = {
  error?: string
  disabled?: boolean
  onSubmit: (signupInfo: SignupInfo) => void | Promise<void>
}

export const Signup: React.FunctionComponent<Props & FormikProps<SignupInfo>> = ({
  error,
  disabled,
  values,
  errors,
  isSubmitting,
  isValidating,
  setFieldValue,
  setSubmitting,
  handleSubmit,
}) => {
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

      <form onSubmit={handleSubmit}>
        <Box sx={{ mt: 2, width: 1 }}>
          <InputField
            required
            name={'name'}
            label={'Nume'}
            value={values.name}
            onChange={(value) => setFieldValue('name', value)}
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
            onChange={(value) => setFieldValue('email', value)}
            error={errors?.email}
            disabled={isDisabled}
          />
        </Box>

        <Box sx={{ mt: 4, width: 1 }}>
          <InputPassword
            label={'Parola'}
            onChange={(value) => setFieldValue('password', value)}
            error={errors?.password}
            disabled={isDisabled}
          />
        </Box>

        <Box sx={{ mt: 4, width: 1 }}>
          <InputPassword
            label={'Confirma parola'}
            onChange={(value) => setFieldValue('confirmPassword', value)}
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
            data-cy={'signupButton'}
          >
            Înregistrare
          </Button>
        </Box>
      </form>
    </Box>
  )
}

export const SignupForm = withFormik<Props, SignupInfo>({
  mapPropsToValues: () => ({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  }),
  validateOnChange: false,
  validateOnMount: false,
  validateOnBlur: false,
  validate: (registrationInfo) => signupValidationSchema.parse(registrationInfo),
  handleSubmit: (values, { props: { onSubmit } }) => onSubmit(values),
})(Signup)
