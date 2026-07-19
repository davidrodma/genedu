import { Label } from "./label.component"
import { Control, FieldValues } from "react-hook-form"
import { InputController } from "./input-controller.component"
import { InputTextarea, InputTextareaProps } from "primereact/inputtextarea"
type InputTextType<T extends FieldValues> = InputTextareaProps & {
  label?: string
  addClassName?: string
  control?: Control<T, any>
  iconInput?: any
  iconInputWrapClassName?: string
  value: any
}
export const TextArea = <T extends FieldValues = FieldValues>({
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
          <InputTextarea
            className={`default-input ${addClassName}`}
            autoResize
            rows={5}
            {...field}
            disabled={disabled}
            defaultValue={value}
          />
        </span>
      </div>
    )
  }

  return allProps?.control
    ? InputController(allProps, (params = allProps) => inputElement(params))
    : inputElement(allProps)
}
