import Image from "next/image"
import Link from "next/link"
import logoColor from "@/app/_common/assets/images/logo/logo-color.svg"
import logoWhite from "@/app/_common/assets/images/logo/logo-white.svg"
import { _routes } from "@/app/(admin)/_configs/_routes"

export const HeadingLogo = () => {
  return (
    <Link href={_routes.signin} className="block mb-7">
      <Image
        priority={true}
        height={logoColor.height}
        width={logoColor.width}
        src={logoColor.src}
        className="block dark:hidden"
        alt=""
      />
      <Image
        priority={true}
        height={logoWhite.height}
        width={logoWhite.width}
        src={logoWhite.src}
        className="hidden dark:block"
        alt=""
      />
    </Link>
  )
}

export const CrossBtn = ({ close }: any) => {
  return (
    <div className="absolute top-0 right-0 pt-5 pr-5">
      <button
        aria-label="none"
        type="button"
        onClick={close}
        id="step-1-cancel"
        className="rounded-md bg-white dark:bg-darkblack-500 focus:outline-none"
      >
        <span className="sr-only">Close</span>
        {/* Cross Icon  */}
        <svg
          className="stroke-darkblack-300"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M6 6L18 18M6 18L18 6L6 18Z"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
    </div>
  )
}
