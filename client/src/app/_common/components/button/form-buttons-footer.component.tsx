import { CircleButton } from './circle-button.component'
import { ReactNode } from 'react'
import { MessageError } from '../message/error-message.component'

export const FormButtonsFooter = ({
  loading = false,
  error,
  cancelEvent,
}: {
  loading?: boolean
  error?: string | ReactNode
  cancelEvent?: (params?: any) => void
}) => {
  return (
    <div className="p-dialog-footer pb-0 pt-0 px-0" style={{ marginTop: 'auto' }} data-pc-section="footer">
      <MessageError error={error} />
      <div className="flex gap-5 justify-end">
        {cancelEvent && (
          <CircleButton label="Cancel" type="button" onClick={() => cancelEvent()} iconClass="pi pi-times" />
        )}
        <CircleButton
          label="Save"
          type="submit"
          iconClass="pi pi-check"
          bgClass="bg-success-50"
          textClass="text-success-400"
          loading={loading}
        />
      </div>
    </div>
  )
}
