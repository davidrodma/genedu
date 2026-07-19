import { useDataTableCustomContext } from '@/app/_common/components/datatable'
import { ConfigType } from '@/app/_common/models'
import { Config } from '@/app/_common/models/config/config.model'
import { DateTime } from '@/app/_common/utilities/datetime.utility'
import { FilterMatchMode } from 'primereact/api'
import { ColumnProps } from 'primereact/column'
import { useEffect } from 'react'

type Model = Config

export const Columns = () => {
  const { hiddenColumns, setHiddenColumns } = useDataTableCustomContext<Model>()

  useEffect(() => {
    setHiddenColumns({
      id: true,
      description: true,
      createdAt: true,
      updatedAt: true,
      type: true,
      configGroup: true,
    })
  }, [setHiddenColumns])

  const templateValue = (config: Model) => {
    if (config.type && [ConfigType.CHECKBOX, ConfigType.RADIO, ConfigType.SELECT].includes(config.type)) {
      const values = config.value.split(',')
      return values.map(key => {
        return (
          <div key={`value-${config.id}-${key}`} className="flex justify-start items-center">
            <span>
              {config?.jsonOptions && typeof config?.jsonOptions !== 'string' && key in config?.jsonOptions
                ? (config?.jsonOptions as any)[key]
                : ''}
            </span>
            <sup className="text-xs text-bgray-500 dark:text-darkblack-300 pl-1 -mt-1 !bg-black">{key}</sup>
          </div>
        )
      })
    }
    return config.value
  }

  const columns: ColumnProps[] = [
    {
      field: 'title',
      header: 'Title',
      body: (rowData: Model) => <b>{rowData.title}</b>,
      sortable: true,
      filter: true,
      filterPlaceholder: 'Search',
      style: { maxWidth: '20rem' },
      filterMatchMode: FilterMatchMode.CONTAINS,
      filterField: 'title',
    },
    {
      field: 'value',
      header: 'Value',
      sortable: true,
      style: { maxWidth: '20rem' },
      body: (rowData: Model) => templateValue(rowData),
    },
    {
      field: 'description',
      header: 'Description',
      sortable: true,
      filter: true,
      filterPlaceholder: 'Search',
      filterMatchMode: FilterMatchMode.CONTAINS,
      filterField: 'description',
      hidden: hiddenColumns?.description,
    },
    {
      field: 'name',
      header: 'Name',
      body: (rowData: Model) => <div className="text-sm text-bgray-500 dark:text-darkblack-300">{rowData.name}</div>,
      sortable: true,
      filter: true,
      filterPlaceholder: 'Search',
      filterMatchMode: FilterMatchMode.CONTAINS,
      filterField: 'name',
    },
    {
      field: 'id',
      header: 'ID',
      sortable: true,
      filter: true,
      filterPlaceholder: 'Search',
      filterMatchMode: FilterMatchMode.EQUALS,
      filterField: 'id',
      hidden: hiddenColumns?.id,
    },
    {
      field: 'configGroup.title',
      header: 'Group',
      sortable: true,
      hidden: hiddenColumns?.configGroup,
    },
    {
      field: 'type',
      header: 'Type',
      sortable: true,
      hidden: hiddenColumns?.type,
    },
    {
      field: 'createdAt',
      sortable: true,
      header: 'Created At',
      hidden: hiddenColumns?.createdAt,
      body: (rowData: Model) => DateTime.dateTemplate(rowData?.createdAt),
    },
    {
      field: 'updatedAt',
      sortable: true,
      header: 'Updated At',
      hidden: hiddenColumns?.updatedAt,
      body: (rowData: Model) => DateTime.dateTemplate(rowData?.updatedAt),
    },
  ]
  return columns
}
