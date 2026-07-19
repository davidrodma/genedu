import { useDataTableCustomContext } from "@/app/_common/components/datatable"
import { Button } from "@/app/_common/components/button/button.component"
import { Checkbox, InputText } from "@/app/_common/components/inputs"
import { Col, Row } from "@/app/_common/components/grid-layout"
import { Content } from "@/app/_common/models/content/content.model"
import { FilterFields } from "@/app/_common/components/datatable/types/paginate.type"
import { useEffect } from "react"
import { contentStatusArray } from "@/app/_common/models"

type Model = Content
const emptyFilters: FilterFields = {
  tag: { value: "" as string, matchMode: "contains" },
  status: { value: [] as [], matchMode: "in" },
  type: { value: [] as [], matchMode: "in" },
  id: { value: "", matchMode: "equals" },
  noteError: { value: "" as string, matchMode: "contains" },
}
export const FiltersForm = () => {
  const {
    filters = emptyFilters,
    setFilters,
    sendFilter,
    setEmptyFilters,
  } = useDataTableCustomContext<Model>()

  useEffect(() => {
    setEmptyFilters(emptyFilters)
  }, [setEmptyFilters])

  const onChange = (name: string, value: any) => {
    setFilters({ ...filters, [name]: { ...filters[name], value: value } })
  }

  return (
    <form>
      <Row>
        <Col className="col-span-6 sm:col-span-6">
          <Checkbox
            items={contentStatusArray}
            checkedItems={filters.status.value as []}
            setCheckedItems={(status) => onChange("status", status)}
            label="Status"
            itemsVertical
            name="status"
          />
        </Col>
      </Row>
      <Row>
        <Col>
          <InputText
            label="Subject"
            name="subject"
            value={filters.tag.value as string}
            onChange={(e) => onChange("subject", e.target.value)}
          />
        </Col>
        <Col>
          <InputText
            label="ID"
            name="id"
            value={filters.id.value as string}
            onChange={(e) => onChange("id", e.target.value)}
          />
        </Col>
        <Col>
          <InputText
            label="Error"
            name="noteError"
            value={filters.noteError.value as string}
            onChange={(e) => onChange("noteError", e.target.value)}
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
