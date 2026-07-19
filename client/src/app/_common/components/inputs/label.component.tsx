import { LabelHTMLAttributes } from 'react'

export const Label = ({ label, ...props }: LabelHTMLAttributes<HTMLLabelElement> & { label?: string }) => {
  return (
    label && (
      <label className="block mb-2 text-base font-medium text-bgray-600 dark:text-darkblack-300" {...props}>
        {label}
      </label>
    )
  )
}
