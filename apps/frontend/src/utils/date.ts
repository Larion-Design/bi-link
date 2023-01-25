import { format } from 'date-fns'

export const isDatesOrderValid = (startDate: Date, endDate: Date) => startDate < endDate

export const formatDate = (date: Date | string) => format(new Date(date), 'YYYY-mm-DD')
