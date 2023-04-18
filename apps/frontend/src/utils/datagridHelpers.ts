export type Unique<T> = T & { id: string }

export const createDatagridItems = <T>(itemsMap: Map<string, T>) => {
  const list: Unique<T>[] = []
  itemsMap.forEach((item, id) => list.push({ ...item, id }))
  return list
}

export const getDatagridItemInfo = <T>({ id, ...item }: Unique<T>) => ({ id, item })
