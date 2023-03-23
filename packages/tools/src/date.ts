import format from 'date-fns/format'

export const formatDate = (date: Date | string) => format(new Date(date), 'yyyy-MM-dd')
export const formatDateTime = (date: Date | string) => format(new Date(date), 'yyyy-MM-dd HH:mm:ss')
export const formatYear = (date: Date | string) => format(new Date(date), 'yyyy')
