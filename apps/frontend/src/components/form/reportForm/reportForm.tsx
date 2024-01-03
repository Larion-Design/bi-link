import {
  addEntityToReport,
  createReportInitialValues,
} from '@frontend/components/form/reportForm/constants'
import React, { useEffect } from 'react'
// import { usePDF } from '@react-pdf/renderer'
import Button from '@mui/material/Button'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
// import ApprovalOutlinedIcon from '@mui/icons-material/ApprovalOutlined';
import { ConnectedEntity, EntityType, ReportAPIInput } from 'defs'
import { useFormik } from 'formik'
import { FormattedMessage } from 'react-intl/lib'
import { getDefaultReport } from 'default-values'
import { useReportState } from '../../../state/report/reportState'
// import { ReportDocument } from '../../reports/reportDocument'
import { AutocompleteField } from '../autocompleteField'
import { InputField } from '../inputField'
import { ToggleButton } from '../toggleButton'
import { ReportSections } from './reportSections'

type Props<T = ReportAPIInput> = {
  onSubmit: (reportInfo: T) => void
  entityId?: string
  entityType?: EntityType
  reportId?: string
  reportType: string
  onCancel: () => void
}

export const ReportForm: React.FunctionComponent<Props> = ({
  entityId,
  entityType,
  onCancel,
  onSubmit,
}) => {
  const { setFieldValue, submitForm, isSubmitting, isValidating } = useFormik<ReportAPIInput>({
    validate: (values) => void {},
    validateOnChange: false,
    validateOnMount: false,
    validateOnBlur: false,
    initialValues: getDefaultReport(),
    onSubmit,
  })

  const {
    name,
    type,
    isTemplate,
    sections,
    updateName,
    updateType,
    setTemplateMode,
    setReportProceeding,
    setReportEvent,
    setReportCompany,
    setReportPerson,
    setReportProperty,
  } = useReportState()

  useEffect(() => void setFieldValue('sections', Array.from(sections.values())), [sections])

  const actionDisabled = isSubmitting || isValidating

  return (
    <form data-cy={'reportForm'}>
      <Grid container spacing={4}>
        <Grid item xs={4}>
          <InputField label={'Nume'} value={name} onChange={updateName} />
        </Grid>
        <Grid item xs={4}>
          <AutocompleteField
            label={'Tip de raport'}
            value={type}
            onChange={updateType}
            suggestions={['Raport de informare']}
          />
        </Grid>
        <Grid item xs={8}>
          <ToggleButton
            label={'Acest raport va fi folosit ca model'}
            checked={isTemplate}
            onChange={(checked) => {
              if (checked) {
                setTemplateMode()
              } else if (entityId && entityType) {
                const entity: ConnectedEntity = { _id: entityId }

                switch (entityType) {
                  case 'PERSON':
                    return setReportPerson(entity)
                  case 'COMPANY':
                    return setReportCompany(entity)
                  case 'PROPERTY':
                    return setReportProperty(entity)
                  case 'EVENT':
                    return setReportEvent(entity)
                  case 'PROCEEDING':
                    return setReportProceeding(entity)
                }
              }
            }}
          />
        </Grid>
        <Grid item xs={12}>
          <ReportSections entityId={entityId} entityType={entityType} />
        </Grid>
        <Grid item xs={12} justifyContent={'flex-end'} mt={4}>
          <Box display={'flex'} justifyContent={'flex-end'}>
            <Button
              data-cy={'cancelForm'}
              color={'error'}
              disabled={actionDisabled}
              variant={'text'}
              onClick={onCancel}
              sx={{ mr: 4 }}
            >
              <FormattedMessage id={'cancel'} />
            </Button>
            <Button
              data-cy={'generateDocument'}
              disabled={true}
              variant={'contained'}
              onClick={onCancel}
              sx={{ mr: 4 }}
            >
              <FormattedMessage id={'Generate Document'} />
            </Button>
            <Button
              disabled={actionDisabled}
              variant={'contained'}
              onClick={() => void submitForm()}
              data-cy={'submitForm'}
            >
              <FormattedMessage id={'save'} />
            </Button>
          </Box>
        </Grid>
      </Grid>
    </form>
  )
}
