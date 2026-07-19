"use client"
import Link from "next/link"
import { Button } from "@/app/_common/components/button/button.component"
import { ReactNode, useState } from "react"
import { MessageError } from "@/app/_common/components/message/error-message.component"
import { _routes } from "@/app/(admin)/_configs/_routes"
import { ModalParams } from "./types/modal-params.type"
import { getRecoveryCode } from "@/app/_common/services"
import { CrossBtn, HeadingLogo } from "./heading-logo.component"

export const ResetPass = ({
  close,
  handelModalData,
  telegram,
  setTelegram,
}: ModalParams) => {
  const [error, setError] = useState<string | ReactNode>("")
  const [loading, setLoading] = useState(false)
  const [botLinkTelegram, setBotLinkTelegram] = useState("")

  const getCode = async () => {
    setLoading(true)
    setError("")
    setBotLinkTelegram("")
    const resp = await getRecoveryCode(telegram)
    if (resp?.error) {
      setError(resp.error)
      if (resp?.botLinkTelegram) {
        setBotLinkTelegram(resp.botLinkTelegram)
      }
    } else if (resp.success) {
      handelModalData("verify")
    }
    setLoading(false)
  }

  return (
    <div className="step-content step-1">
      {/* My Content  */}
      <div className="relative max-w-[492px] transform overflow-hidden rounded-lg bg-white dark:bg-darkblack-600 p-8 text-left transition-all">
        <CrossBtn close={close} />
        <div>
          <HeadingLogo />
          <h3 className="text-2xl font-bold text-bgray-900 dark:text-white mb-3">
            Reset your password
          </h3>
          <p className="text-base font-medium text-bgray-600 dark:text-darkblack-300 mb-7">
            Enter the Telegram username associated with your account and
            we&apos;ll send you password recovery code.
          </p>
          <form action="">
            <div className="mb-8">
              <input
                type="text"
                className="rounded-lg bg-[#F5F5F5] dark:bg-darkblack-500 dark:text-white p-4 border-0 focus:border focus:ring-0 focus:border-success-300 w-full placeholder:font-medium text-base h-14"
                placeholder="@Telegram"
                onChange={(e) => setTelegram(e.target.value)}
              />
            </div>
            <button
              onClick={close}
              type="button"
              className="block text-sm font-bold text-success-300 mb-8 underline"
            >
              Return to login
            </button>
            <MessageError error={error} />
            {botLinkTelegram != "" && (
              <Link href={botLinkTelegram} target="_blank">
                <Button
                  type="button"
                  sizeCustom="full"
                  loading={loading}
                  addClassName="!bg-[#1da1f2] rounded-3xl whitespace-nowrap mb-5"
                >
                  <i className="pi pi-telegram text-2xl"></i> Confirm Telegram
                </Button>
              </Link>
            )}
            <Button
              aria-label="none"
              type="button"
              loading={loading}
              onClick={() => getCode()}
              id="step-1-next"
              sizeCustom="full"
              className="flex w-full py-4 text-white bg-success-300 hover:bg-success-400 transition-all justify-center text-base font-medium rounded-lg"
            >
              Continue
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}
