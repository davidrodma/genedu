import { InputText, Password, Radio } from "@/app/_common/components/inputs"
import { Col, Row } from "@/app/_common/components/grid-layout"
import { User } from "@/app/_common/models/user/user.model"
import { ReactNode, RefObject, useEffect, useRef, useState } from "react"
import { useForm } from "react-hook-form"
import { UserService } from "../../_services/user.service"
import { handleError } from "@/app/_common/errors/handleError"
import { Role } from "@/app/_common/models/user/role.enum"
import { Toast } from "primereact/toast"
import { FormButtonsFooter } from "@/app/_common/components/button/form-buttons-footer.component"
import { useDataTableCustomContext } from "@/app/_common/components/datatable"

type Model = User & { passwordConfirm?: string }

const emptyModel: Model = {
  id: "",
  name: "",
  email: "",
  telegram: "",
  password: undefined,
  role: Role.USER,
  createdAt: new Date(),
  updatedAt: new Date(),
  isVerified: false,
  chatId: "",
  status: 1,
  passwordConfirm: undefined,
}

export const UserForm = ({
  setFormDialog,
  model = emptyModel,
  toast,
  ...props
}: {
  setFormDialog: (open: boolean) => void
  model?: Model
  toast?: RefObject<Toast | null>
}) => {
  const roles = Object.keys(Role).map((key) => {
    return {
      label: key,
      key: (Role as { [k: string]: string })[key],
    }
  })

  const { rows, setRows } = useDataTableCustomContext<Model>()
  const { control, handleSubmit, reset, setValue } = useForm<Model>()
  const [error, setError] = useState<string | ReactNode>("")
  const [formData, setFormData] = useState({ ...model, passwordConfirm: "" })
  const [disabledEmail, setDisabledEmail] = useState(!!model.id)
  const [disabledTelegram, setDisabledTelegram] = useState(!!model.id)
  const [disabledPassword, setDisabledPassword] = useState(!!model.id)
  const [loading, setLoading] = useState<boolean>(false)
  const modelInit = useRef<Model>(model)

  useEffect(() => {
    reset()
    setError("")
    if (modelInit.current?.id) {
      setFormData({
        ...modelInit.current,
        password: "",
        passwordConfirm: "",
      })
      setValue("id", modelInit.current.id, { shouldValidate: true })
      setDisabledEmail(!!modelInit.current.id)
      setDisabledPassword(!!modelInit.current.id)
    } else {
      setFormData({ ...emptyModel, passwordConfirm: "" })
      setDisabledEmail(false)
      setDisabledPassword(false)
    }
  }, [reset, setValue])

  async function save(params: Model) {
    setError("")
    setLoading(true)
    const data = {
      id: params.id,
      name: params.name,
      email: params.email,
      telegram: params.telegram,
      role: params.role,
      password: params.password || undefined,
      passwordConfirm: params.passwordConfirm || undefined,
    }
    const saved = await UserService.save(data).catch((res) => handleError(res))
    if ("error" in saved || !saved?.id) {
      setError("error" in saved ? saved.error : "no results")
    } else {
      toast?.current?.show({
        severity: "success",
        summary: "Successful",
        detail: "Record Saved",
        life: 3000,
      })
      if (params?.id) {
        const index = rows.findIndex((u) => u.id == params.id)
        rows[index] = saved
        setRows([...rows])
      } else {
        setRows([saved, ...rows])
      }
      setFormDialog(false)
    }
    setLoading(false)
  }

  const IconEditField = ({
    field,
  }: {
    field: "email" | "password" | "telegram"
  }) => {
    return ((field == "email" && disabledEmail) ||
      (field == "password" && disabledPassword) ||
      (field == "telegram" && disabledTelegram)) &&
      !!formData.id ? (
      <i
        className="pi pi-pencil cursor-pointer z-10"
        onClick={(e) => {
          field == "email"
            ? setDisabledEmail(false)
            : field == "telegram"
            ? setDisabledTelegram(false)
            : setDisabledPassword(false)
          setValue(field, formData[field])
        }}
      />
    ) : (
      !!formData.id && (
        <i
          className="pi pi pi-times cursor-pointer z-10"
          onClick={(e) => {
            field == "email"
              ? setDisabledEmail(true)
              : field == "telegram"
              ? setDisabledTelegram(true)
              : setDisabledPassword(true)
            setValue(field, formData[field])
          }}
        />
      )
    )
  }

  return (
    <form onSubmit={handleSubmit(save)} className="min-h-full flex flex-col">
      <Row>
        <Col addClassName="sm:col-span-6">
          <InputText
            label={"Name"}
            name="name"
            autoFocus
            value={formData.name}
            defaultValue={formData.name}
            control={control}
          />
        </Col>
        <Col addClassName="sm:col-span-6">
          <InputText
            label={"Email"}
            name="email"
            keyfilter="email"
            value={formData.email}
            defaultValue={formData.email}
            control={control}
            disabled={disabledEmail}
            iconInput={<IconEditField field={"email"} />}
          />
        </Col>
      </Row>
      <Row>
        <Col addClassName="sm:col-span-6">
          <Password
            label={"Password"}
            name="password"
            value={formData?.password || ""}
            defaultValue={formData?.password || ""}
            control={control}
            disabled={disabledPassword}
            iconInput={<IconEditField field={"password"} />}
            toggleMask={!!!formData.id}
          />
        </Col>
        <Col addClassName="sm:col-span-6">
          <Password
            label={"Password Confirm"}
            name="passwordConfirm"
            value={formData?.passwordConfirm || ""}
            defaultValue={formData?.passwordConfirm || ""}
            control={control}
            disabled={disabledPassword}
            toggleMask={!!!formData.id}
          />
        </Col>
      </Row>
      <Row>
        <Col addClassName="sm:col-span-6">
          <InputText
            label={"Telegram"}
            name="telegram"
            value={formData?.telegram}
            defaultValue={formData?.telegram}
            control={control}
            disabled={disabledTelegram}
            iconInput={<IconEditField field={"telegram"} />}
          />
          <small className="text-xs text-bgray-500 dark:text-darkblack-300 block mt-1">
            Requires confirmation on Telegram
          </small>
        </Col>
      </Row>
      <Row>
        <Col>
          <Radio
            items={roles}
            checkedItem={formData?.role}
            control={control}
            label="Role"
            name="role"
          />
        </Col>
      </Row>
      <FormButtonsFooter
        loading={loading}
        error={error}
        cancelEvent={() => setFormDialog(false)}
      />
    </form>
  )
}
