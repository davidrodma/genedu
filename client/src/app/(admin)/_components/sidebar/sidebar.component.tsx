import ProtoTypes from "prop-types"
import bg from "@/app/_common/assets/images/bg/upgrade-bg.png"
import logo from "@/app/_common/assets/images/logo/logo-color.svg"
import logoW from "@/app/_common/assets/images/logo/logo-white.svg"
import Link from "next/link"
import Image from "next/image"
import { Menu } from "../menus/menu.component"

function Sidebar({ handleActive }: { handleActive: () => void }) {
  return (
    <aside className="sidebar-wrapper fixed top-0 z-30 block h-full w-[308px] bg-white dark:bg-darkblack-600 sm:hidden lg:block">
      <div className="sidebar-header relative z-30 flex h-[108px] w-full items-center border-b border-r border-b-[#F7F7F7] border-r-[#F7F7F7] pl-[50px] dark:border-darkblack-400">
        <Link href="/">
          <Image
            priority={true}
            height={logo.height}
            width={logo.width}
            src={logo.src}
            className="block dark:hidden"
            alt="logo"
          />
          <Image
            priority={true}
            height={logoW.height}
            width={logoW.width}
            src={logoW.src}
            className="hidden dark:block"
            alt="logo"
          />
        </Link>
        <button
          aria-label="none"
          type="button"
          onClick={handleActive}
          className="drawer-btn absolute right-0 top-auto"
          title="Ctrl+b"
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
      </div>
      <div className="sidebar-body overflow-style-none relative z-30 h-screen w-full overflow-y-scroll pb-[200px] pl-[48px] pt-[14px]">
        <Menu />

        <div className="copy-write-text">
          <p className="text-sm text-[#969BA0]">© 2025 All Rights Reserved</p>
          <p className="text-sm font-medium text-bgray-700">
            Made by{" "}
            <a
              href="#"
              target="_blank"
              className="border-b font-semibold hover:text-success-300"
            >
              @davidrodma
            </a>
          </p>
        </div>
      </div>
    </aside>
  )
}

Sidebar.propTypes = {
  handleActive: ProtoTypes.func,
}

export default Sidebar
