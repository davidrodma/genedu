"use client"
import { Toolbar } from "primereact/toolbar"
import { CircleButton } from "../button/circle-button.component"
import { Button } from "primereact/button"
import { Menu } from "primereact/menu"
import { ReactNode, useRef, useState } from "react"
import { MenuItem } from "primereact/menuitem"
import { DataTable, DataTableValue } from "primereact/datatable"
import { ModalDelete } from "../modal/modal-delete.component"
import { Dialog } from "primereact/dialog"
import { Select } from "../inputs"
import { useDataTableCustomContext } from "./contexts/datatable-custom.context"

export const DataTableToolbar = <Model extends DataTableValue>({
  eventNew,
  eventStatus,
  eventConfirmDelete,
  eventRefresh,
  itemsMenuRight = [],
  addItemsMenuRight = [],
  dt,
  questionDelete,
  loading = false,
  newStatus,
  setNewStatus,
  statusArray,
  ...props
}: {
  eventNew?: (params?: any) => void
  eventStatus?: (params?: any) => Promise<void>
  eventConfirmDelete?: (params?: any) => Promise<void>
  eventRefresh?: (params?: any) => void
  itemsMenuRight?: MenuItem[]
  addItemsMenuRight?: MenuItem[]
  dt?: React.RefObject<DataTable<Model[]> | null>
  questionDelete?: string | ReactNode
  loading?: boolean
  newStatus?: any
  setNewStatus?: (status: any) => void
  statusArray?: {
    key: any
    label: string
  }[]
}) => {
  const menuTopRight = useRef(null)
  const [deleteRowsDialog, setDeleteRowsDialog] = useState<boolean>(false)
  const [statusSelectedsDialog, setStatusSelectedsDialog] =
    useState<boolean>(false)
  const { hiddenColumns, setHiddenColumns, selectedRows } =
    useDataTableCustomContext<Model>()

  const exportCSV = (selectionOnly: boolean) => {
    if (dt?.current) {
      dt.current.exportCSV({ selectionOnly })
    }
  }

  if (!itemsMenuRight?.length) {
    itemsMenuRight = [
      {
        label: "Options",
        items: [],
      },
    ]
    if (hiddenColumns) {
      itemsMenuRight[0]?.items?.push({
        label: "Hidden Columns",
        icon: `pi ${
          hiddenColumns && Object.values(hiddenColumns)[0]
            ? "pi-eye"
            : "pi-eye-slash"
        }`,
        command: () => {
          const copyHidden = { ...hiddenColumns }
          Object.keys(copyHidden).map(
            (column) =>
              ((copyHidden as any)[column] = !(copyHidden as any)[column])
          )
          setHiddenColumns(copyHidden)
        },
      } as any)
    }
    itemsMenuRight[0]?.items?.push({
      label: "Export",
      icon: "pi pi-upload",
      command: () => {
        exportCSV(selectedRows?.length ? true : false)
      },
    } as any)
  }
  itemsMenuRight = addItemsMenuRight?.length
    ? [...itemsMenuRight, ...addItemsMenuRight]
    : itemsMenuRight

  const leftToolbarTemplate = () => {
    return (
      <div className="flex flex-wrap gap-5">
        {eventNew && (
          <CircleButton
            label="New"
            onClick={eventNew}
            iconClass="pi pi-plus"
            bgClass="bg-success-50"
            textClass="text-success-400"
          />
        )}
        {eventStatus && (
          <CircleButton
            label="Status"
            onClick={() => {
              if (setNewStatus) {
                setNewStatus(null)
                setStatusSelectedsDialog(true)
              }
            }}
            iconClass="pi pi-exclamation-triangle"
            bgClass="bg-warning-50"
            textClass="text-warning-300"
            disabled={!selectedRows || !selectedRows.length}
          />
        )}
        {eventConfirmDelete && (
          <CircleButton
            label="Delete"
            onClick={() => setDeleteRowsDialog(true)}
            iconClass="pi pi-trash"
            bgClass="bg-error-50"
            textClass="text-error-300"
            disabled={!selectedRows || !selectedRows.length}
          />
        )}
        {eventRefresh && (
          <CircleButton
            label="Refresh"
            onClick={eventRefresh}
            iconClass="pi pi-refresh"
          />
        )}
      </div>
    )
  }

  const rightToolbarTemplate = () => {
    return (
      itemsMenuRight?.length && (
        <div className="flex items-center space-x-3">
          <Menu
            model={itemsMenuRight}
            popup
            ref={menuTopRight}
            id="popup_menu_right"
            popupAlignment="right"
            className="w-60"
          />
          <Button
            icon="pi pi-ellipsis-h"
            className="p-button-help"
            onClick={(event) => (menuTopRight?.current as any)?.toggle(event)}
            aria-controls="popup_menu_right"
            aria-haspopup
          />
        </div>
      )
    )
  }

  const statusSelectedsDialogFooter = (
    <div className="flex gap-5 justify-end">
      <CircleButton
        label="Cancel"
        type="button"
        outlined
        onClick={() => setStatusSelectedsDialog(false)}
        iconClass="pi pi-times"
      />
      {eventStatus && (
        <CircleButton
          label="Change"
          iconClass="pi pi-check"
          bgClass="bg-success-50"
          type="button"
          textClass="text-success-400"
          disabled={newStatus === null}
          loading={loading}
          onClick={() =>
            eventStatus().then(() => setStatusSelectedsDialog(false))
          }
        />
      )}
    </div>
  )

  return (
    <>
      <Toolbar
        className="rounded-t-lg rounded-b-[0] border-b bg-white border-bgray-300 px-[26px] py-[26px] dark:border-darkblack-400 dark:bg-darkblack-600  dark:text-white"
        start={leftToolbarTemplate}
        end={rightToolbarTemplate}
      />
      {eventConfirmDelete && (
        <ModalDelete
          visible={deleteRowsDialog}
          onHide={() => setDeleteRowsDialog(false)}
          eventConfirm={() => {
            eventConfirmDelete().then(() => setDeleteRowsDialog(false))
          }}
          loading={loading}
        >
          {questionDelete ? (
            questionDelete
          ) : (
            <>
              Are you sure you want to delete the <b>{selectedRows?.length}</b>{" "}
              selected registers?
            </>
          )}
        </ModalDelete>
      )}
      {setNewStatus && statusArray && (
        <Dialog
          visible={statusSelectedsDialog}
          style={{ width: "32rem" }}
          breakpoints={{ "960px": "75vw", "641px": "90vw" }}
          header="Change Status"
          modal
          footer={statusSelectedsDialogFooter}
          onHide={() => setStatusSelectedsDialog(false)}
        >
          <div className="confirmation-content">
            <div className="text-sm pb-2 text-right">
              <b>{selectedRows?.length}</b> selected registers
            </div>
            <Select
              items={statusArray}
              label="Status"
              name="status"
              value={newStatus}
              onChange={(e) => setNewStatus(e.value)}
            />
          </div>
        </Dialog>
      )}
    </>
  )
}
