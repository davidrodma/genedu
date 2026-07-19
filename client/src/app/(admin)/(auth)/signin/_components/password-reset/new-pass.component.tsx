import { ReactNode, useState } from 'react'
import { ModalParams } from './types/modal-params.type'
import { changeRecoveryPassword } from '@/app/_common/services'
import { CrossBtn, HeadingLogo } from './heading-logo.component'
import { Password } from '@/app/_common/components/inputs'
import { MessageError } from '@/app/_common/components/message/error-message.component'
import { Button } from '@/app/_common/components/button/button.component'

export const NewPass = ({ close, handelModalData, telegram, code }: ModalParams) => {
  const [error, setError] = useState<string | ReactNode>('')
  const [password, setPassword] = useState<string>('')
  const [passwordConfirm, setPasswordConfirm] = useState<string>('')
  const [loading, setLoading] = useState(false)

  const changePassword = async () => {
    setLoading(true)
    setError('')
    const resp = await changeRecoveryPassword({ telegram, code, password, passwordConfirm })
    if (resp?.error) {
      setError(resp.error)
    } else if (resp.success) {
      handelModalData('success')
    }
    setLoading(false)
  }

  return (
    <div className="step-content step-3">
      {/* Step 3 Content Here */}
      <div className="relative  transform overflow-hidden rounded-lg bg-white dark:bg-darkblack-600 p-8 text-left transition-all">
        <CrossBtn close={close} />
        <div>
          <HeadingLogo />
          <h3 className="text-2xl font-bold text-bgray-900 dark:text-white mb-3">Create new password</h3>
          <p className="text-base font-medium text-bgray-600 dark:text-darkblack-300 mb-7">
            Please enter a new password. Your new password must be different from previous password.
          </p>
          <form action="">
            <div className="mb-6 relative">
              <Password
                placeholder={'* Password'}
                name="password"
                toggleMask
                className="w-full rounded-lg border border-bgray-300"
                addClassName="!bg-white shadow-none"
                value={password}
                onChange={e => setPassword(e.target.value)}
              />
            </div>
            <div className="mb-6 relative">
              <Password
                placeholder={'* Password Confirm'}
                name="passwordConfirm"
                toggleMask
                className="w-full rounded-lg border border-bgray-300"
                addClassName="!bg-white shadow-none"
                value={passwordConfirm}
                onChange={e => setPasswordConfirm(e.target.value)}
              />
            </div>
            <MessageError error={error} />
            <Button
              aria-label="none"
              type="button"
              loading={loading}
              sizeCustom="full"
              onClick={() => changePassword()}
              id="step-2-next"
              className="flex w-full py-4 text-white bg-success-300 hover:bg-success-400 transition-all justify-center text-base font-medium rounded-lg"
            >
              Confirm Password
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}
