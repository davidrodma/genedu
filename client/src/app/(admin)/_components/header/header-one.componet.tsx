"use client"
import ProtoTypes from "prop-types"
import { useEffect, useState } from "react"
import Author from "./author.component"
import MessagePopup from "./message-popup.component"
import NotificationPopup from "./notification-popup.component"
import ProfilePopup from "./profile-popup.component"
import StorePopUp from "./store-popup.component"
import ToggleBtn from "./toggle-btn.component"
import ModeToggler from "./mode-toggler.component"
import { useHeaderContext } from "@/app/_common/contexts/header.context"
function HeaderOne({
  handleSidebar,
}: {
  handleSidebar: (params?: any) => void
}) {
  const [popup, setPopup] = useState<any>({
    notification: false,
    message: false,
    profile: false,
    store: false,
  })

  const { title, subtitle } = useHeaderContext()

  const handlePopup = (name: string) => {
    setPopup({ ...popup, [name]: !popup[name] })
  }

  return (
    <header className="header-wrapper fixed z-30 hidden w-full md:block">
      <div className="relative flex h-[108px] w-full items-center justify-between bg-white px-10 dark:bg-darkblack-600 2xl:px-[76px]">
        <button
          aria-label="none"
          onClick={handleSidebar}
          title="Ctrl+b"
          type="button"
          className="drawer-btn absolute left-0 top-auto rotate-180 transform"
        >
          <span>
            <svg
              width="16"
              height="40"
              viewBox="0 0 16 40"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M0 10C0 4.47715 4.47715 0 10 0H16V40H10C4.47715 40 0 35.5228 0 30V10Z"
                fill="#22C55E"
              />
              <path
                d="M10 15L6 20.0049L10 25.0098"
                stroke="#ffffff"
                strokeWidth="1.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
        </button>
        {/* page-title */}
        <div>
          <h3 className="text-xl font-bold text-bgray-900 dark:text-bgray-50 lg:text-3xl lg:leading-[36.4px]">
            {title}
          </h3>
          <p className="text-xs font-medium text-bgray-600 dark:text-bgray-50 lg:text-sm lg:leading-[25.2px]">
            {subtitle}
          </p>
        </div>
        {/* quick access */}
        <div className="quick-access-wrapper relative">
          <div className="flex items-center space-x-[43px]">
            <div className="hidden items-center space-x-5 xl:flex">
              <ModeToggler />
            </div>
            <div className="hidden h-[48px] w-[1px] bg-bgray-300 dark:bg-darkblack-400 xl:block"></div>
            {/* author */}
            <Author showProfile={handlePopup} />
          </div>
          {/* notification ,message, store */}
          <NotificationPopup
            active={popup.notification}
            handlePopup={handlePopup}
          />
          <MessagePopup active={popup.message} handlePopup={handlePopup} />
          <StorePopUp active={popup.store} handlePopup={handlePopup} />
          <ProfilePopup active={popup.profile} handlePopup={handlePopup} />
        </div>
      </div>
    </header>
  )
}

HeaderOne.propTypes = {
  handleSidebar: ProtoTypes.func,
}

export default HeaderOne
