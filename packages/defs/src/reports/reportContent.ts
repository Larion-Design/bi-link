import { Title, TitleAPI } from './title'
import { Table, TableAPI } from './table'
import { Link, LinkAPI } from './link'
import { Text, TextAPI } from './text'
import { FileAPIInput, FileAPIOutput } from '../file'

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
