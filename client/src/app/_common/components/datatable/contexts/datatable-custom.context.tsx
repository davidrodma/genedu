'use client'
import { FormEvent, ReactNode, createContext, useContext, useState } from 'react'
import { HiddenColumns } from '../types/hidden-columns.type'
import { FilterFields } from '@/app/_common/components/datatable/types/paginate.type'
import { LazyTableState } from '../types/lazy-table-state.type'
import { DataTablePageEvent } from 'primereact/datatable'

interface DataTableCustomContextProps<Model = any> {
  row: Model | undefined
  setRow: (row?: Model) => void
  rows: Model[]
  setRows: React.Dispatch<React.SetStateAction<Model[]>>
  hiddenColumns?: HiddenColumns
  setHiddenColumns: (hiddenColumns: HiddenColumns) => void
  selectedRows: Model[]
  setSelectedRows: React.Dispatch<React.SetStateAction<Model[]>>
  filters?: FilterFields
  setFilters: (filters: FilterFields) => void
  lazyState: LazyTableState | DataTablePageEvent
  setlazyState: (lazyState: LazyTableState | DataTablePageEvent) => void
  filter: (filters: FilterFields) => void
  onGlobalFilter: (event: FormEvent<HTMLInputElement>) => void
  visibleSliderFilter: boolean
  setVisibleSliderFilter: (visibleSliderFilter: boolean) => void
  isResetFilter: boolean
  setIsResetFilter: (isResetFilter: boolean) => void
  sendFilter: () => void
  refresh: () => void
  removeFilters: () => void
  emptyFilters?: FilterFields
  setEmptyFilters: (filters: FilterFields) => void
}

const DataTableCustomContext = createContext<DataTableCustomContextProps | undefined>(undefined)

export function DataTableCustomContextProvider<Model = any>({ children }: { children: ReactNode }) {
  const [rows, setRows] = useState<Model[]>([])
  const [row, setRow] = useState<Model>()
  const [hiddenColumns, setHiddenColumns] = useState<HiddenColumns>()
  const [selectedRows, setSelectedRows] = useState<Model[]>([])
  const [filters, setFilters] = useState<FilterFields>()
  const [emptyFilters, setEmptyFilters] = useState<FilterFields>()
  const [visibleSliderFilter, setVisibleSliderFilter] = useState<boolean>(false)
  const [isResetFilter, setIsResetFilter] = useState<boolean>(false)
  const [lazyState, setlazyState] = useState<LazyTableState | DataTablePageEvent>({
    first: 0,
    rows: 100,
    page: 1,
    sortField: 'id',
    sortOrder: -1,
    globalFilter: '',
    filters: undefined,
  })

  const sendFilter = () => {
    if (filter) {
      filter(filters)
      setVisibleSliderFilter(false)
    }
  }

  const filter = (filters: any) => {
    setlazyState({ ...lazyState, first: 0, page: 1, filters })
  }

  const onGlobalFilter = (event: FormEvent<HTMLInputElement>) => {
    const target = event.target as HTMLInputElement
    setlazyState({ ...lazyState, first: 0, page: 1, globalFilter: target.value })
  }

  const refresh = () => {
    setlazyState({ ...lazyState, first: 0 })
  }

  const removeFilters = () => {
    setFilters({ ...emptyFilters })
    setIsResetFilter(true)
    setTimeout(function () {
      setIsResetFilter(false)
    }, 400)
  }

  return (
    <DataTableCustomContext.Provider
      value={{
        rows,
        setRows,
        row,
        setRow,
        hiddenColumns,
        setHiddenColumns,
        selectedRows,
        setSelectedRows,
        filters,
        setFilters,
        lazyState,
        setlazyState,
        filter,
        visibleSliderFilter,
        setVisibleSliderFilter,
        isResetFilter,
        setIsResetFilter,
        sendFilter,
        onGlobalFilter,
        refresh,
        removeFilters,
        emptyFilters,
        setEmptyFilters,
      }}
    >
      {children}
    </DataTableCustomContext.Provider>
  )
}

export function useDataTableCustomContext<Model = any>() {
  const context = useContext(DataTableCustomContext) as DataTableCustomContextProps<Model>
  if (!context) {
    throw new Error('DataTableCustomContext must be used within a DataTableCustomContextProvider')
  }
  return context
}
