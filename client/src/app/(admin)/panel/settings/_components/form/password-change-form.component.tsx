import { Col, Row } from '@/app/_common/components/grid-layout'
import { InputText, Password } from '@/app/_common/components/inputs'
import { User } from '@/app/_common/models'
import { useForm } from 'react-hook-form'
import { UserService } from '../../_services/user.service'
import { ReactNode, useEffect, useRef, useState } from 'react'
import { Toast } from 'primereact/toast'
import { handleError } from '@/app/_common/errors/handleError'
import { MessageError } from '@/app/_common/components/message/error-message.component'
import { Button } from '@/app/_common/components/button/button.component'

function PasswordChangeForm() {
  const { control, reset, handleSubmit, setValue } = useForm<any>()
  const [error, setError] = useState<string | ReactNode[]>('')
  const [loading, setLoading] = useState(false)
  const toast = useRef<Toast>(null)

  useEffect(() => {
    reset()
    const fields = ['password', 'passwordOld', 'passwordConfirm']
    for (const key of fields) {
      setValue(key as string, '')
    }
  }, [control, setValue])

  async function changePassword(params: { password: string; passwordConfirm: string; passwordOld: string }) {
    setError('')
    setLoading(true)
    const saved = await UserService.changePassword(params).catch(res => handleError(res))
    if ('error' in saved) {
      setError(saved.error)
    } else {
      toast?.current?.show({ severity: 'success', summary: 'Successful', detail: 'Record Saved', life: 3000 })
    }
    setLoading(false)
  }

  return (
    <form onSubmit={handleSubmit(changePassword)} className="mt-6">
      <Row>
        <Col addClassName="sm:col-span-12">
          <Password label={'Old password'} name="passwordOld" autoComplete="off" control={control} toggleMask={true} />
        </Col>
      </Row>
      <Row>
        <Col addClassName="sm:col-span-12">
          <Password label={'New password'} name="password" control={control} toggleMask={true} />
          <small className="text-xs text-bgray-500 dark:text-darkblack-300 block mt-1">Minimum 8 characters</small>
        </Col>
      </Row>
      <Row>
        <Col addClassName="sm:col-span-12">
          <Password label={'Confirm New Password'} name="passwordConfirm" control={control} toggleMask={true} />
        </Col>
      </Row>
      <MessageError error={error} />
      <Toast ref={toast} />
      <Row>
        <Col addClassName="sm:col-span-12 flex justify-end">
          {' '}
          <Button loading={loading}>Save Changes</Button>
        </Col>
      </Row>
    </form>
  )
}

export default PasswordChangeForm
