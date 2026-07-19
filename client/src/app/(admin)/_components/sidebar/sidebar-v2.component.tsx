import Link from 'next/link'
import logo from '@/app/_common/assets/images/logo/logo-short.svg'
import logoW from '@/app/_common/assets/images/logo/logo-short-white.svg'
import Image from 'next/image'
import { MenuV2 } from '../menus/menu-v2.component'

function SidebarV2() {
  return (
    <aside className="relative hidden w-[96px] bg-white dark:bg-darkblack-600 sm:block">
      <div className="sidebar-wrapper-collapse relative top-0 z-30 w-full">
        <div className="sidebar-header sticky top-0 z-20 flex h-[108px] w-full items-center justify-center border-b border-r border-b-[#F7F7F7] border-r-[#F7F7F7] bg-white dark:border-darkblack-500 dark:bg-darkblack-600">
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
        </div>
        <div className="sidebar-body w-full pt-[14px]">
          <div className="flex flex-col items-center">
            <MenuV2 />
          </div>
        </div>
      </div>
    </aside>
  )
}

export default SidebarV2
