import Link from 'next/link'
import { MenuItem } from './types/menu.type'
import { MenuItems } from './menu-items.component'

export const MenuV2 = () => {
  const Submenus = ({ menu, menuId }: { menu: MenuItem; menuId: string }) => {
    return (
      <ul
        key={`submenu-${menuId}`}
        className="sub-menu min-w-[200px] rounded-lg border-l border-success-100 bg-white px-5 py-2 shadow-lg"
      >
        {menu?.items?.map((submenu, submenuIdx) => {
          const submenuId = `submenu-item-${submenuIdx}`
          const hasSubSubmenu = submenu?.items?.length
          return (
            <li key={submenuId}>
              <Link
                href={submenu?.link || ''}
                className="text-md inline-block py-1.5 font-medium text-bgray-600 hover:text-bgray-800"
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
    const lastIndex = MenuItems.length - 1
    return (
      <div key={`menu-category-${categoryIdx}`} className="nav-wrapper mb-[16px] max-w-full">
        <div className="item-wrapper mb-5">
          <ul className="mt-2.5 flex flex-col items-center justify-center">
            {menuCategory.items.map((menu, menuIdx) => {
              const hasSubmenu = menu?.items?.length
              const menuId = `menu-item-${menuIdx}`
              return (
                <div key={`key-${menuId}`}>
                  <li className="item px-[43px] py-[11px]" key={menuId}>
                    <Link href={menu?.link || ''}>
                      <span className="item-ico">{menu.icon}</span>
                    </Link>
                    {hasSubmenu && <Submenus menu={menu} menuId={menuId} />}
                  </li>
                </div>
              )
            })}
          </ul>
        </div>
        {categoryIdx != lastIndex && <div className=" border-b border-bgray-200 dark:border-darkblack-400"></div>}
      </div>
    )
  })
  return menus
}
