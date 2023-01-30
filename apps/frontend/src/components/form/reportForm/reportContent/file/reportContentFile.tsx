import Grid from '@mui/material/Grid'
import React, { useCallback, useEffect, useMemo } from 'react'
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined'
import AccordionActions from '@mui/material/AccordionActions'
import AccordionDetails from '@mui/material/AccordionDetails'
import Typography from '@mui/material/Typography'
import PostAddOutlinedIcon from '@mui/icons-material/PostAddOutlined'
import { EntityType, FileAPIInput } from 'defs'
import { getCompanyInfoRequest } from '../../../../../graphql/companies/queries/getCompany'
import { getIncidentRequest } from '../../../../../graphql/incidents/queries/getIncident'
import { getPersonInfoRequest } from '../../../../../graphql/persons/queries/getPersonInfo'
import { getPropertyRequest } from '../../../../../graphql/properties/queries/getProperty'
import { ActionButton } from '../../../../button/actionButton'
import { useModal } from '../../../../modal/modalProvider'
import { FileTargetEntitySelector } from './fileTargetEntitySelector'

type Props = {
  entityId?: string
  entityType?: EntityType
  fileInfo: FileAPIInput | null
  updateFile: (fileInfo: FileAPIInput | null) => void
  removeContent: () => void
}

export const ReportContentFile: React.FunctionComponent<Props> = ({
  entityId,
  entityType,
  fileInfo,
  updateFile,
  removeContent,
}) => {
  const modal = useModal()
  const [fetchPerson, { data: personInfo }] = getPersonInfoRequest()
  const [fetchProperty, { data: propertyInfo }] = getPropertyRequest()
  const [fetchCompany, { data: companyInfo }] = getCompanyInfoRequest()
  const [fetchIncident, { data: incidentInfo }] = getIncidentRequest()

  const openFileSelector = useCallback(
    (files: FileAPIInput[], selectedFile: FileAPIInput | null) =>
      modal.openFileSelector(files, updateFile, selectedFile),
    [entityId, entityType, updateFile],
  )

  const handleAddFileAction = useCallback(() => {
    if (personInfo?.getPersonInfo?.files.length) {
      openFileSelector(personInfo.getPersonInfo.files, fileInfo)
    }
    if (propertyInfo?.getProperty?.files.length) {
      openFileSelector(propertyInfo.getProperty.files, fileInfo)
    }
    if (companyInfo?.getCompany?.files.length) {
      openFileSelector(companyInfo.getCompany.files, fileInfo)
    }
    if (incidentInfo?.getIncident?.files.length) {
      openFileSelector(incidentInfo.getIncident.files, fileInfo)
    }
  }, [
    personInfo?.getPersonInfo?.images,
    propertyInfo?.getProperty?.images,
    companyInfo?.getCompany?.files,
    incidentInfo?.getIncident?.files,
    fileInfo,
  ])

  const shouldDisableModal = useMemo(
    () =>
      personInfo?.getPersonInfo?.files.length === 0 ||
      propertyInfo?.getProperty?.files.length === 0 ||
      companyInfo?.getCompany?.files.length === 0 ||
      incidentInfo?.getIncident?.files.length === 0,
    [
      personInfo?.getPersonInfo?.files,
      propertyInfo?.getProperty?.files,
      companyInfo?.getCompany?.files,
      incidentInfo?.getIncident?.files,
    ],
  )

  useEffect(() => {
    const files = personInfo?.getPersonInfo?.files.filter(({ isHidden }) => !isHidden)

    if (files?.length) {
      openFileSelector(files, fileInfo)
    }
  }, [personInfo?.getPersonInfo?.files])

  useEffect(() => {
    const files = propertyInfo?.getProperty?.files.filter(({ isHidden }) => !isHidden)

    if (files?.length) {
      openFileSelector(files, fileInfo)
    }
  }, [propertyInfo?.getProperty?.files])

  useEffect(() => {
    const files = companyInfo?.getCompany?.files.filter(({ isHidden }) => !isHidden)

    if (files?.length) {
      openFileSelector(files, fileInfo)
    }
  }, [companyInfo?.getCompany?.files])

  useEffect(() => {
    const files = incidentInfo?.getIncident?.files.filter(({ isHidden }) => !isHidden)

    if (files?.length) {
      openFileSelector(files, fileInfo)
    }
  }, [incidentInfo?.getIncident?.files])

  useEffect(() => {
    if (entityId && entityType) {
      switch (entityType) {
        case 'PERSON': {
          void fetchPerson({ variables: { personId: entityId } })
          break
        }
        case 'PROPERTY': {
          void fetchProperty({ variables: { propertyId: entityId } })
          break
        }
        case 'COMPANY': {
          void fetchCompany({ variables: { id: entityId } })
          break
        }
        case 'INCIDENT': {
          void fetchIncident({ variables: { incidentId: entityId } })
          break
        }
      }
    }
  }, [entityId, entityType])

  return (
    <>
      <AccordionDetails>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            {fileInfo ? (
              <>
                <Typography variant={'h6'}>{fileInfo.name}</Typography>
                <Typography>{fileInfo.description}</Typography>
              </>
            ) : (
              <Typography variant={'body2'}>Nu ai selectat niciun fisier</Typography>
            )}
          </Grid>
          <Grid item xs={12}>
            {!!entityId && (
              <FileTargetEntitySelector
                entityId={entityId}
                selectedFile={fileInfo}
                updateFile={updateFile}
              />
            )}
          </Grid>
        </Grid>
      </AccordionDetails>
      <AccordionActions>
        <ActionButton
          disabled={shouldDisableModal}
          icon={<PostAddOutlinedIcon />}
          onClick={handleAddFileAction}
          label={'Adaugă fisier'}
        />
        <ActionButton
          icon={<DeleteOutlinedIcon color={'error'} />}
          onClick={removeContent}
          label={'Sterge element'}
        />
      </AccordionActions>
    </>
  )
}
