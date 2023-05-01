import { create } from 'zustand'
import { ConnectedEntity, ReportAPIInput } from 'defs'
import { createDataRefStore, ReportDataRefsState } from './reportDataRefsState'
import { createReportSectionsStore, ReportSectionsState } from './reportSectionsState'

type ReportState = Pick<
  ReportAPIInput,
  'name' | 'type' | 'isTemplate' | 'person' | 'company' | 'property' | 'proceeding' | 'event'
> &
  ReportSectionsState &
  ReportDataRefsState & {
    setReportInfo: (reportInfo: ReportAPIInput) => void
    updateName: (name: string) => void
    updateType: (type: string) => void
    setTemplateMode: () => void

    setReportPerson: (person: ConnectedEntity) => void
    setReportCompany: (company: ConnectedEntity) => void
    setReportProperty: (property: ConnectedEntity) => void
    setReportEvent: (event: ConnectedEntity) => void
    setReportProceeding: (proceeding: ConnectedEntity) => void
  }

export const useReportState = create<ReportState>((set, get, state) => ({
  ...createReportSectionsStore(set, get, state),
  ...createDataRefStore(set, get, state),

  name: '',
  type: '',
  isTemplate: false,

  setReportInfo: ({
    name,
    type,
    isTemplate,
    person,
    company,
    proceeding,
    property,
    event,
    sections,
    refs,
  }) => {
    const { setSections, setDataRefs } = get()

    set({
      name,
      type,
      isTemplate,
      person,
      company,
      property,
      event,
      proceeding,
    })

    setSections(sections)
    setDataRefs(refs)
  },

  updateType: (type) => set({ type }),
  updateName: (name) => set({ name }),
  setTemplateMode: () =>
    set({
      isTemplate: true,
      person: null,
      company: null,
      proceeding: null,
      property: null,
      event: null,
      refs: new Map(),
    }),

  setReportPerson: (person) => set({ person }),
  setReportCompany: (company) => set({ company }),
  setReportEvent: (event) => set({ event }),
  setReportProperty: (property) => set({ property }),
  setReportProceeding: (proceeding) => set({ proceeding }),
}))
