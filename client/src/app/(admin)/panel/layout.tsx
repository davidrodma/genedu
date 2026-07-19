'use client'
import Overlay from '@/app/_common/components/overlay'
import Sidebar from '@/app/(admin)/_components/sidebar/sidebar.component'
import SidebarV2 from '@/app/(admin)/_components/sidebar/sidebar-v2.component'
import ProtoTypes from 'prop-types'
import { useState } from 'react'
import { PrimeReactProvider } from 'primereact/api'

//import 'primereact/resources/themes/lara-light-indigo/theme.css' // theme
//import '@/app/_common/assets/primereact/themes/lara/lara-light/indigo/theme.scss' // theme
//import '@/app/_common/assets/primereact/themes/material/material-light/standard/indigo/theme.scss' // theme
import '@/app/_common/assets/primereact/themes/tailwind/tailwind-light/theme.scss' // theme

//import 'primeflex/primeflex.css' // css utility
import 'primeicons/primeicons.css'
import 'primereact/resources/primereact.css'
import '@/app/_common/assets/css/flags.css'

import { HeaderContextProvider } from '@/app/_common/contexts/header.context'
import HeaderOne from '../_components/header/header-one.componet'
import HeaderTwo from '../_components/header/header-two.componet'
import { ThemeContextProvider } from '../../_common/contexts/theme.context'

function Layout({ bg, overlay, children }: any) {
  const [sidebar, setSidebar] = useState<boolean>(true)
  return (
    <ThemeContextProvider>
      <PrimeReactProvider>
        <HeaderContextProvider>
          <div className={`layout-wrapper ${sidebar ? 'active' : ''}  w-full`}>
            <div className="relative flex w-full">
              <Sidebar handleActive={() => setSidebar(!sidebar)} />
              {overlay ? overlay : <Overlay />}
              <SidebarV2 />
              <div className={`body-wrapper flex-1 overflow-x-hidden ${bg ? bg : 'dark:bg-darkblack-500'} `}>
                <HeaderOne handleSidebar={() => setSidebar(!sidebar)} />
                <HeaderTwo handleSidebar={() => setSidebar(!sidebar)} />
                <main className="w-full xl:px-[48px] px-6 pb-6 xl:pb-[48px] sm:pt-[156px] pt-[100px] dark:bg-darkblack-500">
                  {children}
                </main>
              </div>
            </div>
          </div>
        </HeaderContextProvider>
      </PrimeReactProvider>
    </ThemeContextProvider>
  )
}

Layout.propTypes = {
  bg: ProtoTypes.string,
  overlay: ProtoTypes.node,
  children: ProtoTypes.node,
}

export default Layout
