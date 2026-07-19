import { AutoComplete, InputText, Select, TextArea } from '@/app/_common/components/inputs'
import { Col, Row } from '@/app/_common/components/grid-layout'
import { Config } from '@/app/_common/models/config/config.model'
import { ReactNode, useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { ConfigService } from '../../_services/config.service'
import { handleError } from '@/app/_common/errors/handleError'
import { Toast } from 'primereact/toast'
import { FormButtonsFooter } from '@/app/_common/components/button/form-buttons-footer.component'
import { useDataTableCustomContext } from '@/app/_common/components/datatable'
import { ConfigGroup, ConfigType } from '@/app/_common/models'
import { ConfigGroupService } from '../../_services/config-group.service'

type Model = Partial<Config> & { groupTitle?: string }

const emptyModel: Partial<Model> = {
  id: '',
  name: '',
  title: '',
  description: '',
  type: ConfigType.TEXT,
  status: 1,
}

const types = Object.values(ConfigType).map(type => ({
  key: type,
  label: type,
}))

export const ConfigForm = ({
  setFormDialog,
  model = emptyModel,
  ...props
}: {
  setFormDialog: (open: boolean) => void
  model?: Model
}) => {
  const { rows, setRows } = useDataTableCustomContext<Model>()
  const { control, handleSubmit, reset, setValue } = useForm<Model>()
  const [error, setError] = useState<string | ReactNode>('')
  const [formData, setFormData] = useState({ ...model })
  const [loading, setLoading] = useState<boolean>(false)
  const [groups, setGroups] = useState<ConfigGroup[]>([])
  const toast = useRef<Toast>(null)
  const modelInit = useRef(model)

  useEffect(() => {
    async function init() {
      reset()
      setError('')
      if (modelInit.current?.id) {
        setFormData({
          ...modelInit.current,
        })
        setValue('id', modelInit.current.id, { shouldValidate: true })
      } else {
        setFormData({ ...emptyModel })
      }
    }

    init()
  }, [reset, setError, setFormData, setValue])

  useEffect(() => {
    ConfigGroupService.groups(true).then(groups => {
      setGroups(groups)
    })
  }, [setGroups])

  async function save(params: Model) {
    setError('')
    setLoading(true)
    params =
      typeof params?.configGroup == 'string'
        ? { ...params, groupTitle: params?.configGroup, configGroup: undefined }
        : { ...params, configGroupId: params?.configGroup?.id, configGroup: undefined }

    const saved = await ConfigService.save(params).catch(res => handleError(res))
    if ('error' in saved || !saved?.id) {
      setError('error' in saved ? saved.error : 'no results')
    } else {
      setFormDialog(false)
      if (params?.id) {
        const index = rows.findIndex(u => u.id == params.id)
        rows[index] = saved
        setRows([...rows])
      } else {
        setRows([saved, ...rows])
      }
      toast.current?.show({ severity: 'success', summary: 'Successful', detail: 'Record Saved', life: 3000 })
    }
    setLoading(false)
  }

  return (
    <form onSubmit={handleSubmit(save)} className="min-h-full flex flex-col">
      <Row>
        <Col addClassName="sm:col-span-4">
          <InputText label={'Name'} name="name" autoFocus value={formData.name} control={control} />
        </Col>
        <Col addClassName="sm:col-span-5">
          <AutoComplete
            label={'Group'}
            name="configGroup"
            items={groups}
            value={formData?.configGroup}
            propertyKey="id"
            propertyLabel="title"
            selectedType="item"
            placeholder="Type or choose"
            control={control}
            dropdown
          />
        </Col>
        <Col addClassName="sm:col-span-3">
          <Select
            items={types}
            defaultValue={formData?.type}
            value={formData?.type}
            label="Type"
            name="type"
            control={control}
            onChange={e => setFormData({ ...formData, type: e.value })}
          />
        </Col>
      </Row>
      <Row>
        <Col>
          <InputText label={'Title'} name="title" value={formData.title} control={control} />
        </Col>
      </Row>
      <Row>
        <Col>
          <TextArea label={'Description'} name="description" value={formData.description} control={control} />
        </Col>
      </Row>
      {formData?.type && [ConfigType.CHECKBOX, ConfigType.RADIO, ConfigType.SELECT].includes(formData.type) && (
        <Row>
          <Col>
            <TextArea
              label="JSON Options"
              name="jsonOptions"
              control={control}
              value={
                typeof formData?.jsonOptions == 'string'
                  ? formData?.jsonOptions
                  : JSON.stringify(formData?.jsonOptions) || ''
              }
            />
          </Col>
        </Row>
      )}

      <Row>
        <Col addClassName="sm:col-span-6">
          <InputText label={'Add Class'} name="classAdd" autoFocus value={formData.classAdd} control={control} />
        </Col>
        <Col addClassName="sm:col-span-6">
          <InputText label={'Value'} name="value" autoFocus value={formData.value} control={control} />
        </Col>
      </Row>
      <FormButtonsFooter loading={loading} error={error} cancelEvent={() => setFormDialog(false)} />
    </form>
  )
}
