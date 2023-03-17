import { getDefaultLocation } from '@frontend/components/form/location'
import { PersonAPIInput, RelationshipAPIInput } from 'defs'

export const getDefaultPerson = (): PersonAPIInput => ({
  firstName: '',
  lastName: '',
  oldNames: [],
  cnp: '',
  birthdate: null,
  birthPlace: getDefaultLocation(),
  homeAddress: getDefaultLocation(),
  customFields: [],
  contactDetails: [],
  images: [],
  documents: [],
  files: [],
  relationships: [],
  education: [],
})

export const createRelationship = (_id: string): RelationshipAPIInput => ({
  person: { _id },
  type: '',
  description: '',
  proximity: 1,
  _confirmed: true,
  relatedPersons: [],
})

export const relationshipsTypes = {
  1: 'Membru de familie',
  2: 'Ruda sau membru din familia extinsa',
  3: 'Prieten',
  4: 'Coleg',
  5: 'Cunostinta',
  6: 'Urmaritor social media',
}

export const proximityLevels = {
  1: 'Nu mentine o relatie stransa cu persoana curenta.',
  2: 'Are o relatie relativ apropiata cu persoana curenta.',
  3: 'Are o relatie apropiata cu persoana curenta.',
  4: 'Are o relatie foarte apropiata cu persoana curenta.',
  5: 'Locuieste cu persoana curenta.',
}
