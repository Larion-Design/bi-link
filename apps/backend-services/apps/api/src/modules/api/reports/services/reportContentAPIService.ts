import { ReportContentModel } from '@app/models/report/models/reportContentModel'
import { LinkModel } from '@app/models/report/models/content/linkModel'
import { TableModel } from '@app/models/report/models/content/tableModel'
import { TextModel } from '@app/models/report/models/content/textModel'
import { TitleModel } from '@app/models/report/models/content/titleModel'
import { Injectable } from '@nestjs/common'
import { FileAPIService } from '../../files/services/fileAPIService'
import { LinkInput } from '../dto/content/linkInput'
import { ReportContentInput } from '../dto/reportContentInput'
import { TableInput } from '../dto/content/tableInput'
import { TextInput } from '../dto/content/textInput'
import { TitleInput } from '../dto/content/titleInput'

@Injectable()
export class ReportContentAPIService {
  constructor(private readonly fileAPIService: FileAPIService) {}

  createReportContentModel = async (reportContentInput: ReportContentInput) => {
    const contentModel = new ReportContentModel()
    contentModel.order = reportContentInput.order

    if (reportContentInput.file) {
      contentModel.file = await this.fileAPIService.getUploadedFileModel(reportContentInput.file)
    }
    if (reportContentInput.images) {
      contentModel.images = await this.fileAPIService.getUploadedFilesModels(
        reportContentInput.images,
      )
    }
    if (reportContentInput.link) {
      contentModel.link = this.createLinkModel(reportContentInput.link)
    }
    if (reportContentInput.text) {
      contentModel.text = this.createTextModel(reportContentInput.text)
    }
    if (reportContentInput.title) {
      contentModel.title = this.createTitleModel(reportContentInput.title)
    }
    if (reportContentInput.table) {
      contentModel.table = this.createTableModel(reportContentInput.table)
    }
    return contentModel
  }

  private createLinkModel = (linkInput: LinkInput) => {
    const linkModel = new LinkModel()
    linkModel.url = linkInput.url
    linkModel.label = linkInput.label
    return linkModel
  }

  private createTableModel = (tableInput: TableInput) => {
    const tableModel = new TableModel()
    tableModel.id = tableInput.id
    return tableModel
  }

  private createTitleModel = (titleInput: TitleInput) => {
    const titleModel = new TitleModel()
    titleModel.content = titleInput.content
    return titleModel
  }

  private createTextModel = (textInput: TextInput) => {
    const textModel = new TextModel()
    textModel.content = textInput.content
    return textModel
  }
}
