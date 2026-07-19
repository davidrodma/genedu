import React, { useState } from 'react'
import { PaginatorCurrentPageReportOptions } from 'primereact/paginator'
import { InputText } from 'primereact/inputtext'

export default function DataTablePaginator(params: {
  goToPage: (page: number) => void
  currentPage: number
  setCurrentPage: (page: number | string) => void
}) {
  const [first, setFirst] = useState<number[]>([0, 0, 0])

  const [pageInputTooltip, setPageInputTooltip] = useState<string>('')

  const onPageInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    params.setCurrentPage(event.target.value)
  }

  const onPageInputKeyDown = (
    event: React.KeyboardEvent<HTMLInputElement>,
    options: PaginatorCurrentPageReportOptions,
  ) => {
    if (event.key === 'Enter') {
      const page = typeof params.currentPage == 'string' ? parseInt(params.currentPage) : params.currentPage

      if (page < 0 || page > options.totalPages) {
        setPageInputTooltip(`Value must be between 1 and ${options.totalPages}.`)
      } else {
        let _first = [...first]

        _first[0] = params.currentPage ? options.rows * (page - 1) : 0

        setFirst(_first)
        params.goToPage(page)
      }
    }
  }

  const template = {
    layout: 'FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown',
    CurrentPageReport: (options: PaginatorCurrentPageReportOptions) => {
      return (
        <>
          <span style={{ userSelect: 'none', width: '120px', textAlign: 'center' }}>
            {options.first} - {options.last} of {options.totalRecords}
          </span>
          <span className="mx-3" style={{ userSelect: 'none' }}>
            Page{' '}
            <InputText
              size={2}
              className="ml-1 font-['Inter']"
              style={{ color: 'var(--text-color)' }}
              value={params.currentPage.toString()}
              tooltip={pageInputTooltip}
              onKeyDown={e => onPageInputKeyDown(e, options)}
              onChange={onPageInputChange}
            />
          </span>
          <span>Items</span>
        </>
      )
    },
  }
  return template
}
