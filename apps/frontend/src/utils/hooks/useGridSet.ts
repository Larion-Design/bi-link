import { useCallback, useMemo, useState } from 'react'
import { v4 } from 'uuid'

export type GridSetItem<T> = T & { _id: string }

export function useGridSet<Item>(
  items: Item[],
  idExtractFunc?: (item: Item) => string | undefined,
) {
  type UniqueItem = GridSetItem<Item>

  const [map, setMap] = useState<Map<string, UniqueItem>>(() => {
    const map = new Map()
    items.forEach((item) => {
      const _id = idExtractFunc?.(item) ?? v4()
      map.set(_id, { ...item, _id })
    })
    return map
  })

  const uid = useMemo(() => v4(), [map])

  const create = useCallback(
    (item: Item, idExtractFunc?: (item: Item) => string | undefined) =>
      setMap((map) => {
        const _id = idExtractFunc?.(item) ?? v4()
        return new Map(map.set(_id, { ...item, _id }))
      }),
    [],
  )

  const update = useCallback(
    (item: UniqueItem) => setMap((map) => new Map(map.set(item._id, item))),
    [],
  )

  const updateBulk = useCallback(
    (items: UniqueItem[]) =>
      setMap((map) => {
        items.forEach((item) => map.set(item._id, item))
        return new Map(map)
      }),
    [],
  )

  const remove = useCallback(
    (id: string) => setMap((map) => (map.delete(id) ? new Map(map) : map)),
    [],
  )

  const removeBulk = useCallback(
    (ids: string[]) =>
      setMap((map) => {
        ids.forEach((id) => map.delete(id))
        return new Map(map)
      }),
    [],
  )

  const values = useCallback(() => Array.from(map.values()), [map])

  const rawValues = useCallback(
    () => Array.from(map.values()).map(({ _id, ...item }) => item),
    [map],
  )

  return {
    uid,
    create,
    update,
    updateBulk,
    remove,
    removeBulk,
    values,
    rawValues,
  }
}
