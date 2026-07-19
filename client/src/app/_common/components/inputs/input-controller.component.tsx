import { Control, Controller, FieldValues } from 'react-hook-form'

export const InputController = <T extends FieldValues = FieldValues>(allProps: any, component: (props: any) => any) => {
  const { control, label, value, name, disabled = false, ...rest } = allProps
  return (
    <Controller
      name={name}
      control={control as Control<T, any>}
      disabled={disabled}
      defaultValue={value}
      render={function ({ field, fieldState }) {
        return component({ ...field, ...allProps })
      }}
    />
  )
}
