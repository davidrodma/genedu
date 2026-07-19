import { Dialog, DialogProps } from "primereact/dialog"

export const Modal = ({ visible, onHide, header, ...props }: DialogProps) => {
  return (
    <Dialog
      visible={visible}
      header={header}
      modal
      maximizable
      className="p-fluid w-[100vw] sm:w-[75vw] xl:w-[40vw]"
      onHide={onHide}
      {...props}
    >
      {props.children}
    </Dialog>
  )
}
