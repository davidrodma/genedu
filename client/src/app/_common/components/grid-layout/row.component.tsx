export const Row = ({ ...props }) => {
  return (
    <div className="mb-6 grid grid-cols-12 gap-x-5 gap-y-5" {...props}>
      {props.children}
    </div>
  )
}
