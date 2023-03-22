import { useCallback, useMemo, useState } from 'react'
import { v4 } from 'uuid'
import { useDebounce } from 'usehooks-ts'

const noDeps: Array<unknown> = []

export function useMap<Item>(
  items: Array<Item>,
  idExtractFunc?: (item: Item) => string | undefined,
) {
  type ExtractIDFunction = (item: Item) => string | undefined

  const [map, setMap] = useState<Map<string, Item>>(() => {
    const itemsMap = new Map<string, Item>()
    items.forEach((item) => itemsMap.set(idExtractFunc?.(item) ?? v4(), item))
    return itemsMap
  })

  const deps = [map]
  const uid = useMemo(v4, deps)
  const size = useMemo(() => map.size, deps)

  const update = useCallback(
    (id: string, item: Item) => setMap((map) => new Map(map.set(id, item))),
    noDeps,
  )

  type UpdateHandler = (map: Map<string, Item>) => void

  const updateBulk = useCallback((handler: UpdateHandler) => {
    handler(map)
    setMap(new Map(map))
  }, noDeps)

  const remove = useCallback(
    (id: string) => setMap((map) => (map.delete(id) ? new Map(map) : map)),
    noDeps,
  )

  const removeBulk = useCallback(
    (ids: string[]) =>
      setMap((map) => {
        ids.forEach((id) => map.delete(id))
        return new Map(map)
      }),
    noDeps,
  )

  const clear = useCallback(
    () => setMap((map) => (map.size ? new Map<string, Item>() : map)),
    noDeps,
  )

  const keys = useCallback(() => Array.from(map.keys()), deps)
  const values = useCallback(() => Array.from(map.values()), deps)
  const entries = useCallback(() => Array.from(map.entries()), deps)

  const add = useCallback(
    (item: Item, idExtractFunc?: ExtractIDFunction) =>
      setMap((map) => new Map(map.set(idExtractFunc?.(item) ?? v4(), item))),
    noDeps,
  )

  const addBulk = useCallback(
    (items: Array<Item>, idExtractFunc?: ExtractIDFunction) =>
      setMap((map) => {
        items.forEach((item) => map.set(idExtractFunc?.(item) ?? v4(), item))
        return new Map(map)
      }),
    noDeps,
  )

  const filter = useCallback((handler: (item: Item) => boolean) => {
    const filteredMap = new Map<string, Item>()
    map.forEach((item, key) => {
      if (handler(item)) {
        filteredMap.set(key, item)
      }
    })
    return filteredMap
  }, noDeps)

  return {
    uid,
    map,
    keys,
    values,
    entries,
    add,
    addBulk,
    update,
    updateBulk,
    remove,
    removeBulk,
    clear,
    filter,
    size,
  }
}

export function useDebouncedMap<Item>(
  debounceDelay: number,
  items: Array<Item>,
  idExtractFunc?: (item: Item) => string | undefined,
) {
  const { map, ...rest } = useMap(items, idExtractFunc)
  const debouncedMap = useDebounce(map, debounceDelay)
  return { map: debouncedMap, ...rest }
}
