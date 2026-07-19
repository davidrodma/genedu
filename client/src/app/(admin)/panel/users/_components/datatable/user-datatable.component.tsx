"use client"
import {
  DataTableCustom,
  useDataTableCustomContext,
} from "@/app/_common/components/datatable"
import { Columns } from "./user-datatable-columns.component"
import { UserService } from "../../_services/user.service"
import { Modal } from "@/app/_common/components/modal/modal.component"
import { UserForm } from "../form/user-form.component"
import { useEffect, useRef, useState } from "react"
import { User } from "@/app/_common/models/user/user.model"
import { FiltersForm } from "./user-datatable-filters-form.component"
import { useHeaderContext } from "@/app/_common/contexts/header.context"
import { Toast } from "primereact/toast"

type Model = User & { passwordConfirm?: string }

export const UserDatatable = () => {
  const { setHeaderInfo } = useHeaderContext()
  const toast = useRef<Toast>(null)

  useEffect(() => {
    setHeaderInfo("Users", "Who can have access to the system")
  }, [setHeaderInfo])

  const [formDialog, setFormDialog] = useState<boolean>(false)
  const { row, setRow } = useDataTableCustomContext<Model>()

  const openNew = () => {
    setRow(undefined)
    setFormDialog(true)
  }

  const openEdit = (row: Model) => {
    setRow({
      ...row,
      password: "",
      passwordConfirm: "",
    })
    setFormDialog(true)
  }

  return (
    <>
      <Toast ref={toast} />
      <DataTableCustom<Model>
        columns={Columns()}
        paginateRequest={UserService.paginate}
        statusRequest={UserService.status}
        deleteRequest={UserService.delete}
        eventNew={openNew}
        eventEdit={openEdit}
        FiltersFormTemplate={<FiltersForm />}
      />
      <Modal
        visible={formDialog}
        header="User Details"
        onHide={() => setFormDialog(false)}
      >
        <UserForm setFormDialog={setFormDialog} model={row} toast={toast} />
      </Modal>
    </>
  )
}
