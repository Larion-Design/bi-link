import {
  addEntityToReport,
  createReportInitialValues,
} from '@frontend/components/form/reportForm/constants'
import React, { useCallback, useEffect, useState } from 'react'
// import { usePDF } from '@react-pdf/renderer'
import Button from '@mui/material/Button'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
// import ApprovalOutlinedIcon from '@mui/icons-material/ApprovalOutlined';
import { ConnectedEntity, EntityType, ReportAPIInput } from 'defs'
import { FormikProps, withFormik } from 'formik'
import { FormattedMessage } from 'react-intl/lib'
import { useDataRefs } from '../../../utils/hooks/useDataRefProcessor'
// import { ReportDocument } from '../../reports/reportDocument'
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
}) => {
  const { transform, removeAllRefsExcept, extractRefsIds, createDataRef, getRefs, uid } =
    useDataRefs(values.refs)
  /* const [{ loading }, update] = usePDF({
    document: <ReportDocument reportInfo={values} transform={transform} />,
  })

  useEffect(update, [values, update, transform])*/

  const [graphsIds, setGraphsIds] = useState(new Set<string>())

  useEffect(() => {
    setFieldValue('refs', getRefs())
  }, [uid, setFieldValue])

  const registerGraphId = useCallback(
    (graphId) =>
      setGraphsIds((graphsIds) => {
        graphsIds.add(graphId)
        return new Set(graphsIds)
      }),
    [setGraphsIds],
  )

  const removeGraphId = useCallback(
    (graphId) =>
      setGraphsIds((graphsIds) => {
        graphsIds.delete(graphId)
        return new Set(graphsIds)
      }),
    [setGraphsIds],
  )

  useEffect(() => {
    const refsIds = new Set<string>()
    const addRef = (refId) => refsIds.add(refId)
    values.sections.forEach(({ content }) => {
      content.forEach(({ text, title, link }) => {
        if (text?.content?.length) {
          extractRefsIds(text.content).forEach(addRef)
        } else if (title?.content?.length) {
          extractRefsIds(title.content).forEach(addRef)
        } else if (link?.label?.length) {
          extractRefsIds(link.label).forEach(addRef)
        }
      })
    })
    removeAllRefsExcept(Array.from(refsIds))
  }, [values.sections])

  const actionDisabled = isSubmitting || isValidating // || loading

  return (
    <form data-cy={'reportForm'}>
      <Grid container spacing={4}>
        <Grid item xs={4}>
          <InputField
            label={'Nume'}
            value={values.name}
            onChange={(value) => setFieldValue('name', value)}
          />
        </Grid>
        <Grid item xs={4}>
          <AutocompleteField
            label={'Tip de raport'}
            value={values.type}
            onValueChange={(value) => setFieldValue('type', value)}
            suggestions={['Raport de informare']}
          />
        </Grid>
        <Grid item xs={8}>
          <ToggleButton
            label={'Acest raport va fi folosit ca model'}
            checked={values.isTemplate}
            onChange={(checked) => {
              setFieldValue('isTemplate', checked)

              if (checked) {
                setFieldValue('refs', [])
                setFieldValue('person', null)
                setFieldValue('company', null)
                setFieldValue('property', null)
                setFieldValue('incident', null)
              } else if (entityId && entityType) {
                const entity: ConnectedEntity = { _id: entityId }

                switch (entityType) {
                  case 'PERSON': {
                    setFieldValue('person', entity)
                    break
                  }
                  case 'COMPANY': {
                    setFieldValue('company', entity)
                    break
                  }
                  case 'PROPERTY': {
                    setFieldValue('property', entity)
                    break
                  }
                  case 'EVENT': {
                    setFieldValue('event', entity)
                    break
                  }
                }
              }
            }}
          />
        </Grid>
        <Grid item xs={12}>
          <ReportSections
            entityId={entityId}
            entityType={entityType}
            sections={values.sections}
            updateSections={(sections) => setFieldValue('sections', sections)}
            generateTextPreview={transform}
            createDataRef={createDataRef}
            graphCreated={registerGraphId}
            graphRemoved={removeGraphId}
          />
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

export const ReportForm = withFormik<Props, ReportAPIInput>({
  mapPropsToValues: ({ entityId, entityType, reportInfo, reportType }) =>
    reportInfo
      ? addEntityToReport(entityId, entityType, reportInfo)
      : createReportInitialValues(reportType, entityId, entityType),
  validate: async (values, { reportId }) => Promise.resolve(),
  validateOnChange: false,
  validateOnMount: false,
  validateOnBlur: false,
  handleSubmit: (values, { props: { onSubmit } }) => onSubmit(values),
})(Form)
