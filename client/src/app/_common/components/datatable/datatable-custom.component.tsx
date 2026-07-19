"use client"
import React, { useState, useEffect, useRef, Suspense } from "react"
import {
  DataTable,
  DataTableFilterEvent,
  DataTablePageEvent,
  DataTableSortEvent,
  DataTableValue,
} from "primereact/datatable"
import { Column } from "primereact/column"
import { Toast } from "primereact/toast"
import DataTableLayout from "@/app/_common/components/datatable/layout"
import DataTableFilter from "@/app/_common/components/datatable/datatable-filter.component"
import { Menu } from "primereact/menu"
import DataTablePaginator from "@/app/_common/components/datatable/datatable-paginator.component"
import { ProgressBar } from "primereact/progressbar"
import { DataTableToolbar } from "./datatable-toolbar.component"
import { DataTableRowMenu } from "./datatable-row-menu.component"
import { DataTableRowMenuButton } from "./datatable-row-menu-button.component"
import { useDataTableCustomContext } from "./contexts/datatable-custom.context"
import { ID } from "@/app/_common/types/ID.type"
import { InputSwitch } from "primereact/inputswitch"
import { DataTableCustomProps } from "./types/datatable-custom-props.type"
import { statusDefaultArray } from "@/app/_common/enums/status.default.enum"

