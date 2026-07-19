'use client'
function ConfigGroupFilter<Model = any>({ onGlobalFilter, ...props }: { onGlobalFilter: (params?: any) => void }) {
  return (
    <div className="w-full">
      <div className="flex h-[56px] w-full space-x-4">
        <div
          className={`h-full rounded-lg border border-transparent bg-bgray-100 px-[18px] focus-within:border-success-300 dark:bg-darkblack-500 ${'w-full'}`}
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
      </div>
    </div>
  )
}

export default ConfigGroupFilter
