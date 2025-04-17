import { InjectionKey } from 'vue'

export interface TableDto {
  $$datav_index: number
  [key: string]: any
}

export interface TableInjection {
  isHighLight: (rowNum: number) => boolean
}

export const tableInjectionKey = createInjectionKey<TableInjection>('v-table')


export function createInjectionKey<T> (key: string): InjectionKey<T> {
  return key as any
}
