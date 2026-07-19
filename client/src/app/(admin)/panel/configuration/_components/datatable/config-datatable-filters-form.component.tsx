import { useDataTableCustomContext } from '@/app/_common/components/datatable'
import { Button } from '@/app/_common/components/button/button.component'
import { AutoComplete, Checkbox, InputText } from '@/app/_common/components/inputs'
import { Col, Row } from '@/app/_common/components/grid-layout'
import { statusDefaultArray } from '@/app/_common/enums/status.default.enum'
import { FilterFields } from '@/app/_common/components/datatable/types/paginate.type'
import { useEffect, useState } from 'react'
import { Config } from '@/app/_common/models/config/config.model'
import { ConfigGroup } from '@/app/_common/models'
import { ConfigGroupService } from '../../_services/config-group.service'

type Model = Config
const emptyFilters: FilterFields = {
  name: { value: '' as string, matchMode: 'contains' },
  title: { value: '' as string, matchMode: 'contains' },
  description: { value: '' as string, matchMode: 'contains' },
  status: { value: [] as [], matchMode: 'in' },
  id: { value: '', matchMode: 'equals' },
  configGroupId: { value: '', matchMode: 'equals' },
}
export const FiltersForm = () => {
  const [groups, setGroups] = useState<ConfigGroup[]>([])
  const { filters = emptyFilters, setFilters, sendFilter, setEmptyFilters } = useDataTableCustomContext<Model>()

  useEffect(() => {
    setEmptyFilters(emptyFilters)
  }, [setEmptyFilters])

  const onChange = (name: string, value: any) => {
    setFilters({ ...filters, [name]: { ...filters[name], value: value } })
  }

  useEffect(() => {
    ConfigGroupService.groups(true).then(groups => {
      setGroups(groups)
    })
  }, [])

  return (
    <form>
      <Row>
        <Col className="col-span-12 sm:col-span-12">
          <Checkbox
            items={statusDefaultArray}
            checkedItems={filters.status.value as []}
            setCheckedItems={status => onChange('status', status)}
            label="Status"
            itemsVertical
            name="status"
          />
        </Col>
        <Col className="col-span-12 sm:col-span-12">
          <AutoComplete
            label={'Group'}
            name="configGroupId"
            items={groups}
            propertyLabel="title"
            propertyKey="title"
            selectedType="item"
            placeholder="Type or choose"
            onChange={e => onChange('configGroupId', e.value.id)}
            dropdown
          />
        </Col>
        <Col className="col-span-12 sm:col-span-12">
          <InputText
            label="Name"
            name="name"
            value={filters.name.value as string}
            onChange={e => onChange('name', e.target.value)}
          />
        </Col>
        <Col className="col-span-12 sm:col-span-12">
          <InputText
            label="Title"
            name="title"
            value={filters.title.value as string}
            onChange={e => onChange('title', e.target.value)}
          />
        </Col>
        <Col className="col-span-12 sm:col-span-12">
          <InputText
            label="Description"
            name="description"
            value={filters.description.value as string}
            onChange={e => onChange('description', e.target.value)}
          />
        </Col>
      </Row>
      <Row>
        <Col className="col-span-12 sm:col-span-12">
          <Button type="button" sizeCustom="full" onClick={sendFilter}>
            <i className="pi pi-filter mr-2"></i> Filter
          </Button>
        </Col>
      </Row>
    </form>
  )
}
