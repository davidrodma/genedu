'use client'
import { Button } from 'primereact/button'
import { Menu } from 'primereact/menu'
import ProtoTypes from 'prop-types'
import { useRef, useState } from 'react'
import { ConfigGroup } from '@/app/_common/models'
import { ConfigGroupItemForm } from '../form/config-group-item-form.component'

function ConfigGroupItem({
  group,
  setSelectedGroup,
  setDeleteRowDialog,
  setFormDialog,
  letter,
  bg,
}: {
  group: ConfigGroup
  setSelectedGroup: (group: ConfigGroup) => void
  setDeleteRowDialog: (open: boolean) => void
  setFormDialog: (open: boolean) => void
  letter: string
  bg: string
}) {
  const menuRefRow = useRef<Menu>(null)
  const [isActive, setIsActive] = useState(false)
  //const isActive = activeGroup?.find(item => item === group.id)
  const items = [
    {
      label: 'Settings',
      icon: 'pi pi-cog',
      command: () => {
        setIsActive(!isActive)
      },
    },
    {
      label: 'Edit Name',
      icon: 'pi pi-pencil',
      command: () => {
        setFormDialog(true)
      },
    },
    {
      label: 'Delete',
      icon: 'pi pi-trash',
      command: () => {
        setDeleteRowDialog(true)
      },
    },
  ]
  return (
    <div className="border-b border-bgray-300 dark:border-darkblack-400 last:border-b-0 [&>.accordion-header]:last:pb-0">
      <div className="accordion-header flex sm:flex-row flex-col sm:items-center items-end justify-between pb-5">
        <div className="flex gap-x-4 cursor-pointer" onClick={() => setIsActive(!isActive)}>
          <span>
            <div
              className="w-14 h-14 rounded-full flex justify-center items-center text-white font-bold text-2xl relative"
              style={{ background: bg }}
            >
              <span>{letter}</span>
              <span className="w-5 h-5 rounded-full bg-black text-white absolute -bottom-0.5 -right-0.5 flex justify-center items-center ">
                {!isActive ? <i className="pi pi-plus text-xs"></i> : <i className="pi pi-minus text-xs"></i>}
              </span>
            </div>
          </span>
          <div className="flex-1">
            <h4 className="text-lg font-bold text-bgray-900 dark:text-white" id="availability-label">
              {group.title}
            </h4>
            <p className="text-base text-bgray-500 dark:text-darkblack-300" id="availability-description">
              {group?.configs?.map(config => config.title).join(', ') || ''}
            </p>
          </div>
        </div>
        <Menu model={items} popup ref={menuRefRow} id="popup_menu_right" popupAlignment="right" />
        <Button
          icon="pi pi-ellipsis-v"
          className="p-button-help w-5 m-0 text-bgray-500"
          onClick={event => {
            setSelectedGroup(group)
            menuRefRow?.current?.toggle(event)
          }}
          aria-controls="popup_menu_right"
          aria-haspopup
        />
      </div>
      <div
        style={{
          maxHeight: isActive ? '20000px' : 0,
        }}
        className={`max-height accordion-content w-full lg:pl-8 lg:pr-8 pl-4 pr-4 pt-2 overflow-hidden max-h-0 space-y-4 transition-max-height duration-500 ease-in-out`}
      >
        {group.configs?.map(config => {
          return <ConfigGroupItemForm key={`group-item-form-${config.id}`} model={config} />
        })}
      </div>
    </div>
  )
}
ConfigGroupItem.propTypes = {
  name: ProtoTypes.string,
  desc: ProtoTypes.string,
  activeConfigurationGroup: ProtoTypes.object,
  handleConfigurationGroup: ProtoTypes.func,
}
export default ConfigGroupItem
