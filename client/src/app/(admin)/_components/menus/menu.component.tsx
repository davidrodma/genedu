'use client'
import Link from 'next/link'
import { useState } from 'react'
import { MenuItem } from './types/menu.type'
import { MenuItems } from './menu-items.component'

export const Menu = () => {
  const [activeSubmenu, setActiveSubmenu] = useState<{ [menuId: string]: boolean }>({})
  const Submenus = ({ menu, menuId }: { menu: MenuItem; menuId: string }) => {
    return (
      <ul
        key={`submenu-${menuId}`}
        className={`sub-menu ml-2.5 mt-[22px] border-l border-success-100 pl-5 ${
          activeSubmenu[menuId] ? 'active' : ''
        }`}
      >
        {menu?.items?.map((submenu, submenuIdx) => {
          const submenuId = `submenu-item-${submenuIdx}`
          const hasSubSubmenu = submenu?.items?.length
          const propsSubmenuItem = hasSubSubmenu
            ? {
                onClick: () =>
                  setActiveSubmenu({
                    ...activeSubmenu,
                    ...{ [submenuId]: activeSubmenu[submenuId] ? false : true },
                  }),
              }
            : {}
          return (
            <li key={submenuId} {...propsSubmenuItem}>
              <Link
                href={submenu?.link || ''}
                className="text-md inline-block py-1.5 font-medium text-bgray-600 transition-all hover:text-bgray-800 dark:text-bgray-50 hover:dark:text-success-300"
              >
                {submenu.title}
              </Link>
              {hasSubSubmenu && <Submenus menu={submenu} menuId={submenuId} />}
            </li>
          )
        })}
      </ul>
    )
  }

  const menus = MenuItems.map((menuCategory, categoryIdx) => {
    return (
      <div key={`menu-category-${categoryIdx}`} className="nav-wrapper mb-[36px] pr-[50px]">
        <div className="item-wrapper mb-5">
          {menuCategory?.category && (
            <h4 className="border-b border-bgray-200 text-sm font-medium leading-7 text-bgray-700 dark:border-darkblack-400 dark:text-bgray-50">
              {menuCategory.category}
            </h4>
          )}
          <ul className="mt-2.5">
            {menuCategory.items.map((menu, menuIdx) => {
              const hasSubmenu = menu?.items?.length
              const hasBadges = menu?.badges?.length
              const menuId = `menu-item-${menuIdx}`
              const propsMenuItem = hasSubmenu
                ? {
                    onClick: () =>
                      setActiveSubmenu({ ...activeSubmenu, ...{ [menuId]: activeSubmenu[menuId] ? false : true } }),
                  }
                : {}
              return (
                <div key={`key-${menuId}`}>
                  <li className="item py-[11px] text-bgray-900 dark:text-white" key={menuId} {...propsMenuItem}>
                    <Link href={menu?.link || ''}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2.5">
                          <span className="item-ico">{menu.icon}</span>
                          <span className="item-text text-lg font-medium leading-none">{menu.title}</span>
                        </div>
                        {hasBadges && (
                          <div className="flex items-center space-x-2.5">
                            {menu?.badges?.map((badge, badgeIdx) => (
                              <span key={`badge-${badgeIdx}`}>{badge}</span>
                            ))}
                          </div>
                        )}
                        {hasSubmenu && (
                          <span className={`transition-transform ${activeSubmenu[menuId] ? 'rotate-90' : ''}`}>
                            <svg
                              width="6"
                              height="12"
                              viewBox="0 0 6 12"
                              fill="none"
                              className="fill-current"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                fillRule="evenodd"
                                clipRule="evenodd"
                                fill="currentColor"
                                d="M0.531506 0.414376C0.20806 0.673133 0.155619 1.1451 0.414376 1.46855L4.03956 6.00003L0.414376 10.5315C0.155618 10.855 0.208059 11.3269 0.531506 11.5857C0.854952 11.8444 1.32692 11.792 1.58568 11.4685L5.58568 6.46855C5.80481 6.19464 5.80481 5.80542 5.58568 5.53151L1.58568 0.531506C1.32692 0.20806 0.854953 0.155619 0.531506 0.414376Z"
                              />
                            </svg>
                          </span>
                        )}
                      </div>
                    </Link>
                    {hasSubmenu && <Submenus menu={menu} menuId={menuId} />}
                  </li>
                </div>
              )
            })}
          </ul>
        </div>
      </div>
    )
  })
  return menus
}
