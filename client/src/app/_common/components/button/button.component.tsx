import { Button as ButtonPrime, ButtonProps } from 'primereact/button'

export const Button = ({
  addClassName = '',
  sizeCustom = 'default',
  ...props
}: ButtonProps & {
  addClassName?: string
  sizeCustom?: 'small' | 'default' | 'big' | 'full'
}) => {
  const styles = {
    default: 'px-6 py-3.5',
    small: 'px-4 py-2.5 text-sm',
    big: 'px-20 py-4',
    full: 'py-3.5 px-4 w-full',
  }
  return (
    <ButtonPrime
      {...props}
      className={` bg-success-300 w-auto hover:bg-success-400 disabled:filter disabled:contrast-75 text-white font-semibold !flex gap-2 justify-center items-center rounded-lg ${styles[sizeCustom]} ${addClassName}`}
    >
      {props.children}
    </ButtonPrime>
  )
}
