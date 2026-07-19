'use client'
import { DataTableCustom, useDataTableCustomContext } from '@/app/_common/components/datatable'
import { Columns } from './config-datatable-columns.component'
import { Modal } from '@/app/_common/components/modal/modal.component'
import { ConfigForm } from '../form/config-form.component'
import { ConfigSimpleForm } from '../form/config-simple-form.component'
import { useState } from 'react'
import { FiltersForm } from './config-datatable-filters-form.component'
import { Config } from '@/app/_common/models'
import { ConfigService } from '../../_services/config.service'

type Model = Config

export const ConfigDatatable = () => {
  const [formDialog, setFormDialog] = useState<boolean>(false)
  const [formSimpleDialog, setFormSimpleDialog] = useState<boolean>(false)
  const { row, setRow } = useDataTableCustomContext<Model>()

  const openNew = () => {
    setRow(undefined)
    setFormDialog(true)
  }

  const openCustomize = (row: Model) => {
    setRow({
      ...row,
    })
    setFormDialog(true)
  }

  const openEdit = (row: Model) => {
    setRow({
      ...row,
    })
    setFormSimpleDialog(true)
  }

  return (
    <>
      <DataTableCustom<Model>
        columns={Columns()}
        paginateRequest={ConfigService.paginate}
        statusRequest={ConfigService.status}
        deleteRequest={ConfigService.delete}
        eventNew={openNew}
        eventEdit={openEdit}
        FiltersFormTemplate={<FiltersForm />}
        addMenusRow={[
          {
            label: 'Customize',
            icon: 'pi pi-cog',
            command: () => {
              if (row) {
                openCustomize(row)
              }
            },
          },
        ]}
      />
      <Modal visible={formDialog} header="Custom Configuration" onHide={() => setFormDialog(false)}>
        <ConfigForm setFormDialog={setFormDialog} model={row} />
      </Modal>
      <Modal visible={formSimpleDialog} header="Configuration" onHide={() => setFormSimpleDialog(false)}>
        <ConfigSimpleForm setFormDialog={setFormSimpleDialog} model={row} />
      </Modal>
    </>
  )
}
