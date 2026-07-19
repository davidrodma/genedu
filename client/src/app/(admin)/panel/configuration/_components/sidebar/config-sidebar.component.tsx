import ProtoTypes from 'prop-types'
import TabBtn from '@/app/_common/components/button/TabBtn'

function ConfigSidebar({
  activeTab,
  handleActiveTab,
}: {
  activeTab: string
  handleActiveTab: (...args: any[]) => any
}) {
  return (
    <aside className="col-span-3 border-r border-bgray-200 dark:border-darkblack-400">
      {/* Sidebar Tabs */}

      <div className="px-4 py-6">
        <TabBtn
          activeTab={activeTab}
          handleTabActive={handleActiveTab}
          name="config-group"
          title="Configuration Group"
          text="Configure simply in an organized and grouped way"
        >
          <div className="currentColor rounded-full !w-20 !h-20 flex justify-center items-center">
            <i className="pi pi-cog text-2xl"></i>
          </div>
        </TabBtn>
        <TabBtn
          activeTab={activeTab}
          handleTabActive={handleActiveTab}
          name="config-items"
          title="Configuration Items"
          text="Advanced customization of settings items"
        >
          <div className="currentColor rounded-full !w-20 !h-20 flex justify-center items-center">
            <i className="pi pi-table text-2xl"></i>
          </div>
        </TabBtn>
      </div>
    </aside>
  )
}

ConfigSidebar.propTypes = {
  activeTab: ProtoTypes.string,
  handleActiveTab: ProtoTypes.func,
}

export default ConfigSidebar
