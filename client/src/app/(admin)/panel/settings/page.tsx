"use client"
import { useState } from "react"
import SettingsSidebar from "./_components/sidebar.component"
import Security from "./_components/form/security.component"
import PersonalInfo from "./_components/form/personal-info.component"

function Settings() {
  const [activeTab, setActiveTab] = useState("personalInfo")
  return (
    <>
      {/* Sidebar  */}
      <SettingsSidebar activeTab={activeTab} handleActiveTab={setActiveTab} />
      {/* Tab Content  */}
      <div className="py-8 px-10 col-span-9 tab-content">
        {/* Personal Information */}
        <PersonalInfo name="personalInfo" activeTab={activeTab} />
        {/* Security Password  */}
        <Security name="security" activeTab={activeTab} />
      </div>
    </>
  )
}

export default Settings
