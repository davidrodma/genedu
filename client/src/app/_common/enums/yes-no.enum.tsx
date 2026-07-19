export enum YesNo {
  NO = 0,
  YES = 1,
}

export const botUserStatusArray = [
  { key: YesNo.NO, label: 'No' },
  { key: YesNo.YES, label: 'Yes' },
]

export const YesNoTemplate = (status: YesNo | boolean) => {
  const label = botUserStatusArray?.find(item => item.key == status)?.label
  const enabled = status ? 1 : 0
  return (
    <span
      className={`${
        {
          [YesNo.NO]: 'bg-opacity-10 bg-error-300 text-error-300',
          [YesNo.YES]: 'bg-opacity-10 bg-success-400 text-success-400',
        }[enabled]
      } dark:bg-darkblack-500 rounded text-sm font-medium text-am px-3 py-1`}
    >
      {label}
    </span>
  )
}

export const YesNoIconTemplate = (status: YesNo | boolean) => {
  const label = botUserStatusArray?.find(item => item.key == status)?.label
  const enabled = status ? 1 : 0
  return (
    <div
      className={`${
        {
          [YesNo.NO]: 'bg-opacity-10 bg-error-300 text-error-300',
          [YesNo.YES]: 'bg-opacity-10 bg-success-400 text-success-400',
        }[enabled]
      } dark:bg-darkblack-500 rounded-full text-sm font-medium text-am w-8 h-8 flex items-center justify-center `}
    >
      {enabled ? <i className="pi pi-check"></i> : <i className="pi pi-times"></i>}
    </div>
  )
}
