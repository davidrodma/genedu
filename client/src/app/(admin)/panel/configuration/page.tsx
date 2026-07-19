'use client'
import { useEffect, useState } from 'react'
import ConfigurationSidebar from './_components/sidebar/config-sidebar.component'
import ConfigGroupCollection from './_components/group/config-group-collection.component'
import { useHeaderContext } from '@/app/_common/contexts/header.context'
import ConfigDatatableTab from './_components/datatable/config-datatable-tab.component'

function Configuration() {
  const [activeTab, setActiveTab] = useState('config-group')
  const { setHeaderInfo } = useHeaderContext()
  useEffect(() => {
    setHeaderInfo('Configuration', 'Manage and enable system settings')
  }, [setHeaderInfo])
  return (
    <>
      <ConfigurationSidebar activeTab={activeTab} handleActiveTab={setActiveTab} />
      <div className="py-8  col-span-9 tab-content">
        <ConfigGroupCollection name="config-group" activeTab={activeTab} />
        <ConfigDatatableTab name="config-items" activeTab={activeTab} />
      </div>
    </>
  )
}

export default Configuration
