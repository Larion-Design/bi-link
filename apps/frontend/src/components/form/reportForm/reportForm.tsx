import Button from '@mui/material/Button'
import React from 'react'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import { ConnectedEntity, EntityType, ReportAPIInput } from 'defs'
import { FormikProps, withFormik } from 'formik'
import { AutocompleteField } from '../autocompleteField'
import { InputField } from '../inputField'
import { ToggleButton } from '../toggleButton'
import { ReportSections } from './reportSections'

type Props = {
  entityId?: string
  entityType?: EntityType
  reportId?: string
  reportInfo?: ReportAPIInput
  reportType: string
  onSubmit: (reportInfo: ReportAPIInput) => void | Promise<void>
  onCancel: () => void
}

const Form: React.FunctionComponent<Props & FormikProps<ReportAPIInput>> = ({
  entityId,
  entityType,
  setFieldError,
  setFieldValue,
  values,
  errors,
  isSubmitting,
  isValidating,
  submitForm,
  onCancel,
}) => (
  <Box>
    <form data-cy={'reportForm'}>
      <Grid container>
        <Grid item xs={6}>
          <InputField
            label={'Nume'}
            value={values.name}
            onChange={(value) => setFieldValue('name', value)}
          />
        </Grid>
        <Grid item xs={6}>
          <AutocompleteField
            label={'Tip de raport'}
            value={values.type}
            onValueChange={(value) => setFieldValue('type', value)}
            suggestions={['Raport de informare']}
          />
        </Grid>
        <Grid item xs={6}>
          <ToggleButton
            label={'Acest raport va fi folosit ca model'}
            checked={values.isTemplate}
            onChange={(checked) => {
              setFieldValue('isTemplate', checked)
            }}
          />
        </Grid>
        <Grid item xs={12}>
          <ReportSections
            entityId={entityId}
            entityType={entityType}
            sections={values.sections}
            updateSections={(sections) => {
              setFieldValue('sections', sections)
            }}
          />
        </Grid>

        <Grid item xs={12} justifyContent={'flex-end'} mt={4}>
          <Box display={'flex'} justifyContent={'flex-end'}>
            <Button
              data-cy={'cancelForm'}
              color={'error'}
              disabled={isSubmitting}
              variant={'text'}
              onClick={onCancel}
              sx={{ mr: 4 }}
            >
              Anulează
            </Button>
            <Button
              disabled={isSubmitting || isValidating}
              variant={'contained'}
              onClick={() => void submitForm()}
              data-cy={'submitForm'}
            >
              Salvează
            </Button>
          </Box>
        </Grid>
      </Grid>
    </form>
  </Box>
)

export const ReportForm = withFormik<Props, ReportAPIInput>({
  mapPropsToValues: ({ entityId, entityType, reportInfo, reportType }) =>
    reportInfo ?? createReportInitialValues(reportType, entityId, entityType),
  validate: async (values, { reportId }) => Promise.resolve(),
  validateOnChange: false,
  validateOnMount: false,
  validateOnBlur: false,
  handleSubmit: (values, { props: { onSubmit } }) => onSubmit(values),
})(Form)

const createReportInitialValues = (
  type: string,
  entityId: string,
  entityType: EntityType,
): ReportAPIInput => {
  const reportInfo: ReportAPIInput = {
    name: '',
    type,
    isTemplate: false,
    sections: [],
  }

  const connectedEntity: ConnectedEntity = {
    _id: entityId,
  }

  switch (entityType) {
    case 'COMPANY': {
      reportInfo.company = connectedEntity
      break
    }
    case 'PERSON': {
      reportInfo.person = connectedEntity
      break
    }
    case 'PROPERTY': {
      reportInfo.property = connectedEntity
      break
    }
    case 'INCIDENT': {
      reportInfo.incident = connectedEntity
      break
    }
  }
  return reportInfo
}
