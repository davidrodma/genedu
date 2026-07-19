"use client"
import { ReactNode, useEffect, useState } from "react"
import { useAuthContext } from "@/app/_common/contexts/auth.context"
import { useForm } from "react-hook-form"
import { handleError } from "@/app/_common/errors/handleError"
import { Button } from "@/app/_common/components/button/button.component"
import Link from "next/link"
import { Password } from "@/app/_common/components/inputs"
import { MessageError } from "@/app/_common/components/message/error-message.component"

import { _routes as _routesUser } from "@/app/(admin)/_configs/_routes"
import PasswordResetModal from "../password-reset/password-reset-modal.component"
import { SocialNetworkSignIn } from "./social-network-signin.component"
import { WEBSITE_TITLE } from "@/app/_common/configs/constants"

type FormInputs = {
  username: string
  password: string
}

export const SignInForm = () => {
  const [modalOpen, setModalOpen] = useState(false)
  const [modalData, setModalData] = useState("")
  const [error, setError] = useState<string | ReactNode>("")
  const [loading, setLoading] = useState(false)
  const { register, handleSubmit, control, getValues, setValue } = useForm()
  const { signIn } = useAuthContext()

  // Lidar com o preenchimento automático do navegador
  useEffect(() => {
    const handleAutoFill = () => {
      // Obter os valores preenchidos automaticamente pelo navegador
      const autoFilledValues = getValues()

      // Atualizar os valores no estado do react-hook-form usando setValue
      Object.keys(autoFilledValues).forEach((fieldName) => {
        const value =
          (
            document.querySelector(
              `input[name="${fieldName}"]`
            ) as HTMLInputElement
          ).value || ""
        setValue(fieldName as keyof FormInputs, value)
      })
    }

    handleAutoFill()

    // Adicionar um ouvinte para o evento 'input' no documento
    document.addEventListener("input", handleAutoFill)

    // Remover o ouvinte quando o componente for desmontado
    return () => {
      document.removeEventListener("input", handleAutoFill)
    }
  }, [setValue, getValues])

  async function handleSignIn(data: any) {
    setLoading(true)
    const response = await signIn(data).catch((res) => handleError(res))
    if (response?.error) {
      setLoading(false)
      setError(response.error)
    }
  }

  return (
    <div className="max-w-[460px] m-auto pt-24 pb-16">
      <header className="text-center mb-8">
        <h2 className="text-bgray-900 dark:text-white text-4xl font-semibold font-poppins mb-2">
          Sign in to {WEBSITE_TITLE}
        </h2>
        <p className="font-urbanis text-base font-medium text-bgray-600 dark:text-bgray-50">
          Send, spend and save smarter
        </p>
      </header>
      <SocialNetworkSignIn />
      <form action="#" method="POST" onSubmit={handleSubmit(handleSignIn)}>
        <div className="mb-4">
          <input
            type="text"
            {...register("email")}
            className="text-bgray-800 text-base border border-bgray-300 dark:border-darkblack-400 dark:bg-darkblack-500 dark:text-white h-14 w-full focus:border-success-300 focus:ring-0 rounded-lg px-4 py-3.5 placeholder:text-bgray-500 placeholder:text-base"
            placeholder="Email"
            autoComplete="on"
          />
        </div>
        <div className="mb-6 relative">
          <Password
            placeholder={"Password"}
            name="password"
            control={control}
            toggleMask
            className="w-full rounded-lg border border-bgray-300"
            addClassName="!bg-white shadow-none"
            autoComplete="on"
          />
        </div>
        <div className="flex justify-between mb-7">
          <div className="flex items-center space-x-3">
            <input
              type="checkbox"
              className="w-5 h-5 dark:bg-darkblack-500 focus:ring-transparent rounded-full border border-bgray-300 focus:accent-success-300 text-success-300"
              name="remember"
              id="remember"
            />
            <label
              htmlFor="remember"
              className="text-bgray-900 dark:text-white text-base font-semibold"
            >
              Remember me
            </label>
          </div>
          <div>
            <a
              onClick={() => setModalOpen(true)}
              data-target="#multi-step-modal"
              className="modal-open text-success-300 font-semibold text-base underline cursor-pointer"
            >
              Forgot Password?
            </a>
          </div>
        </div>
        <MessageError error={error} />
        <Button sizeCustom="full" loading={loading}>
          Sign In
        </Button>
      </form>
      <p className="text-center text-bgray-900 dark:text-bgray-50 text-base font-medium pt-7">
        Don’t have an account?{" "}
        <Link href={_routesUser.signup} className="font-semibold underline">
          Sign Up
        </Link>
      </p>
      <PasswordResetModal
        isActive={modalOpen}
        modalData={modalData}
        handelModalData={setModalData}
        handleActive={setModalOpen}
      />
    </div>
  )
}
