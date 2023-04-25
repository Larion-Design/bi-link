import { getDefaultReportSection } from 'tools'
import { v4 } from 'uuid'
import { create } from 'zustand'
import { ReportAPIInput, ReportSectionAPIInput, DataRefAPI, ReportContentAPIInput } from 'defs'
import { removeMapItems } from './utils'

type ReportSectionContent = Omit<ReportSectionAPIInput, 'content'> & { content: Set<string> }

type ReportState = Pick<
  ReportAPIInput,
  'name' | 'type' | 'isTemplate' | 'person' | 'company' | 'property' | 'proceeding' | 'event'
> & {
  sections: Map<string, ReportSectionContent>
  refs: Map<string, DataRefAPI>

  setReportInfo: (reportInfo: ReportAPIInput) => void
  updateName: (name: string) => void
  updateType: (type: string) => void
  setTemplateMode: (isTemplate: boolean) => void

  addSection: () => void
  updateSectionName: (uid: string, name: string) => void
  removeSection: (uid: string) => void

  reportContent: Map<string, ReportContentAPIInput>
  addContent: (sectionId: string, content: ReportContentAPIInput) => void
  updateContent: (contentId: string, content: ReportContentAPIInput) => void
  removeContent: (sectionId: string, contentId: string) => void
}

export const useReportState = create<ReportState>((set, get, state) => ({
  name: '',
  type: '',
  isTemplate: false,
  sections: new Map(),
  refs: new Map(),
  reportContent: new Map(),

  setReportInfo: (reportInfo) => {
    const contentMap = new Map<string, ReportContentAPIInput>()
    const sectionsMap = new Map<string, ReportSectionContent>()
    reportInfo.sections.forEach((sectionInfo) => {
      const contentList = new Set<string>()
      sectionInfo.content.forEach((contentInfo) => {
        const contentId = v4()
        contentMap.set(contentId, contentInfo)
        contentList.add(contentId)
      })
      sectionsMap.set(v4(), { ...sectionInfo, content: contentList })
    })

    const dataRefsMap = new Map<string, DataRefAPI>()
    reportInfo.refs.forEach((dataRefInfo) => dataRefsMap.set(v4(), dataRefInfo))

    set({
      name: reportInfo.name,
      type: reportInfo.type,
      isTemplate: reportInfo.isTemplate,
      sections: sectionsMap,
      refs: dataRefsMap,
      reportContent: contentMap,
    })
  },

  updateType: (type) => set({ type }),
  updateName: (name) => set({ name }),
  setTemplateMode: (isTemplate) => set({ isTemplate }),

  addSection: () =>
    set({
      sections: new Map(get().sections).set(v4(), {
        ...getDefaultReportSection(),
        content: new Set(),
      }),
    }),
  updateSectionName: (uid, name) => {
    const sections = get().sections
    sections.get(uid).name = name
    set({ sections: new Map(sections) })
  },
  removeSection: (uid) => set({ sections: removeMapItems(get().sections, [uid]) }),

  addContent: (sectionId, content) => {
    const contentId = v4()
    const sectionsMap = get().sections
    sectionsMap.get(sectionId).content.add(contentId)

    set({
      sections: new Map(sectionsMap),
      reportContent: new Map(get().reportContent).set(contentId, content),
    })
  },
  updateContent: (uid, content) =>
    set({ reportContent: new Map(get().reportContent).set(uid, content) }),
  removeContent: (sectionId, contentId) => {
    const sectionsMap = get().sections
    sectionsMap.get(sectionId).content.delete(contentId)

    set({
      sections: new Map(sectionsMap),
      reportContent: removeMapItems(get().reportContent, [contentId]),
    })
  },
}))
