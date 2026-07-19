import { useDataTableCustomContext } from '@/app/_common/components/datatable'
import { Button } from '@/app/_common/components/button/button.component'
import { Checkbox, InputText } from '@/app/_common/components/inputs'
import { Col, Row } from '@/app/_common/components/grid-layout'
import { statusDefaultArray } from '@/app/_common/enums/status.default.enum'
import { User } from '@/app/_common/models/user/user.model'
import { FilterFields } from '@/app/_common/components/datatable/types/paginate.type'
import { useEffect } from 'react'

type Model = User
const emptyFilters: FilterFields = {
  email: { value: '' as string, matchMode: 'contains' },
  status: { value: [] as [], matchMode: 'in' },
  id: { value: '', matchMode: 'equals' },
}
export const FiltersForm = () => {
  const { filters = emptyFilters, setFilters, sendFilter, setEmptyFilters } = useDataTableCustomContext<Model>()

  useEffect(() => {
    setEmptyFilters(emptyFilters)
  }, [setEmptyFilters])

  const onChange = (name: string, value: any) => {
    setFilters({ ...filters, [name]: { ...filters[name], value: value } })
  }

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
          <InputText
            label="Email"
            name="email"
            keyfilter="email"
            value={filters.email.value as string}
            onChange={e => onChange('email', e.target.value)}
          />
        </Col>
        <Col className="col-span-12 sm:col-span-12">
          <InputText
            label="ID"
            name="id"
            value={filters.id.value as string}
            onChange={e => onChange('id', e.target.value)}
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
