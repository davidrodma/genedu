import {
  InputText as InputTextPrime,
  InputTextProps,
} from "primereact/inputtext"
import { Label } from "./label.component"
import { Control, FieldValues } from "react-hook-form"
import { InputController } from "./input-controller.component"
type InputTextType<T extends FieldValues> = InputTextProps & {
  label?: string
  addClassName?: string
  control?: Control<T, any>
  iconInput?: any
  iconInputWrapClassName?: string
  value: any
}
export const InputText = <T extends FieldValues = FieldValues>({
  ...allProps
}: InputTextType<T>) => {
  const inputElement = ({
    label,
    iconInput,
    iconInputWrapClassName = "p-input-icon-right",
    addClassName = "",
    value,
    disabled = false,
    control,
    ...field
  }: InputTextType<T>) => {
    return (
      <div className="flex-auto">
        <Label label={label} />
        <span className={iconInput ? iconInputWrapClassName : ""}>
          {iconInput}
          <InputTextPrime
            className={`default-input w-full ${addClassName}`}
            disabled={disabled}
            {...field}
          />
        </span>
      </div>
    )
  }

  return allProps?.control
    ? InputController(allProps, (params = allProps) => inputElement(params))
    : inputElement(allProps)
}
