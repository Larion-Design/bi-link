import React, { useMemo, useState } from 'react'
import Button from '@mui/material/Button'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import Accordion from '@mui/material/Accordion'
import AccordionDetails from '@mui/material/AccordionDetails'
import AccordionSummary from '@mui/material/AccordionSummary'
import AccordionActions from '@mui/material/AccordionActions'
import { FileAPIInput, ReportContentAPIInput } from 'defs'
import { useModal } from '../../modal/modalProvider'
import { ReportContentLink } from './reportContent/reportContentLink'
import { ReportContentText } from './reportContent/reportContentText'
import { ReportContentTitle } from './reportContent/reportContentTitle'

type Props = {
  images: FileAPIInput[]
  contentInfo: ReportContentAPIInput
  updateContentInfo: (contentInfo: ReportContentAPIInput) => void
}

export const ReportContentElement: React.FunctionComponent<Props> = ({
  images,
  contentInfo,
  updateContentInfo,
}) => {
  const [expanded, setExpandedState] = useState(false)
  const modal = useModal()

  const contentElement = useMemo(() => {
    if (contentInfo.link) {
      return (
        <>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>Link</AccordionSummary>
          <AccordionDetails>
            <ReportContentLink
              linkInfo={contentInfo.link}
              updateLink={(linkInfo) => updateContentInfo({ ...contentInfo, link: linkInfo })}
            />
          </AccordionDetails>
        </>
      )
    }
    if (contentInfo.text) {
      return (
        <>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>Paragraf</AccordionSummary>
          <AccordionDetails>
            <ReportContentText
              textInfo={contentInfo.text}
              updateText={(textInfo) => updateContentInfo({ ...contentInfo, text: textInfo })}
            />
          </AccordionDetails>
        </>
      )
    }
    if (contentInfo.title) {
      return (
        <>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>Titlu</AccordionSummary>
          <AccordionDetails>
            <ReportContentTitle
              titleInfo={contentInfo.title}
              updateTitle={(titleInfo) => updateContentInfo({ ...contentInfo, title: titleInfo })}
            />
          </AccordionDetails>
        </>
      )
    }
    if (contentInfo.images) {
      return (
        <>
          <AccordionActions>
            <Button
              variant={'contained'}
              onClick={() =>
                modal.openImageSelector(
                  images,
                  (images) => updateContentInfo({ ...contentInfo, images }),
                  contentInfo.images,
                )
              }
            >
              Adaugă imagini
            </Button>
          </AccordionActions>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>Imagini</AccordionSummary>
          <AccordionDetails></AccordionDetails>
        </>
      )
    }
    if (contentInfo.file) {
      return (
        <>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>Fisier</AccordionSummary>
          <AccordionDetails></AccordionDetails>
        </>
      )
    }
    if (contentInfo.table) {
      return (
        <>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>Tabel</AccordionSummary>
          <AccordionDetails></AccordionDetails>
        </>
      )
    }
    return null
  }, [contentInfo])

  return (
    <Accordion
      variant={'outlined'}
      expanded={expanded}
      onChange={() => setExpandedState((expanded) => !expanded)}
    >
      {contentElement}
    </Accordion>
  )
}
