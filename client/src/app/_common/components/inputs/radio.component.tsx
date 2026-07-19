import React from 'react'
import { RadioButton, RadioButtonProps } from 'primereact/radiobutton'
import { Control, Controller, FieldValues } from 'react-hook-form'
import { Label } from './label.component'
{
  /* Example
            <RowInput>
              <Radio
                items={Object.keys(Role).map(key => {
                  return { label: key, key: (Role as { [k: string]: string })[key] }
                })}
                checkedItem={formData?.role || Role.USER}
                onChange={handleInputChange}
                name="role"
              />
            </RowInput> */
}
type RadioPropsType<T extends FieldValues> = RadioButtonProps & {
  items: any[]
  checkedItem: any
  propertyLabel?: string | undefined
  propertyKey?: string | undefined
  selectedType?: 'item' | 'key'
  label?: string
  control?: Control<T, any>
  name: string
  itemsVertical?: boolean
  addClassName?: string
  onChange?: (event: any) => void
}
export const Radio = <T extends FieldValues = FieldValues>({
  items,
  propertyLabel = 'label',
  propertyKey = 'key',
  checkedItem,
  selectedType = 'key',
  name,
  label,
  itemsVertical = false,
  addClassName = '',
  onChange,
  ...props
}: RadioPropsType<T>) => {
  return props.control ? (
    <Controller
      name={name as any}
      control={props.control}
      defaultValue={checkedItem}
      render={({ field }) => (
        <>
          <Label label={label} />
          <div className="flex justify-content-center ">
            <div className={`flex items-center flex-wrap wrap-radio-default ${addClassName}`}>
              {items.map((item, idx) => {
                const inputId = `radio-${name || props?.id || idx}-${item[propertyKey].toString()}`
                return (
                  <div key={'key-' + inputId} className={`flex items-center mb-1 ${itemsVertical ? 'basis-full' : ''}`}>
                    <RadioButton
                      inputId={inputId}
                      {...field}
                      onChange={e => {
                        field.onChange(e)
                        if (onChange) {
                          onChange(e)
                        }
                      }}
                      inputRef={field.ref}
                      value={selectedType == 'item' ? item : item[propertyKey]}
                      checked={
                        selectedType == 'item'
                          ? field.value[propertyKey] === item[propertyKey]
                          : field.value === item[propertyKey]
                      }
                    />
                    <label htmlFor={inputId} className="ml-1 mr-3">
                      {item[propertyLabel]}
                    </label>
                  </div>
                )
              })}
            </div>
          </div>
        </>
      )}
    />
  ) : (
    <>
      <Label label={label} />
      <div className="flex justify-content-center">
        <div className="flex align-items-center">
          {items.map((item, idx) => {
            const inputId = `radio-${name || props?.id || idx}-${item[propertyKey].toString()}`
            return (
              <div key={'key-' + inputId} className={`flex items-center flex-wrap wrap-radio-default ${addClassName}`}>
                <RadioButton
                  inputId={inputId}
                  value={selectedType == 'item' ? item : item[propertyKey]}
                  checked={
                    selectedType == 'item'
                      ? checkedItem[propertyKey] == item[propertyKey]
                      : checkedItem == item[propertyKey]
                  }
                />
                <label htmlFor={inputId} className="ml-1 mr-3">
                  {item[propertyLabel]}
                </label>
              </div>
            )
          })}
        </div>
      </div>
    </>
  )
}
