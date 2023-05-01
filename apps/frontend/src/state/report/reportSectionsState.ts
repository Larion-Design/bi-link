import { v4 } from 'uuid'
import { StateCreator } from 'zustand'
import { ReportContentAPIInput, ReportSectionAPIInput } from 'defs'
import { getDefaultReportSection } from 'tools'
import { removeMapItems } from '../utils'

type ReportSectionContent = Omit<ReportSectionAPIInput, 'content'> & { content: Set<string> }

export type ReportSectionsState = {
  sections: Map<string, ReportSectionContent>
  reportContent: Map<string, ReportContentAPIInput>

  setSections: (sections: ReportSectionAPIInput[]) => void

  addSection: () => void
  updateSectionName: (uid: string, name: string) => void
  removeSection: (uid: string) => void

  addContent: (sectionId: string, content: ReportContentAPIInput) => void
  updateContent: (contentId: string, content: ReportContentAPIInput) => void
  removeContent: (sectionId: string, contentId: string) => void
}

export const createReportSectionsStore: StateCreator<
  ReportSectionsState,
  [],
  [],
  ReportSectionsState
> = (set, get, state) => ({
  sections: new Map(),
  reportContent: new Map(),

  setSections: (sections) => {
    const contentMap = new Map<string, ReportContentAPIInput>()
    const sectionsMap = new Map<string, ReportSectionContent>()

    sections.forEach((sectionInfo) => {
      const contentList = new Set<string>()
      sectionInfo.content.forEach((contentInfo) => {
        const contentId = v4()
        contentMap.set(contentId, contentInfo)
        contentList.add(contentId)
      })
      sectionsMap.set(v4(), { ...sectionInfo, content: contentList })
    })

    set({ sections: sectionsMap, reportContent: contentMap })
  },

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
})
