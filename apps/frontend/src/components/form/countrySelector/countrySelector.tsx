import React from 'react'
import Autocomplete from '@mui/material/Autocomplete'
import TextField from '@mui/material/TextField'
import Stack from '@mui/material/Stack'
import countries from './countries.json'

type Props = {
  country: string
  updateCountry: (country: string) => void
  showIcons?: boolean
}

const getCountryByName = (country: string) =>
  countries.find(({ name }) => name === country) ?? { name: 'Romania', code: 'RO' }

export const CountrySelector: React.FunctionComponent<Props> = ({
  country,
  updateCountry,
  showIcons,
}) => (
  <Autocomplete
    fullWidth
    options={countries}
    autoHighlight
    defaultValue={getCountryByName(country)}
    onChange={(event, { name }) => updateCountry(name)}
    getOptionLabel={({ name }) => name}
    renderOption={(props, { name, code }) => (
      <Stack key={code} component={'li'} direction={'row'} spacing={2}>
        {showIcons && (
          <img
            loading={'lazy'}
            width={20}
            src={`https://flagcdn.com/${code.toLowerCase()}.svg`}
            alt={country}
          />
        )}
        {name}
      </Stack>
    )}
    renderInput={(params) => <TextField {...params} label={'Alege tara'} />}
  />
)
