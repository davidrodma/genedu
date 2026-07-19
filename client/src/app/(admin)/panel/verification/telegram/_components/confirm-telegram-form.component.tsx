"use client"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { ReactNode, useEffect, useState } from "react"
import { Button } from "@/app/_common/components/button/button.component"
import Link from "next/link"
import { InputText } from "@/app/_common/components/inputs"
import { MessageError } from "@/app/_common/components/message/error-message.component"
import { _routes } from "@/app/(admin)/_configs/_routes"
import { UserService } from "../../../settings/_services/user.service"
import { User } from "@/app/_common/models"
const messageTelegram = `Confirm your Telegram by clicking the "Confirm Telegram" button and click the "Start" button or write "ok" in Telegram. Once
          you've done this, go back to this page and click the "Already done" button!`
export default function ConfirmTelegramForm() {
  const { register, control, handleSubmit } = useForm()
  const [error, setError] = useState<string | ReactNode>("")
  const [loading, setLoading] = useState(false)
  const [user, setUser] = useState<User>()
  const [botLinkTelegram, setBotLinkTelegram] = useState<string>("")
  const router = useRouter() // Inicialize o useRouter
  useEffect(() => {
    setLoading(true)
    UserService.checkVerified().then((current) => {
      setUser(current.user)
      setBotLinkTelegram(current.botLinkTelegram)
      setLoading(false)
    })
  }, [])
  async function confirmTelegram(data?: any) {
    setError("")
    setLoading(true)
    UserService.checkVerified().then((current) => {
      setUser(current.user)
      setBotLinkTelegram(current.botLinkTelegram)
      setLoading(false)
      if (!current.user.isVerified) {
        setError(
          `Your Telegram username "${current.user.telegram}" has not been confirmed. ${messageTelegram}.`
        )
      } else {
        router.push(_routes.dashboard)
      }
    })
  }

  return (
    <div className="max-w-[800px] m-auto pt-24 pb-16 px-5">
      <header className="text-center mb-8">
        <h2 className="text-bgray-900 dark:text-white text-4xl font-semibold font-poppins mb-2">
          Telegram Verification
        </h2>
        <p className="font-urbanis text-base font-medium text-bgray-600 dark:text-darkblack-300">
          {messageTelegram}
        </p>
      </header>
      <form
        onSubmit={handleSubmit(confirmTelegram)}
        className="min-h-full flex flex-col"
      >
        <div className="flex items-center justify-center mb-1 gap-4">
          <InputText
            name="telegram"
            value={user?.telegram}
            control={control}
            disabled
          />
          <Link href={botLinkTelegram} target="_blank">
            <Button
              type="button"
              sizeCustom="full"
              loading={loading}
              addClassName="!bg-[#1da1f2] rounded-3xl whitespace-nowrap"
            >
              <i className="pi pi-telegram text-2xl"></i> Confirm Telegram
            </Button>
          </Link>
        </div>
        <p className="text-bgray-900 dark:text-bgray-50 text-base font-medium pb-7">
          Do you want to change your Telegram?{" "}
          <Link href={_routes.settings} className="font-semibold underline">
            Settings
          </Link>
        </p>
        <MessageError error={error} />
        <Button sizeCustom="full" loading={loading}>
          Already done
        </Button>
      </form>
      {/* Form Bottom  */}
    </div>
  )
}
