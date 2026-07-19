import React from "react"
import { Dropdown, DropdownProps } from "primereact/dropdown"
import { Label } from "./label.component"
import { Control, Controller, FieldValues } from "react-hook-form"
type DropdownPropsType<T extends FieldValues> = DropdownProps & {
  items: any[]
  propertyLabel?: string | undefined
  propertyKey?: string | undefined
  selectedType?: "item" | "key"
  label?: string
  addClassName?: string
  control?: Control<T, any>
}
export function Select<T extends FieldValues = FieldValues>({
  label,
  addClassName = "",
  name,
  items,
  propertyLabel = "label",
  selectedType = "key",
  propertyKey = "key",
  value,
  control,
  onChange,
  ...props
}: DropdownPropsType<T>) {
  if (value) {
    value =
      selectedType == "item"
        ? items.find((item) => item[propertyKey] == value[propertyKey])
        : value[propertyKey] || value
  }
  if (control) {
    return (
      <Controller
        name={name as any}
        control={control}
        defaultValue={value}
        render={({ field, fieldState }) => (
          <div className="w-full">
            <Label label={label} />
            <div className="card flex justify-content-center">
              <Dropdown
                options={items}
                id={field.name}
                value={field.value}
                placeholder="Select a Option"
                optionLabel={propertyLabel}
                optionValue={selectedType == "item" ? undefined : propertyKey}
                focusInputRef={field.ref}
                onChange={(e) => {
                  field.onChange(e.value)
                  if (onChange) {
                    onChange(e)
                  }
                }}
                className={`default-input ${addClassName}`}
                {...props}
              />
            </div>
          </div>
        )}
      />
    )
  } else {
    return (
      <div className="w-full">
        <Label label={label} />
        <div className="card flex justify-content-center">
          <Dropdown
            options={items}
            value={value}
            optionLabel={propertyLabel}
            optionValue={selectedType == "item" ? undefined : propertyKey}
            placeholder="Select"
            className={`default-input ${addClassName}`}
            onChange={onChange}
            {...props}
          />
        </div>
      </div>
    )
  }
}
