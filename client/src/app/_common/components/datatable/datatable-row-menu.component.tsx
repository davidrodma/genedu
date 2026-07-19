"use client"

import { Menu } from "primereact/menu"
import { MenuItem } from "primereact/menuitem"
import React, { ReactNode, useState } from "react"
import { ModalDelete } from "../modal/modal-delete.component"

export const DataTableRowMenu = <Model extends Object = any>({
  row,
  menuRefRow,
  eventEdit,
  menus,
  addMenusRow,
  eventConfirmDelete,
  loading = false,
  questionDelete = "Are you sure you want to delete the record?",
}: {
  menuRefRow: React.RefObject<Menu | null>
  row?: Model
  eventEdit?: (row: Model) => void
  menus?: MenuItem[]
  addMenusRow?: MenuItem[]
  eventConfirmDelete?: (params?: any) => Promise<void>
  loading?: boolean
  questionDelete?: string | ReactNode
}) => {
  const [deleteRowDialog, setDeleteRowDialog] = useState<boolean>(false)
  let items = menus?.length ? menus : []
  if (!items?.length) {
    if (eventEdit) {
      items.push({
        label: "Edit",
        icon: "pi pi-pencil",
        command: () => {
          if (row) {
            eventEdit(row)
          }
        },
      })
    }
    if (eventConfirmDelete) {
      items.push({
        label: "Delete",
        icon: "pi pi-trash",
        command: () => {
          if (row) {
            setDeleteRowDialog(true)
          }
        },
      })
    }
  }

  items = addMenusRow?.length ? [...items, ...addMenusRow] : items
  return (
    <>
      <Menu
        model={items}
        popup
        ref={menuRefRow}
        id="popup_menu_right"
        popupAlignment="right"
      />
      {eventConfirmDelete && (
        <ModalDelete
          visible={deleteRowDialog}
          onHide={() => setDeleteRowDialog(false)}
          eventConfirm={() => {
            eventConfirmDelete().then(() => setDeleteRowDialog(false))
          }}
          loading={loading}
        >
          {row && <>{questionDelete}</>}
        </ModalDelete>
      )}
    </>
  )
}
