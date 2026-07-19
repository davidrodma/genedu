import { ID } from '@/app/_common/types/ID.type'
import { FilterFields, PaginateResponse, PaginateType } from '@/app/_common/components/datatable/types/paginate.type'
import { ColumnProps } from 'primereact/column'
import { DataTableProps, DataTableValueArray } from 'primereact/datatable'
import { ReactNode } from 'react'
import { MenuItem } from 'primereact/menuitem'
export type DataTableCustomProps<Model = any> = {
  columns: ColumnProps[]
  paginateRequest: (paginateParams: PaginateType) => Promise<PaginateResponse<Model>>
  eventNew?: (params?: any) => void
  eventEdit?: (params: Model) => void
  statusRequest?: (ids: ID[], status: number | string | any) => Promise<{ count: number }>
  deleteRequest?: (ids: ID[]) => Promise<{ count: number }>
  showStatusSwitch?: boolean
  needsRefresh?: boolean
  FiltersFormTemplate?: ReactNode
  statusArray?: {
    key: any
    label: string
  }[]
  addMenusRow?: MenuItem[]
  defaultFilters?: FilterFields
} & DataTableProps<DataTableValueArray>
