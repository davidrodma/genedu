import { FormButtonsFooter } from '@/app/_common/components/button/form-buttons-footer.component'
import { Col, Row } from '@/app/_common/components/grid-layout'
import { InputText } from '@/app/_common/components/inputs'
import { handleError } from '@/app/_common/errors/handleError'
import { ConfigGroup } from '@/app/_common/models'
import { Toast } from 'primereact/toast'
import { ReactNode, useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { ConfigGroupService } from '../../_services/config-group.service'

type Model = Partial<ConfigGroup>

const emptyModel: Partial<Model> = {
  id: '',
  title: '',
  status: 1,
}

export const ConfigGroupForm = ({
  setFormDialog,
  model = emptyModel,
  groups,
  setGroups,
  groupsFiltered,
  setGroupsFiltered,
  ...props
}: {
  setFormDialog: (open: boolean) => void
  groups: ConfigGroup[]
  setGroups: (groups: ConfigGroup[]) => void
  groupsFiltered: ConfigGroup[]
  setGroupsFiltered: (groups: ConfigGroup[]) => void
  model?: Model
}) => {
  const { control, handleSubmit, reset, setValue } = useForm<Model>()
  const [error, setError] = useState<string | ReactNode>('')
  const [formData, setFormData] = useState({ ...model })
  const [loading, setLoading] = useState<boolean>(false)
  const toast = useRef<Toast>(null)
  const initModel = useRef<Model>(model)

  useEffect(() => {
    reset()
    setError('')
    if (initModel.current?.id) {
      setFormData({
        ...initModel.current,
      })
      setValue('id', initModel.current.id, { shouldValidate: true })
    } else {
      setFormData({ ...emptyModel })
    }
  }, [reset, setValue])

  async function save(params: Model) {
    setError('')
    setLoading(true)
    const saved = await ConfigGroupService.save(params).catch(res => handleError(res))
    if ('error' in saved || !saved?.id) {
      setError('error' in saved ? saved.error : 'no results')
    } else {
      if (params?.id) {
        const indexG = groups.findIndex(u => u.id == params.id)
        groups[indexG] = saved
        setGroups([...groups])
        const indexF = groups.findIndex(u => u.id == params.id)
        groupsFiltered[indexF] = saved
        setGroupsFiltered([...groupsFiltered])
      } else {
        setGroups([saved, ...groups])
        setGroupsFiltered([saved, ...groupsFiltered])
      }
      toast.current?.show({ severity: 'success', summary: 'Successful', detail: 'Record Saved', life: 3000 })
      setFormDialog(false)
    }
    setLoading(false)
  }

  return (
    <form onSubmit={handleSubmit(save)} className="min-h-full flex flex-col">
      <Row>
        <Col>
          <InputText label={'Title'} name="title" value={formData.title} control={control} />
        </Col>
      </Row>
      <FormButtonsFooter loading={loading} error={error} cancelEvent={() => setFormDialog(false)} />
    </form>
  )
}
