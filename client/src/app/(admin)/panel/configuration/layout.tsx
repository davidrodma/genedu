import React, { ReactNode } from 'react'

function ConfigurationLayout({ children }: { children: ReactNode }) {
  return <div className="grid grid-cols-1 xl:grid-cols-12 bg-white dark:bg-darkblack-600 rounded-xl">{children}</div>
}

export default ConfigurationLayout
