import { Col, Row } from '@/app/_common/components/grid-layout'
import { Config } from '@/app/_common/models/config/config.model'
import { ReactNode, useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { ConfigService } from '../../_services/config.service'
import { handleError } from '@/app/_common/errors/handleError'
import { Toast } from 'primereact/toast'
import { FormButtonsFooter } from '@/app/_common/components/button/form-buttons-footer.component'
import { CreateInput } from './config-create-input'
import { ConfigType } from '@/app/_common/models'
import { InputSwitch } from 'primereact/inputswitch'
import { ID } from '@/app/_common/types/ID.type'
import { StatusDefault } from '@/app/_common/enums/status.default.enum'

type Model = Partial<Config>

export const ConfigGroupItemForm = ({ model, ...props }: { model: Model }) => {
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
    }
  }, [reset, setValue])

  async function save(params: Model) {
    setError('')
    setLoading(true)
    if (Array.isArray(params.value)) {
      params.value = params.value.map(item => item.trim()).join(',')
    } else if (params?.value) {
      params.value = params.value.toString()
    }
    const saved = await ConfigService.save(params).catch(res => handleError(res))
    if ('error' in saved || !saved?.id) {
      setError('error' in saved ? saved.error : 'no results')
    } else {
      toast.current?.show({ severity: 'success', summary: 'Successful', detail: 'Record Saved', life: 3000 })
    }
    setLoading(false)
  }

  async function changeStatus(ids: ID[], status: StatusDefault) {
    setError('')
    setLoading(true)
    const saved = await ConfigService.status(ids, status)
    if ('error' in saved || !saved?.count) {
      setError('error' in saved ? (saved.error as string) : 'no results')
    } else {
      setFormData({ ...formData, status: status })
      toast.current?.show({ severity: 'success', summary: 'Successful', detail: 'Status Changed', life: 3000 })
    }
    setLoading(false)
  }

  return (
    <form onSubmit={handleSubmit(save)} className="min-h-full flex flex-col pb-10 pt-5">
      <Toast ref={toast} />
      <div className="flex justify-end mt-1 mb-1 mr-1">
        <div className="text-sm text-bgray-500 dark:text-darkblack-300 font-urbanist">{formData.name}</div>
      </div>
      <div className="p-7 rounded-xl bg-bgray-100 dark:bg-darkblack-500">
        <Row>
          <Col>
            <article className="mb-0 font-urbanist">
              <h4 className="text-bgray-800 dark:text-white text-lg font-bold mb-2 flex justify-between flex-wrap">
                {formData.title}{' '}
                <InputSwitch
                  checked={!!formData.status}
                  onChange={e => {
                    changeStatus([formData?.id as ID], e.value ? 1 : 0)
                  }}
                />
              </h4>
              <p className="text-bgray-600 dark:text-bgray-50">{formData.description}</p>
            </article>
          </Col>
        </Row>
        <Row>
          <Col>
            <CreateInput
              config={formData}
              formData={formData}
              control={control}
              setFormData={setFormData}
              addClassName={
                model?.type &&
                [
                  ConfigType.TEXT,
                  ConfigType.NUMBER,
                  ConfigType.DECIMAL,
                  ConfigType.TEXTAREA,
                  ConfigType.SELECT,
                ].includes(model.type)
                  ? '!bg-white dark:!bg-darkblack-400 shadow-none dark:text-bgray-50'
                  : ''
              }
            />
          </Col>
        </Row>
        <FormButtonsFooter loading={loading} error={error} />
      </div>
    </form>
  )
}
