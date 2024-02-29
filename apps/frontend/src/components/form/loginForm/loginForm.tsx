import React from 'react'
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'
import Avatar from '@mui/material/Avatar'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import { FormikProps, withFormik } from 'formik'
import { Link } from 'react-router-dom'
import { routes } from '../../../router/routes'
import { InputField } from '../inputField'
import { InputPassword } from '../inputPassword'
import { loginValidationSchema } from './validation'

type LoginInfo = {
  email: string
  password: string
}

type Props = {
  error?: string
  disabled?: boolean
  onSubmit: (loginInfo: LoginInfo) => void | Promise<void>
}

export const Login: React.FunctionComponent<Props & FormikProps<LoginInfo>> = ({
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
        <LockOutlinedIcon fontSize={'large'} />
      </Avatar>
      <Typography variant={'h5'} gutterBottom>
        Autentificare
      </Typography>

      <form onSubmit={handleSubmit}>
        <Box sx={{ mt: 2, width: 1 }}>
          <InputField
            required
            name={'email'}
            label={'Email'}
            value={values.email}
            onChange={(value) => setFieldValue('email', value)}
            error={errors.email}
            disabled={isDisabled}
          />
        </Box>

        <Box sx={{ mt: 4, width: 1 }}>
          <InputPassword
            label={'Parola'}
            onChange={(value) => void setFieldValue('password', value)}
            error={errors.password}
            disabled={isDisabled}
          />
        </Box>

        <Box display={'flex'} justifyContent={'space-between'} alignItems={'baseline'}>
          <Typography variant={'body1'}>
            <Link to={routes.resetPassword}>Ai uitat parola?</Link>
          </Typography>
          <Button
            type={'submit'}
            variant={'contained'}
            sx={{ mt: 3, mb: 2 }}
            disabled={isDisabled}
            data-testid={'loginButton'}
          >
            Intra
          </Button>
        </Box>
      </form>
    </Box>
  )
}

export const LoginForm = withFormik<Props, LoginInfo>({
  mapPropsToValues: () => ({
    email: '',
    password: '',
  }),
  validateOnChange: false,
  validateOnMount: false,
  validateOnBlur: false,
  validate: (data) => {
    loginValidationSchema.parse(data)
  },
  handleSubmit: (values, { props: { onSubmit } }) => void onSubmit(values),
})(Login)
