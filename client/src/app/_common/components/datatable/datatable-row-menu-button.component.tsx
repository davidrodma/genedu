"use client"

import { Menu } from "primereact/menu"
import React from "react"
import { Button } from "primereact/button"

export const DataTableRowMenuButton = <Model extends Object = any>({
  rowData,
  menuRefRow,
  setRow,
}: {
  menuRefRow: React.RefObject<Menu | null>
  rowData: Model
  setRow: (row: Model) => void
}) => {
  return (
    <React.Fragment>
      <Button
        icon="pi pi-ellipsis-v"
        className="p-button-help w-5 m-0 text-bgray-500"
        onClick={(event) => {
          setRow(rowData)
          menuRefRow?.current?.toggle(event)
        }}
        aria-controls="popup_menu_right"
        aria-haspopup
      />
    </React.Fragment>
  )
}
