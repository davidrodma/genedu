"use client"
import ProtoTypes from "prop-types"
import { _routes } from "@/app/(admin)/_configs/_routes"
import { CodeVerify } from "./code-verify.component"
import { NewPass } from "./new-pass.component"
import { ResetPass } from "./reset-pass-component"
import { useState } from "react"
import { SuccessFull } from "./successfull.component"

function PasswordResetModal({
  isActive,
  modalData,
  handelModalData,
  handleActive,
}: {
  isActive: boolean
  modalData: string
  handelModalData: any
  handleActive: any
}) {
  const [telegram, setTelegram] = useState("")
  const [code, setCode] = useState(0)
  return (
    <div
      className={`modal fixed inset-0 z-50 overflow-y-auto flex items-center justify-center ${
        isActive ? "" : "hidden"
      }`}
      id="multi-step-modal"
    >
      <div className="modal-overlay absolute inset-0 bg-gray-500 opacity-75 dark:bg-bgray-900 dark:opacity-50"></div>
      <div className="modal-content w-full max-w-lg mx-auto px-4">
        {modalData === "verify" ? (
          <CodeVerify
            close={() => handleActive(false)}
            handelModalData={handelModalData}
            telegram={telegram}
            setTelegram={setTelegram}
            code={code}
            setCode={setCode}
          />
        ) : modalData === "newPass" ? (
          <NewPass
            close={() => handleActive(false)}
            handelModalData={handelModalData}
            telegram={telegram}
            setTelegram={setTelegram}
            code={code}
            setCode={setCode}
          />
        ) : modalData === "success" ? (
          <SuccessFull close={() => handleActive(false)} />
        ) : (
          <ResetPass
            close={() => handleActive(false)}
            handelModalData={handelModalData}
            telegram={telegram}
            setTelegram={setTelegram}
            code={code}
            setCode={setCode}
          />
        )}
      </div>
    </div>
  )
}

PasswordResetModal.propTypes = {
  isActive: ProtoTypes.bool,
  modalData: ProtoTypes.string,
  handelModalData: ProtoTypes.func,
  handleActive: ProtoTypes.func,
}

export default PasswordResetModal
