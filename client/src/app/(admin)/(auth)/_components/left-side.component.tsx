import logoColor from "@/app/_common/assets/images/logo/logo-color.svg"
import logoWhite from "@/app/_common/assets/images/logo/logo-white.svg"
import Link from "next/link"
import Image from "next/image"
import { ReactNode } from "react"
import { _routes as _routesWebsite } from "@/app/(website)/_configs/_routes"

function LeftSide({ children }: { children: ReactNode }) {
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
        <nav className="flex items-center justify-center flex-wrap gap-x-11 pt-24">
          <Link href="#" className="text-sm text-bgray-700 dark:text-bgray-50">
            Terms & Condition
          </Link>
          <Link href="#" className="text-sm text-bgray-700 dark:text-bgray-50">
            Privacy Policy
          </Link>
          <Link href="#" className="text-sm text-bgray-700 dark:text-bgray-50">
            Help
          </Link>
          <Link href="#" className="text-sm text-bgray-700 dark:text-bgray-50">
            English
          </Link>
        </nav>
        {/* Copyright  */}
        <p className="text-bgray-600 dark:text-darkblack-300 text-center text-sm mt-6">
          &copy; 2025 GenEdu. All Right Reserved.
        </p>
      </div>
    </div>
  )
}

export default LeftSide
