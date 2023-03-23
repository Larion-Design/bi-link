import { v4 } from 'uuid'

export type EntityState<
  AllFields,
  SimpleFields extends Record<string, unknown>,
  ListFields extends Record<string, Array<unknown>>,
> = SimpleFields & {
  [Key in keyof SimpleFields as `set${Capitalize<string & Key>}`]: (
    value: SimpleFields[Key],
  ) => void
} & { [Key in keyof ListFields]: Map<string, ListFields[Key][number]> } & {
  [Key in keyof ListFields as `add${Capitalize<string & Key>}`]: (
    value: ListFields[Key][number],
  ) => void
} & {
  [Key in keyof ListFields as `set${Capitalize<string & Key>}`]: (
    itemId: string,
    value: ListFields[Key][number],
  ) => void
} & {
  [Key in keyof ListFields as `remove${Capitalize<string & Key>}`]: (value: string) => void
} & { setEntity: (entity: AllFields | null) => void }

export const createMap: <Type>(
  items: Type[],
  idExtractFunc?: (item: Type) => string | undefined,
) => Map<string, Type> = (items, idExtractFunc) => {
  const map = new Map()
  items.forEach((item) => map.set(idExtractFunc?.(item) ?? v4(), item))
  return map
}

export const addItemToMap: <Type>(
  map: Map<string, Type>,
  item: Type,
  idExtractFunc?: (item: Type) => string | undefined,
) => Map<string, Type> = (map, item, idExtractFunc) => {
  map.set(idExtractFunc?.(item) ?? v4(), item)
  return new Map(map)
}

export const updateMapItem: <Type>(
  map: Map<string, Type>,
  itemId: string,
  item: Type,
) => Map<string, Type> = (map, itemId, item) => {
  map.set(itemId, item)
  return new Map(map)
}

export const removeMapItem: <Type>(map: Map<string, Type>, itemId: string) => Map<string, Type> = (
  map,
  itemId,
) => (map.delete(itemId) ? new Map(map) : map)
