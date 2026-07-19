'use client'
import { Sidebar } from 'primereact/sidebar'
import { Skeleton } from 'primereact/skeleton'
import { useDataTableCustomContext } from './contexts/datatable-custom.context'
import { ReactNode } from 'react'

function DataTableFilter<Model = any>({ FiltersFormTemplate, ...props }: { FiltersFormTemplate?: ReactNode }) {
  const { onGlobalFilter, visibleSliderFilter, setVisibleSliderFilter, removeFilters, isResetFilter } =
    useDataTableCustomContext<Model>()

  return (
    <div className="w-full">
      <div className="flex h-[56px] w-full space-x-4">
        <div
          className={`h-full rounded-lg border border-transparent bg-bgray-100 px-[18px] focus-within:border-success-300 dark:bg-darkblack-500 ${
            FiltersFormTemplate ? 'sm:w-70 lg:w-88' : 'w-full'
          }`}
        >
          <div className="flex h-full w-full items-center space-x-[15px]">
            <span>
              <svg
                className="stroke-bgray-900 dark:stroke-white"
                width="21"
                height="22"
                viewBox="0 0 21 22"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle
                  cx="9.80204"
                  cy="10.6761"
                  r="8.98856"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M16.0537 17.3945L19.5777 20.9094"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
            <label htmlFor="listSearch" className="w-full">
              <input
                type="text"
                id="listSearch"
                placeholder="Search by keywords..."
                onInput={onGlobalFilter}
                className="search-input w-full border-none bg-bgray-100 font-normal px-0 text-sm tracking-wide font-urbanist text-bgray-600 placeholder:text-sm placeholder:font-urbanist placeholder:text-bgray-500 focus:outline-none focus:ring-0 dark:bg-darkblack-500"
              />
            </label>
          </div>
        </div>
        {FiltersFormTemplate && (
          <div className="relative h-full flex-1">
            <button
              aria-label="none"
              onClick={() => setVisibleSliderFilter(true)}
              type="button"
              className="flex h-full w-full items-center justify-center rounded-lg border border-bgray-300 bg-bgray-100 dark:border-darkblack-500 dark:bg-darkblack-500 hover:bg-gray-100"
            >
              <div className="flex items-center space-x-3">
                <span>
                  <svg
                    className="stroke-bgray-900 dark:stroke-success-400"
                    width="18"
                    height="17"
                    viewBox="0 0 18 17"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M7.55169 13.5022H1.25098" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M10.3623 3.80984H16.663" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M5.94797 3.75568C5.94797 2.46002 4.88981 1.40942 3.58482 1.40942C2.27984 1.40942 1.22168 2.46002 1.22168 3.75568C1.22168 5.05133 2.27984 6.10193 3.58482 6.10193C4.88981 6.10193 5.94797 5.05133 5.94797 3.75568Z"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M17.2214 13.4632C17.2214 12.1675 16.1641 11.1169 14.8591 11.1169C13.5533 11.1169 12.4951 12.1675 12.4951 13.4632C12.4951 14.7589 13.5533 15.8095 14.8591 15.8095C16.1641 15.8095 17.2214 14.7589 17.2214 13.4632Z"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
                <span className="text-base font-medium text-success-300">Filters</span>
              </div>
            </button>
            <Sidebar
              header={
                <div className="flex justify-between w-full items-center">
                  <h2 className="text-xl font-bold text-bgray-900 dark:text-bgray-50">Filters</h2>
                  <i className="pi pi-filter-slash mr-2 cursor-pointer" onClick={removeFilters}></i>
                </div>
              }
              visible={visibleSliderFilter}
              position="right"
              onHide={() => setVisibleSliderFilter(false)}
            >
              {isResetFilter ? (
                <>
                  <Skeleton height="2rem" className="mb-2"></Skeleton>
                  <Skeleton height="2rem" className="mb-2"></Skeleton>
                  <Skeleton height="2rem" className="mb-2"></Skeleton>
                  <Skeleton height="2rem" className="mb-2"></Skeleton>
                  <Skeleton height="2rem" className="mb-2"></Skeleton>
                </>
              ) : (
                FiltersFormTemplate
              )}
            </Sidebar>
          </div>
        )}
      </div>
    </div>
  )
}

export default DataTableFilter
