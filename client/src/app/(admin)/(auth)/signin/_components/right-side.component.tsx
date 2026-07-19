import logoColor from "@/app/_common/assets/images/logo/logo-color.svg"
import logoWhite from "@/app/_common/assets/images/logo/logo-white.svg"
import Link from "next/link"
import Image from "next/image"
import { ReactNode } from "react"
import { _routes as _routesWebsite } from "@/app/(website)/_configs/_routes"
import { EMAIL_CONTACT, WEBSITE_TITLE } from "@/app/_common/configs/constants"

function RightSide({ children }: { children: ReactNode }) {
  return (
    <div className="lg:w-1/2 px-5 xl:pl-12 pt-10">
      <header>
        <Link href={_routesWebsite.home} className="">
          <Image
            priority={true}
            height={logoColor.height}
            width={logoColor.width}
            src={logoColor.src}
            className="block dark:hidden"
            alt="Logo"
          />
          <Image
            priority={true}
            height={logoWhite.height}
            width={logoWhite.width}
            src={logoWhite.src}
            className="hidden dark:block"
            alt="Logo"
          />
        </Link>
      </header>

      <div className="max-w-[460px] m-auto pt-0 pb-16">
        {/* Children  */}
        {children}
        {/* /Children  */}
        {/* Copyright  */}
        <p className="text-bgray-600 dark:text-darkblack-300 text-center text-sm mt-6">
          &copy; 2025 {WEBSITE_TITLE}. Contact Us:{" "}
          <Link href={`mailto:${EMAIL_CONTACT}`}>{EMAIL_CONTACT}</Link>
        </p>
      </div>
    </div>
  )
}

export default RightSide
