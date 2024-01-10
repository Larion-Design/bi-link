import { Injectable } from '@nestjs/common'
import path from 'path'
import XLSX from 'xlsx'
import pdf from 'pdf-parse'
import WordExtractor from 'word-extractor'
import { recognize } from 'tesseract.js'

@Injectable()
export class TextExtractorService {
  private parsePdf = async (fileContent: Buffer) => (await pdf(fileContent)).text

  private parseDocx = (fileContent: string) =>
    fileContent
      .toString()
      .split('<w:t')
      .map((component) => {
        const tags = component.split('>')
        return tags[1]?.replace(/<.*$/, '') ?? ''
      })
      .join(' ')

  private parseDoc = async (fileContent: Buffer) =>
    (await new WordExtractor().extract(fileContent)).getBody()

  private parseSpreadsheet = (fileContent: Buffer) => {
    const workbook = XLSX.read(new Uint8Array(fileContent), {
      type: 'buffer',
    })
    return Object.values(workbook.Sheets)
      .map((sheet) =>
        XLSX.utils.sheet_to_txt(sheet, {
          strip: true,
          skipHidden: true,
          blankrows: false,
          rawNumbers: true,
        }),
      )
      .join(' ')
  }

  private parseImage = async (fileContent: Buffer) => {
    const {
      data: { text },
    } = await recognize(fileContent, 'ron')
    return text
  }

  async parseFile(fileName: string, fileContent: Buffer): Promise<string> {
    switch (path.extname(fileName)) {
      case 'pdf':
        return this.parsePdf(fileContent)
      case 'docx':
        return this.parseDocx(fileContent.toString())
      case 'doc':
        return this.parseDoc(fileContent)
      case 'xlsx':
      case 'xls':
      case 'csv':
        return this.parseSpreadsheet(fileContent)
      case 'jpg':
      case 'png':
      case 'webp':
      case 'jpeg':
      case 'bmp':
        return this.parseImage(fileContent)
      default:
        return fileContent.toString()
    }
  }
}
