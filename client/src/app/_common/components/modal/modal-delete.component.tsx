import { Dialog, DialogProps } from 'primereact/dialog'
import { CircleButton } from '../button/circle-button.component'

export const ModalDelete = ({
  visible,
  onHide,
  header = 'Confirm',
  eventConfirm,
  loading = false,
  ...props
}: DialogProps & { eventConfirm: (params?: any) => void; loading?: boolean }) => {
  const deleteDialogFooter = (
    <div className="flex gap-5 justify-end">
      <CircleButton type="button" label="Cancel" outlined onClick={() => onHide()} iconClass="pi pi-times" />
      <CircleButton
        type="button"
        label="Delete"
        iconClass="pi pi-trash"
        bgClass="bg-error-50"
        textClass="text-error-300"
        loading={loading}
        onClick={() => eventConfirm()}
      />
    </div>
  )

  return (
    <Dialog
      visible={visible}
      style={{ width: '32rem', filter: 'drop-shadow(rgba(0, 0, 0, 0.08) 12px 12px 40px)' }}
      breakpoints={{ '960px': '75vw', '641px': '90vw' }}
      header={header}
      modal
      footer={deleteDialogFooter}
      onHide={onHide}
      {...props}
    >
      <div className="confirmation-content flex justify-start content-center">
        <i className="pi pi-exclamation-triangle text-warning-300 mr-3" style={{ fontSize: '2rem' }} />
        <span className="w-full pt-1 text-center dark:text-gray-300">{props.children}</span>
      </div>
    </Dialog>
  )
}
