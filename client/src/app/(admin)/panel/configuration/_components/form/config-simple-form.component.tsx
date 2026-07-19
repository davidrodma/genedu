import { Col, Row } from '@/app/_common/components/grid-layout'
import { Config } from '@/app/_common/models/config/config.model'
import { ReactNode, useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { ConfigService } from '../../_services/config.service'
import { handleError } from '@/app/_common/errors/handleError'
import { Toast } from 'primereact/toast'
import { FormButtonsFooter } from '@/app/_common/components/button/form-buttons-footer.component'
import { useDataTableCustomContext } from '@/app/_common/components/datatable'
import { Divider } from 'primereact/divider'
import { CreateInput } from './config-create-input'

type Model = Partial<Config>

export const ConfigSimpleForm = ({
  setFormDialog,
  model,
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
  const toast = useRef<Toast>(null)
  const initModel = useRef<Model | undefined>(model)

  useEffect(() => {
    reset()
    setError('')
    if (initModel.current?.id) {
      setFormData({
        ...initModel.current,
      })
      setValue('id', initModel.current.id, { shouldValidate: true })
    }
  }, [reset, setValue])

  async function save(params: Model) {
    setError('')
    setLoading(true)
    if (Array.isArray(params.value)) {
      params.value = params.value.map(item => item.trim()).join(',')
    }
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
      <Divider align="right" className="-mt-1">
        <div className="text-sm text-bgray-500 dark:text-darkblack-300 font-urbanist">{formData.name}</div>
      </Divider>
      <Row>
        <Col>
          <article className="mb-0 font-urbanist">
            <h4 className="text-bgray-800 dark:text-white text-lg font-bold mb-2">{formData.title}</h4>
            <p className="text-bgray-600 dark:text-bgray-50">{formData.description}</p>
          </article>
        </Col>
      </Row>
      <Row>
        <Col>
          <CreateInput config={formData} formData={formData} control={control} setFormData={setFormData} />
        </Col>
      </Row>
      <FormButtonsFooter loading={loading} error={error} cancelEvent={() => setFormDialog(false)} />
    </form>
  )
}
