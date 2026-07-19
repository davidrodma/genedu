import styles from './css/layout.module.scss' // Importe o arquivo CSS global

export default function DataTableLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-full rounded-lg rounded-t-[0] bg-white px-[24px] pb-[20px] dark:bg-darkblack-600">
      <div className="table-content w-full overflow-x-auto">
        <div className={styles.myComponent}>{children}</div>
      </div>
    </div>
  )
}
