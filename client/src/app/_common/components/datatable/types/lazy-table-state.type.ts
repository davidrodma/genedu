import { DataTableFilterMeta } from 'primereact/datatable'

export interface LazyTableState {
  first: number
  rows: number
  page: number
  sortField?: string
  sortOrder?: any
  globalFilter?: string
  filters?: DataTableFilterMeta
}
