import Link from "next/link"
import { CrossBtn } from "./heading-logo.component"
import { _routes } from "@/app/(admin)/_configs/_routes"

export const SuccessFull = ({ close }: { close: (params?: any) => any }) => {
  return (
    <div className="step-content step-4">
      <div className="relative  transform overflow-hidden rounded-lg bg-white dark:bg-darkblack-600 p-8 text-left transition-all">
        <CrossBtn close={close} />
        <div className="text-center mt-4">
          <h3 className="text-2xl font-bold text-bgray-900 dark:text-white mb-3">
            Your successfully changed your password
          </h3>
          <p className="text-base font-medium text-bgray-600 dark:text-darkblack-300 mb-7">
            Now log in with your new password.
          </p>
          <Link
            href={_routes.signin}
            onClick={close}
            id="step-4-cancel"
            className="flex w-full py-4 text-white bg-success-300 hover:bg-success-400 transition-all justify-center text-base font-semibold rounded-lg"
          >
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  )
}
