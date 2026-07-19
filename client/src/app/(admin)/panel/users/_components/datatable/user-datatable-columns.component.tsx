import { useDataTableCustomContext } from "@/app/_common/components/datatable"
import { Role } from "@/app/_common/models/user/role.enum"
import { User } from "@/app/_common/models/user/user.model"
import { DateTime } from "@/app/_common/utilities/datetime.utility"
import { FilterMatchMode } from "primereact/api"
import { ColumnProps } from "primereact/column"
import { useEffect } from "react"
type Model = User & { passwordConfirm?: string }

const roleTemplate = (rowData: Model) => {
  return (
    <span
      className={`${
        rowData.role.includes(Role.USER) ? "bg-bamber-50" : "bg-error-50"
      } dark:bg-darkblack-500 rounded-lg text-sm ${
        rowData.role.includes(Role.USER) ? "text-bamber-500" : "text-error-300"
      } font-medium text-am px-3 py-1`}
    >
      {rowData.role}
    </span>
  )
}

export const Columns = () => {
  const { hiddenColumns, setHiddenColumns } = useDataTableCustomContext<Model>()

  useEffect(() => {
    setHiddenColumns({
      id: true,
      updatedAt: true,
      address: true,
    })
  }, [setHiddenColumns])

  const columns: ColumnProps[] = [
    {
      field: "id",
      header: "ID",
      sortable: true,
      filter: true,
      filterPlaceholder: "Search",
      filterMatchMode: FilterMatchMode.EQUALS,
      filterField: "id",
      hidden: hiddenColumns?.id,
    },
    {
      field: "name",
      header: "Name",
      body: (rowData: Model) => <b>{rowData.name}</b>,
      sortable: true,
      filter: true,
      filterPlaceholder: "Search",
      filterMatchMode: FilterMatchMode.CONTAINS,
      filterField: "name",
    },
    {
      field: "email",
      header: "Email",
      sortable: true,
      filter: true,
      filterPlaceholder: "Search",
      filterMatchMode: FilterMatchMode.CONTAINS,
      filterField: "email",
    },
    {
      field: "telegram",
      header: "Telegram",
      sortable: true,
      filter: true,
      filterPlaceholder: "Search",
      filterMatchMode: FilterMatchMode.CONTAINS,
      filterField: "telegram",
      body: (rowData: Model) => (
        <>
          {rowData.telegram}{" "}
          {rowData.isVerified ? (
            <i className="pi pi-check-circle text-success-400"></i>
          ) : (
            ""
          )}
        </>
      ),
    },
    {
      field: "createdAt",
      sortable: true,
      header: "Created At",
      body: (rowData: Model) => DateTime.dateTemplate(rowData.createdAt),
    },
    {
      field: "updatedAt",
      sortable: true,
      header: "Updated At",
      align: "center",
      hidden: hiddenColumns?.updatedAt,
      body: (rowData: Model) => DateTime.dateTemplate(rowData.updatedAt),
    },
    {
      field: "role",
      header: "Role",
      sortable: true,
      body: (rowData: Model) => roleTemplate(rowData),
    },
  ]
  return columns
}
