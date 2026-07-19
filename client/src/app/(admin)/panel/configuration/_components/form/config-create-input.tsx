import { Checkbox, InputNumber, InputText, Password, Radio, Select, TextArea } from '@/app/_common/components/inputs'
import { Config, ConfigType } from '@/app/_common/models'
import { Control } from 'react-hook-form'

type Model = Partial<Config>

export const CreateInput = ({
  config,
  formData,
  control,
  setFormData,
  addClassName = '',
}: {
  config: Model
  formData: Model
  control: Control<Model, any>
  setFormData: (config: Model) => void
  addClassName?: string
}) => {
  const label = ''
  const nameField = 'value'
  const items =
    config.type &&
    [ConfigType.CHECKBOX, ConfigType.RADIO, ConfigType.SELECT].includes(config.type) &&
    typeof formData.jsonOptions !== 'string' &&
    formData?.jsonOptions
      ? Object.keys(formData.jsonOptions as any).map(key => {
          return {
            key: key,
            label: typeof (formData.jsonOptions as any)[key] === 'string' ? (formData.jsonOptions as any)[key] : '',
          }
        })
      : []
  switch (config.type) {
    case ConfigType.TEXT:
      return (
        <InputText
          label={label}
          name={nameField}
          value={formData.value}
          defaultValue={formData.value}
          control={control}
          addClassName={addClassName}
        />
      )
    case ConfigType.PASSWORD:
      return (
        <Password label={label} name={nameField} value={formData.value} control={control} addClassName={addClassName} />
      )
    case ConfigType.NUMBER:
      return (
        <InputNumber
          label={label}
          name={nameField}
          value={formData.value}
          control={control}
          convertToString={true}
          addClassName={addClassName}
        />
      )
    case ConfigType.DECIMAL:
      return (
        <InputNumber
          label={label}
          name={nameField}
          value={formData.value}
          mode="decimal"
          control={control}
          minFractionDigits={2}
          maxFractionDigits={2}
          convertToString={true}
          addClassName={addClassName}
        />
      )
    case ConfigType.TEXTAREA:
      return (
        <TextArea label={label} name={nameField} value={formData.value} control={control} addClassName={addClassName} />
      )
    case ConfigType.SELECT:
      return (
        <Select
          items={items}
          defaultValue={formData?.value}
          value={formData?.value}
          label={label}
          name={nameField}
          control={control}
          onChange={e => setFormData({ ...formData, value: e.value })}
          addClassName={addClassName}
        />
      )
    case ConfigType.RADIO:
      return (
        <Radio
          name={nameField}
          items={items}
          checkedItem={formData?.value}
          control={control}
          label={label}
          addClassName={addClassName}
        />
      )
    case ConfigType.CHECKBOX:
      return (
        <Checkbox
          items={items}
          checkedItems={formData?.value?.split(',') || []}
          name={nameField}
          control={control}
          label={label}
          addClassName={addClassName}
        />
      )
  }
}
