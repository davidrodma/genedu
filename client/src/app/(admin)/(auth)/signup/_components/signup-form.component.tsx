"use client"
import { handleError } from "@/app/_common/errors/handleError"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { ReactNode, useState } from "react"
import { Button } from "@/app/_common/components/button/button.component"
import Link from "next/link"
import { SignUpService } from "../_services/signup.service"
import { Password } from "@/app/_common/components/inputs"
import { MessageError } from "@/app/_common/components/message/error-message.component"
import { _routes } from "@/app/(admin)/_configs/_routes"

export default function SignUpForm() {
  const { register, control, handleSubmit } = useForm()
  const [error, setError] = useState<string | ReactNode>("")
  const [loading, setLoading] = useState(false)
  const router = useRouter() // Inicialize o useRouter
  async function handleSignUp(data: any) {
    setLoading(true)
    const response = await SignUpService.signUp(data).catch((res) =>
      handleError(res)
    )
    if ("error" in response) {
      setLoading(false)
      setError(response.error)
    } else {
      router.push(_routes.signin)
    }
  }
  return (
    <div className="max-w-[460px] m-auto pt-24 pb-16">
      <header className="text-center mb-8">
        <h2 className="text-bgray-900 dark:text-white text-4xl font-semibold font-poppins mb-2">
          Sign up for an account
        </h2>
        <p className="font-urbanis text-base font-medium text-bgray-600 dark:text-darkblack-300">
          Easily find SMM services and panels.
        </p>
      </header>
      <form onSubmit={handleSubmit(handleSignUp)}>
        <div className="mb-4">
          <div>
            <input
              type="text"
              className="text-bgray-800 dark:text-white dark:bg-darkblack-500 dark:border-darkblack-400 text-base border border-bgray-300 h-14 w-full focus:border-success-300 focus:ring-0 rounded-lg px-4 py-3.5 placeholder:text-bgray-500 placeholder:text-base "
              placeholder="* Name"
              {...register("name")}
            />
          </div>
        </div>
        <div className="mb-4">
          <input
            type="text"
            className="text-bgray-800 dark:text-white dark:bg-darkblack-500 dark:border-darkblack-400  text-base border border-bgray-300 h-14 w-full focus:border-success-300 focus:ring-0 rounded-lg px-4 py-3.5 placeholder:text-bgray-500 placeholder:text-base"
            placeholder="* Email"
            {...register("email")}
          />
        </div>
        <div className="mb-4">
          <input
            type="text"
            className="text-bgray-800 dark:text-white dark:bg-darkblack-500 dark:border-darkblack-400  text-base border border-bgray-300 h-14 w-full focus:border-success-300 focus:ring-0 rounded-lg px-4 py-3.5 placeholder:text-bgray-500 placeholder:text-base"
            placeholder="* @Telegram"
            {...register("telegram")}
          />
        </div>
        <div className="mb-6 relative">
          <Password
            placeholder={"* Password"}
            name="password"
            control={control}
            toggleMask
            className="w-full rounded-lg border border-bgray-300"
            addClassName="!bg-white shadow-none"
          />
        </div>
        <div className="mb-6 relative">
          <Password
            placeholder={"* Password Confirm"}
            name="passwordConfirm"
            control={control}
            toggleMask
            className="w-full rounded-lg border border-bgray-300"
            addClassName="!bg-white shadow-none"
          />
        </div>

        <MessageError error={error} />
        <Button sizeCustom="full" loading={loading}>
          Sign Up
        </Button>
      </form>
      {/* Form Bottom  */}
      <p className="text-center text-bgray-900 dark:text-bgray-50 text-base font-medium pt-7">
        Already have an account?{" "}
        <Link href="/signin" className="font-semibold underline">
          Sign In
        </Link>
      </p>
    </div>
  )
}
