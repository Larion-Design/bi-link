import { RealEstateAPIInput } from 'defs'
import React from 'react'

type Props = {
  realEstateInfo: RealEstateAPIInput
  updateRealEstateInfo: (realEstateInfo: RealEstateAPIInput) => void | Promise<void>
}

export const RealEstateInfo: React.FunctionComponent<Props> = ({
  realEstateInfo,
  updateRealEstateInfo,
}) => {
  return <></>
}
