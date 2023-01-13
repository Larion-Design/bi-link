import React from 'react'
import { useOutletContext } from 'react-router-dom'
import { PersonAPIInput } from 'defs'

export const PersonFormContainer: React.FunctionComponent = () => {
  const [personId, personInfo, formHandler] = useOutletContext<PersonFormContainerProps>()
  return null
}

export type PersonFormContainerProps = [string?, PersonAPIInput?, PersonFormHandler?]

type PersonFormHandler = (personInfo: PersonAPIInput) => void | Promise<void>
