'use client'
import { DataTableCustomContextProvider } from '@/app/_common/components/datatable'
import ProtoTypes from 'prop-types'
import { ConfigDatatable } from './config-datatable.component'

function ConfigDatatableTab({ name, activeTab }: { name: string; activeTab: string }) {
  return (
    <div id="tab5" className={`tab-pane ${name === activeTab && 'active'}`}>
      <h3 className="text-2xl font-bold text-bgray-900 dark:text-white px-6">Configuration Items</h3>
      <DataTableCustomContextProvider>
        <ConfigDatatable />
      </DataTableCustomContextProvider>
    </div>
  )
}
ConfigDatatableTab.propTypes = {
  name: ProtoTypes.string,
  activeTab: ProtoTypes.string,
}
export default ConfigDatatableTab
