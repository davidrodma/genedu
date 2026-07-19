import { ReactNode, useState } from "react"
import { ModalParams } from "./types/modal-params.type"
import { MessageError } from "@/app/_common/components/message/error-message.component"
import { Button } from "@/app/_common/components/button/button.component"
import { InputNumber } from "@/app/_common/components/inputs"
import { CrossBtn, HeadingLogo } from "./heading-logo.component"
import { checkRecoveryCode } from "@/app/_common/services"
export const CodeVerify = ({
  close,
  handelModalData,
  telegram,
  code,
  setCode,
}: ModalParams) => {
  const [error, setError] = useState<string | ReactNode>("")
  const [loading, setLoading] = useState(false)

  const checkCode = async () => {
    setLoading(true)
    setError("")
    const resp = await checkRecoveryCode(telegram, code)
    if (resp?.error) {
      setError(resp.error)
    } else if (resp.success) {
      handelModalData("newPass")
    }
    setLoading(false)
  }

  return (
    <div className="step-content step-2 ">
      <div className="relative max-w-lg transform overflow-hidden rounded-lg bg-white dark:bg-darkblack-600 p-8 text-left transition-all">
        <CrossBtn close={close} />
        <div>
          <HeadingLogo />
          <h3 className="text-2xl font-bold text-bgray-900 dark:text-white mb-3">
            Enter verification code
          </h3>
          <p className="text-base font-medium text-bgray-600 dark:text-darkblack-300 mb-7">
            We have just sent a verification code to {telegram}
          </p>
          <form>
            <div className="flex space-x-6 mb-8">
              <InputNumber
                placeholder={"Code"}
                name={"code"}
                value={code || undefined}
                onChange={(e) => setCode(e?.value || 0)}
                max={99999999}
                mode="decimal"
              />
            </div>
            <button
              aria-label="none"
              className="block text-sm font-bold text-success-300 mb-8"
              onClick={() => handelModalData("reset")}
            >
              Back
            </button>
            <MessageError error={error} />
            <Button
              aria-label="none"
              type="button"
              onClick={() => checkCode()}
              sizeCustom="full"
              loading={loading}
              id="step-2-next"
              className="flex w-full py-4 text-white bg-success-300 transition-all justify-center text-base font-medium rounded-lg"
            >
              Verify
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}
