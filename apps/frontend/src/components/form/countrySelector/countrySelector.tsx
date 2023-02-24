import React from 'react'
import Autocomplete from '@mui/material/Autocomplete'
import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
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
      <Box key={code} component={'li'} sx={{ '& > img': { mr: 2, flexShrink: 0 } }} {...props}>
        {showIcons && (
          <img
            loading={'lazy'}
            width={20}
            src={`https://flagcdn.com/w20/${code.toLowerCase()}.png`}
            srcSet={`https://flagcdn.com/w40/${code.toLowerCase()}.png 2x`}
            alt={country}
          />
        )}
        {name} ({code})
      </Box>
    )}
    renderInput={(params) => <TextField {...params} label={'Selectează tara'} />}
  />
)
