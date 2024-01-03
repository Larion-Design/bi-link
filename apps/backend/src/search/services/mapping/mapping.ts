import { MappingProperty } from '@elastic/elasticsearch/lib/api/types'

export interface MappingInterface<T> {
  getMapping: () => Record<string | keyof T, MappingProperty>
}
