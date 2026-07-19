import { InputNumber as InputNumberPrime, InputNumberProps } from 'primereact/inputnumber'
import { Label } from './label.component'
import { Control, Controller, FieldValues } from 'react-hook-form'

type InputNumberType<T extends FieldValues> = Omit<InputNumberProps, 'value'> & {
  label?: string
  addClassName?: string
  control?: Control<T, any>
  iconInput?: any
  iconInputWrapClassName?: string
  value?: number | string
  useGrouping?: boolean
  convertToString?: boolean
}
export const InputNumber = <T extends FieldValues = FieldValues>({
  useGrouping = false,
  value,
  label,
  iconInput,
  iconInputWrapClassName = 'p-input-icon-right',
  addClassName = '',
  disabled = false,
  convertToString,
  control,
  name,
  ...props
}: InputNumberType<T>) => {
  value = typeof value === 'string' ? parseFloat(value) : value ? (value as number) : ''
  const allProps = { ...props, disabled, useGrouping }
  if (control) {
    return (
      <Controller
        name={name as any}
        control={control}
        defaultValue={value as any}
        render={({ field, fieldState }) => {
          return (
            <div className="flex-auto">
              <Label label={label} />
              <span className={iconInput ? iconInputWrapClassName : ''}>
                {iconInput}
                <InputNumberPrime
                  id={name}
                  inputRef={field.ref}
                  value={value as any}
                  onBlur={field.onBlur}
                  onValueChange={(e: any) =>
                    field &&
                    field.onChange &&
                    (convertToString ? field.onChange(e.value.toString()) : field.onChange(e))
                  }
                  className={`w-full ${addClassName}`}
                  inputClassName={`default-input`}
                  {...allProps}
                />
              </span>
            </div>
          )
        }}
      />
    )
  } else {
    return (
      <div className="flex-auto">
        <Label label={label} />
        <span className={iconInput ? iconInputWrapClassName : ''}>
          {iconInput}
          <InputNumberPrime
            id={name}
            value={value as any}
            className={`w-full ${addClassName}`}
            inputClassName={`default-input`}
            {...allProps}
          />
        </span>
      </div>
    )
  }
}
