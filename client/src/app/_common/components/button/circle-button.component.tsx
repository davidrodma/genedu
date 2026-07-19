import { Button, ButtonProps } from 'primereact/button'
import { Ripple } from 'primereact/ripple'

export const CircleButton = ({
  textClass = 'text-bgray-600',
  bgClass = 'bg-bgray-200',
  iconClass = 'pi pi-question',
  ...props
}: ButtonProps & { iconClass?: string; bgClass?: string; textClass?: string }) => {
  return (
    <Button
      className={`${textClass} button-circle`}
      icon={`${iconClass} ${bgClass} !flex h-[36px] w-[36px] items-center justify-center rounded-full`}
      {...props}
    ></Button>
  )
}