export function DataTableCustom<Model extends DataTableValue = any>({
  columns,
  paginateRequest,
  statusRequest,
  eventNew,
  eventEdit,
  deleteRequest,
  showStatusSwitch = true,
  FiltersFormTemplate,
  needsRefresh = false,
  statusArray = statusDefaultArray,
  addMenusRow = [],
  defaultFilters = {},
  onRowDoubleClick,
  expandedRows,
  onRowToggle,
  onRowExpand,
  onRowCollapse,
  rowExpansionTemplate,
  ...props
}: DataTableCustomProps<Model>) {
  const {
    row,
    setRow,
    rows,
    setRows,
    lazyState,
    setlazyState,
    selectedRows,
    setSelectedRows,
    refresh,
  } = useDataTableCustomContext<Model>()

  const [totalRecords, setTotalRecords] = useState<number>(0)
  const toast = useRef<Toast>(null)
  const dt = useRef<DataTable<Model[]>>(null)
  const menuRefRow = useRef<Menu>(null)
  const [newStatus, setNewStatus] = useState(null)
  const defaultFiltersInit = useRef(defaultFilters)

  const [loading, setLoading] = useState<boolean>(true)

  const [currentPage, setCurrentPage] = useState<any>(lazyState.page)
  useEffect(() => {
    const loadLazyData = () => {
      setLoading(true)
      paginateRequest({
        page: lazyState.page,
        limit: lazyState.rows,
        search: lazyState.globalFilter,
        filters: { ...defaultFiltersInit.current, ...lazyState.filters },
        order: lazyState.sortField
          ? { [lazyState.sortField as string]: lazyState.sortOrder }
          : undefined,
      }).then((response) => {
        setTotalRecords(response.total)
        setRows(response.list)
        setLoading(false)
      })
    }
    loadLazyData()
  }, [lazyState, paginateRequest, setRows])

  const onPage = (event: DataTablePageEvent) => {
    const page = (event?.page || 0) + 1
    setCurrentPage(page)
    setlazyState({ ...event, page })
  }

  const goToPage = (page: number) => {
    setCurrentPage(page)
    setlazyState({ ...lazyState, page, first: page - 1 })
  }

  const onSort = (event: DataTableSortEvent) => {
    setlazyState(event as any)
  }

  const onFilter = (event: DataTableFilterEvent) => {
    event["first"] = 0
    setlazyState(event as any)
  }

  const deleteRow = async () => {
    if (row) {
      await deleteSelectedRows([row.id])
      setRow(undefined)
    }
  }

  const deleteSelectedRows = async (ids?: string[]) => {
    if (deleteRequest) {
      setLoading(true)
      const idsDel =
        ids || (selectedRows && selectedRows.map((item) => item.id))
      if (idsDel) {
        return deleteRequest(idsDel).then((response) => {
          if (response.count) {
            const _rows = rows.filter((val) => !idsDel?.includes(val.id))
            setRows(_rows)
            setSelectedRows([])
            toast.current?.show({
              severity: "success",
              summary: "Successful",
              detail: `${response.count} Records Deleted`,
              life: 3000,
            })
          } else {
            toast.current?.show({
              severity: "error",
              summary: "Error",
              detail: `${(response as any)?.error || "no results"}`,
              life: 10000,
            })
          }
          setLoading(false)
        })
      }
      setLoading(false)
    }
  }

  const changeStatus = async (ids?: ID[], status?: number | string | any) => {
    if (statusRequest) {
      setLoading(true)
      const idsStatus =
        ids || (selectedRows && selectedRows.map((item) => item.id))
      const statusTo = status ?? newStatus
      if (idsStatus && statusTo !== null) {
        return statusRequest(idsStatus, statusTo).then((response) => {
          if (response.count) {
            const _rows = rows.map((val) =>
              idsStatus?.includes(val.id) ? { ...val, status: statusTo } : val
            )
            console.log(rows)
            setRows([..._rows])
            setSelectedRows([])
            toast.current?.show({
              severity: "success",
              summary: "Successful",
              detail: `${response.count} Status Updated`,
              life: 3000,
            })
          } else {
            toast.current?.show({
              severity: "error",
              summary: "Error",
              detail: `${(response as any)?.error || "no results"}`,
              life: 10000,
            })
          }
          if (needsRefresh) refresh()
          setLoading(false)
        })
      }
      setLoading(false)
    }
  }

  const statusSwitchTemplate = (rowData: Model) => {
    return (
      <InputSwitch
        checked={!!rowData.status}
        onChange={(e) => {
          changeStatus([rowData.id], e.value ? 1 : 0)
        }}
      />
    )
  }
  return (
    <>
      <DataTableToolbar<Model>
        eventNew={eventNew}
        eventStatus={statusRequest ? changeStatus : undefined}
        eventConfirmDelete={deleteRequest ? deleteSelectedRows : undefined}
        eventRefresh={refresh}
        newStatus={newStatus}
        setNewStatus={setNewStatus}
        loading={loading}
        statusArray={statusArray}
        dt={dt}
      />

      {loading && (
        <ProgressBar
          mode="indeterminate"
          className="h-0.5 -mt-0.5 absolute w-full"
        />
      )}
      <DataTableLayout>
        <Toast ref={toast} />
        <DataTableRowMenu<Model>
          menuRefRow={menuRefRow}
          row={row}
          eventEdit={eventEdit}
          eventConfirmDelete={deleteRequest ? deleteRow : undefined}
          loading={loading}
          addMenusRow={addMenusRow}
          questionDelete={
            row && (
              <span className="w-full pt-1 text-center">
                Are you sure you want to delete{" "}
                <b>
                  {(row as any)?.name ||
                    (row as any)?.title ||
                    (row as any)?.id ||
                    ""}
                </b>
                ?
              </span>
            )
          }
        />
        <div className="card">
          <DataTable
            value={rows}
            ref={dt}
            lazy
            resizableColumns
            filterDisplay={
              columns.some((column) => column.filter) ? "row" : undefined
            }
            dataKey="id"
            paginator
            first={lazyState.first}
            rows={lazyState.rows}
            totalRecords={totalRecords}
            onPage={onPage}
            onSort={onSort}
            sortField={lazyState.sortField}
            sortOrder={lazyState.sortOrder}
            onFilter={onFilter}
            filters={lazyState.filters}
            loading={loading}
            selection={selectedRows}
            onRowDoubleClick={(event) => {
              if (onRowDoubleClick) {
                onRowDoubleClick(event)
              } else if (eventEdit) {
                setRow(event.data as Model)
                eventEdit(event.data as Model)
              }
            }}
            selectionMode={"multiple"}
            onSelectionChange={(e: any) => {
              if (Array.isArray(e.value)) {
                setSelectedRows(e.value)
              }
            }}
            paginatorClassName="dark:bg-darkblack-600"
            rowsPerPageOptions={[100, 500, 1000, 5000, 10000]}
            paginatorTemplate={DataTablePaginator({
              goToPage,
              currentPage,
              setCurrentPage,
            })}
            paginatorLeft
            header={
              <DataTableFilter<Model>
                FiltersFormTemplate={FiltersFormTemplate}
              />
            }
            expandedRows={expandedRows}
            onRowToggle={onRowToggle}
            onRowExpand={onRowExpand}
            onRowCollapse={onRowCollapse}
            rowExpansionTemplate={rowExpansionTemplate}
          >
            <Column selectionMode="multiple" headerStyle={{ width: "3rem" }} />
            {columns.map((column, idx) => (
              <Column key={`column-${idx}`} {...column} />
            ))}
            {showStatusSwitch && statusRequest && (
              <Column
                field="status"
                header="Status"
                sortable
                body={statusSwitchTemplate}
                align="center"
              />
            )}
            <Column
              body={(rowData: Model) => (
                <DataTableRowMenuButton<Model>
                  rowData={rowData}
                  setRow={setRow}
                  menuRefRow={menuRefRow}
                />
              )}
              exportable={false}
              style={{ width: "20px" }}
            />
          </DataTable>
        </div>
      </DataTableLayout>
    </>
  )
}
