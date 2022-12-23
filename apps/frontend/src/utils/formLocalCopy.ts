import { useLocalStorage } from 'usehooks-ts'
import { PersonAPIInput } from '../types/person'
import { validatePersonForm } from '../components/form/personForm/validation/validation'
import { useEffect } from 'react'

interface PersonFormLocalCopyInfo {
  personInfo: PersonAPIInput
  personId?: string
}

export const useLocalPersonFormCopy = () => {
  const [localPersonForm, setPersonForm] = useLocalStorage<PersonFormLocalCopyInfo | null>(
    '_localPersonForm',
    null,
  )

  useEffect(() => {
    if (localPersonForm) {
      validatePersonForm(localPersonForm.personInfo).then((errors) => {
        if (errors) {
          setPersonForm(null)
        }
      })
    }
  }, [localPersonForm])

  return { ...localPersonForm, setPersonForm }
}
