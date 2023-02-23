import { GridPreProcessEditCellProps } from '@mui/x-data-grid'

export const processGridCellValue = (params: GridPreProcessEditCellProps<string>) => {
  if (params.hasChanged) {
    const hasError = !params.props.value?.length
    return { ...params.props, error: hasError }
  }
  return params
}
