import React, { useState } from 'react'
import { Checkbox as CheckboxPrime, CheckboxProps } from 'primereact/checkbox'
import { Control, Controller, FieldValues } from 'react-hook-form'
import { Label } from './label.component'
/*
 <Checkbox items={roles} checkedItems={[formData?.role]} control={control} label="Role" />
 */
type CheckboxPropsType<T extends FieldValues> = Omit<CheckboxProps, 'checked'> & {
  items?: any[]
  checkedItems?: any[]
  propertyLabel?: string | undefined
  propertyKey?: string | undefined
  label?: string
  selectedType?: 'item' | 'key'
  control?: Control<T, any>
  itemsVertical?: boolean
  addClassName?: string
  setCheckedItems?: (items: any) => void
  checked?: boolean
}
export function Checkbox<T extends FieldValues = FieldValues>({
  items,
  propertyLabel = 'label',
  propertyKey = 'key',
  checkedItems = [],
  selectedType = 'key',
  label,
  name,
  itemsVertical = false,
  addClassName = '',
  setCheckedItems,
  ...props
}: CheckboxPropsType<T>) {
  const [_selectedItems, setSelectedItems] = React.useState(checkedItems)

  const onItemsChange = (e: any, option: any, field?: any) => {
    let _selectedItems = field?.value ? [...field.value] : [...checkedItems]
    if (e?.checked) {
      if (
        !_selectedItems.some(item =>
          selectedType == 'item' ? item[propertyKey] == option[propertyKey] : item === option[propertyKey],
        )
      ) {
        _selectedItems.push(selectedType == 'item' ? option : option[propertyKey])
      }
    } else {
      _selectedItems = _selectedItems.filter((item: any) => {
        return selectedType == 'item' ? item[propertyKey] !== option[propertyKey] : item !== option[propertyKey]
      })
    }
    _selectedItems = _selectedItems.filter(item => item !== '')
    if (field) {
      field.onChange([..._selectedItems])
    }
    if (setCheckedItems) {
      setCheckedItems([..._selectedItems])
    }

    setSelectedItems([..._selectedItems])
  }

  return (
    <>
      {items && <Label label={label} />}
      <div className="flex justify-content-center">
        <div className="flex align-items-center flex-wrap gap-3">
          {items ? (
            items.map((option, idx) => {
              const inputId = `checkbox-${name || option.key || idx}-${option[propertyKey].toString()}`
              return (
                <div key={'wrap-' + inputId} className={`flex items-center mb-1 ${itemsVertical ? 'basis-full' : ''}`}>
                  {props.control ? (
                    <Controller
                      name={name || option.key}
                      control={props.control}
                      render={({ field }) => {
                        const { onChange, ...newField } = field
                        return (
                          <div
                            key={'render-' + inputId}
                            className={`flex items-center wrap-checkbox-default ${addClassName}`}
                          >
                            <CheckboxPrime
                              onChange={e => (name ? onItemsChange(e, option, field) : field?.onChange(e))}
                              inputId={inputId}
                              checked={
                                name
                                  ? _selectedItems.some(item =>
                                      selectedType == 'item'
                                        ? item[propertyKey] == option[propertyKey]
                                        : item == option[propertyKey],
                                    )
                                  : typeof field.value !== 'undefined'
                                  ? field.value
                                  : (function () {
                                      const checked = checkedItems.some(item => item == option[propertyKey])
                                      field?.onChange(checked)
                                      return checked
                                    })()
                              }
                              {...newField}
                            />
                            <label htmlFor={inputId} className="ml-2">
                              {option[propertyLabel]}
                            </label>
                          </div>
                        )
                      }}
                    />
                  ) : (
                    <div
                      key={'render-' + inputId}
                      className={`flex items-center wrap-checkbox-default ${addClassName}`}
                    >
                      {(() => {
                        const { checked: _, ...restProps } = props // Executa o código de destructuring aqui
                        return (
                          <CheckboxPrime
                            inputId={inputId}
                            name={name || option.key}
                            checked={
                              name
                                ? _selectedItems.some(item =>
                                    selectedType == 'item'
                                      ? item[propertyKey] == option[propertyKey]
                                      : item == option[propertyKey],
                                  )
                                : (function () {
                                    const checked = checkedItems.some(item => item == option[propertyKey])
                                    return checked
                                  })()
                            }
                            onChange={e => onItemsChange(e, option)}
                            {...restProps}
                          />
                        )
                      })()}
                      <label htmlFor={inputId} className="ml-2 font-urbanist">
                        {option[propertyLabel]}
                      </label>
                    </div>
                  )}
                </div>
              )
            })
          ) : (
            <div
              key={'wrap-' + props?.inputId || name}
              className={`flex items-center mb-1 ${itemsVertical ? 'basis-full' : ''}`}
            >
              <div key={props?.inputId || name} className={`flex items-center wrap-checkbox-default ${addClassName}`}>
                <CheckboxPrime
                  inputId={props?.inputId || name}
                  name={name}
                  value={props.value}
                  checked={!!props.checked}
                  {...props}
                />
                <label htmlFor={props?.inputId || name} className="ml-2 font-urbanist">
                  {label}
                </label>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
