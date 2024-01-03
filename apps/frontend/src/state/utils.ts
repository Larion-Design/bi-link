import { v4 } from 'uuid'

export const removeMapItems = <T>(map: Map<string, T>, ids: string[]) => {
  let mapUpdated = false

  ids.forEach((id) => {
    const itemDeleted = map.delete(id)

    if (!mapUpdated) {
      mapUpdated = itemDeleted
    }
  })
  return mapUpdated ? new Map<string, T>(map) : map
}

export const addMapItems = <T>(
  map: Map<string, T>,
  items: T[],
  callback?: (item: T) => string | undefined,
) => {
  let mapUpdated = false

  items.forEach((item) => {
    const uid = callback?.(item) ?? v4()

    if (!map.has(uid)) {
      map.set(uid, item)
      mapUpdated = true
    }
  })
  return mapUpdated ? new Map(map) : map
}
