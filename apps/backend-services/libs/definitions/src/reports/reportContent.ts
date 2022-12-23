import { File, FileAPIInput, FileAPIOutput } from '@app/definitions/file'
import { Title, TitleAPI } from '@app/definitions/reports/title'
import { Table, TableAPI } from '@app/definitions/reports/table'
import { Link, LinkAPI } from '@app/definitions/reports/link'
import { Text, TextAPI } from '@app/definitions/reports/text'

export interface ReportContent {
  order: number
  title?: Title
  text?: Text
  images?: File[]
  file?: File
  table?: Table
  link?: Link
}

interface ReportContentAPI
  extends Omit<ReportContent, 'images' | 'title' | 'text' | 'file' | 'table' | 'link'> {}

export interface ReportContentAPIInput extends ReportContentAPI {
  title?: TitleAPI
  text?: TextAPI
  images?: FileAPIInput[]
  file?: FileAPIInput
  table?: TableAPI
  link?: LinkAPI
}

export interface ReportContentAPIOutput extends ReportContentAPI {
  title?: TitleAPI
  text?: TextAPI
  images?: FileAPIOutput[]
  file?: FileAPIOutput
  table?: TableAPI
  link?: LinkAPI
}
