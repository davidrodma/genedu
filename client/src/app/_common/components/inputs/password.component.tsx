import { Password as PasswordPrime, PasswordProps } from "primereact/password"
import { Label } from "./label.component"
import { Control, FieldValues } from "react-hook-form"
import { InputController } from "./input-controller.component"
type PasswordPropsType<T extends FieldValues> = PasswordProps & {
  label?: string
  addClassName?: string
  control?: Control<T, any>
  iconInput?: any
  iconInputWrapClassName?: string
}
export const Password = <T extends FieldValues = FieldValues>({
  ...allProps
}: PasswordPropsType<T>) => {
  const inputElement = ({
    label,
    iconInput,
    iconInputWrapClassName = "p-input-icon-right",
    addClassName = "",
    value,
    disabled = false,
    control,
    ...field
  }: PasswordPropsType<T>) => {
    return (
      <div className="flex-auto">
        <Label label={label} />
        <span className={iconInput ? iconInputWrapClassName : ""}>
          {iconInput}
          <PasswordPrime
            inputClassName={`default-input !bg-white ${addClassName}`}
            className={`w-full`}
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
