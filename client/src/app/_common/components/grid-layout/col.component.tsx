export const Col = ({ addClassName = '', ...props }) => {
  return (
    <div className={`col-span-12 ${addClassName}`} {...props}>
      {props.children}
    </div>
  )
}
