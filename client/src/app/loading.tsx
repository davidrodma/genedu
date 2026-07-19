import React from 'react'
import { Skeleton } from 'primereact/skeleton'

export default function Loading() {
  return (
    <div className="card">
      <div className="border-round border-1 surface-border p-4 surface-card">
        <div className="flex mb-3 mr-10 justify-start">
          <Skeleton shape="circle" size="4rem" className="mr-2"></Skeleton>
          <div>
            <Skeleton width="13.5rem" className="mb-2 mt-2"></Skeleton>
            <Skeleton width="5rem" className="mb-2"></Skeleton>
            <Skeleton height=".5rem"></Skeleton>
          </div>
          <Skeleton shape="rectangle" size="4rem" className="mr-2 mx-auto"></Skeleton>
          <div>
            <Skeleton width="14rem" className="mb-2 mt-2"></Skeleton>
            <Skeleton width="5rem" className="mb-2"></Skeleton>
            <Skeleton height=".5rem"></Skeleton>
          </div>
        </div>
        <div className="flex justify-content-between mt-6 gap-10">
          <Skeleton width="18rem" height="35rem"></Skeleton>
          <Skeleton width="95rem" height="35rem"></Skeleton>
        </div>
      </div>
    </div>
  )
}
