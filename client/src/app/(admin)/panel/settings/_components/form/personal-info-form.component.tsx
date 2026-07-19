import { InputText } from "@/app/_common/components/inputs"
import { Col, Row } from "@/app/_common/components/grid-layout"
import { User } from "@/app/_common/models"
import { ReactNode, useEffect, useRef, useState } from "react"
import { useForm } from "react-hook-form"
import { Button } from "@/app/_common/components/button/button.component"

import { handleError } from "@/app/_common/errors/handleError"
import { MessageError } from "@/app/_common/components/message/error-message.component"
import { Toast } from "primereact/toast"
import { useAuthContext } from "@/app/_common/contexts/auth.context"
import { _routes } from "@/app/(admin)/_configs/_routes"
import { UserService } from "../../_services/user.service"

function PersonalInfoForm({ user }: { user?: User }) {
  const { setUser } = useAuthContext()
  const { control, handleSubmit, setValue } = useForm<User>({
    defaultValues: user,
  })
  const [disabledEmail, setDisabledEmail] = useState(true)
  const [disabledTelegram, setDisabledTelegram] = useState(true)
  const [error, setError] = useState<string | ReactNode[]>("")
  const [loading, setLoading] = useState(false)
  const toast = useRef<Toast>(null)

  useEffect(() => {
    if (user) {
      const fields = ["name"]
      for (const key of fields) {
        setValue(key as keyof User, user[key as keyof User])
      }
      if (!user?.telegram) {
        setDisabledTelegram(false)
      }
      if (!user?.email) {
        setDisabledEmail(false)
      }
    }
  }, [user])

  // const { control, handleSubmit, reset, setValue } = useForm<Model>()
  async function save(params: User) {
    setError("")
    setLoading(true)
    const saved = await UserService.update(params).catch((res) =>
      handleError(res)
    )
    if ("error" in saved) {
      setError(saved.error)
    } else if (saved.id) {
      setUser(saved as any)
      toast?.current?.show({
        severity: "success",
        summary: "Successful",
        detail: "Record Saved",
        life: 3000,
      })
      if (!saved.isVerified) {
        window.location.href = _routes.verificationTelegram
      }
    }
    setLoading(false)
  }

  const IconEditField = ({ field }: { field: "email" | "telegram" }) => {
    return (field == "email" && disabledEmail && !!user?.email) ||
      (field == "telegram" && disabledTelegram && !!user?.telegram) ? (
      <i
        className="pi pi-pencil cursor-pointer z-10"
        onClick={(e) => {
          field == "telegram"
            ? setDisabledTelegram(false)
            : setDisabledEmail(false)
          setValue(field, user[field])
        }}
      />
    ) : (
      !!user?.id && (
        <i
          className="pi pi pi-times cursor-pointer z-10"
          onClick={(e) => {
            field == "telegram"
              ? setDisabledTelegram(true)
              : setDisabledEmail(true)
            setValue(field, user[field])
          }}
        />
      )
    )
  }

  return (
    <div className="2xl:col-span-8 xl:col-span-7">
      <h3 className="text-2xl font-bold pb-5 text-bgray-900 dark:text-white dark:border-darkblack-400 border-b border-bgray-200">
        Personal Information&apos;s
      </h3>
      <div className="mt-8">
        <form
          onSubmit={handleSubmit(save)}
          className="min-h-full flex flex-col"
        >
          <Row>
            <Col addClassName="sm:col-span-6">
              <InputText
                label={"Name"}
                name="name"
                value={user?.name ?? ""}
                defaultValue={user?.name ?? ""}
                control={control}
              />
            </Col>
            <Col addClassName="sm:col-span-6">
              <InputText
                label={"Email"}
                name="email"
                keyfilter="email"
                value={user?.email}
                defaultValue={user?.email}
                control={control}
                disabled={disabledEmail}
                iconInput={<IconEditField field={"email"} />}
              />
            </Col>
          </Row>
          <Row>
            <Col addClassName="sm:col-span-6">
              <InputText
                label={"Telegram"}
                name="telegram"
                value={user?.telegram}
                defaultValue={user?.telegram}
                control={control}
                disabled={disabledTelegram}
                iconInput={<IconEditField field={"telegram"} />}
              />
              <small className="text-xs text-bgray-500 dark:text-darkblack-300 block mt-1">
                Requires confirmation on Telegram
              </small>
            </Col>
          </Row>
          <MessageError error={error} />
          <Toast ref={toast} />
          <Row>
            <Col addClassName="sm:col-span-12 flex justify-end">
              {" "}
              <Button loading={loading}>Save Profile</Button>
            </Col>
          </Row>
        </form>
      </div>
    </div>
  )
}

export default PersonalInfoForm
