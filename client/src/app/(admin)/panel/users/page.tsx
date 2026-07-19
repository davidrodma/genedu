import { UserDatatable } from './_components/datatable/user-datatable.component'
import { DataTableCustomContextProvider } from '@/app/_common/components/datatable/contexts/datatable-custom.context'

function Users() {
  return (
    <section className="mb-6 2xl:mb-0 2xl:flex-1">
      <DataTableCustomContextProvider>
        <UserDatatable />
      </DataTableCustomContextProvider>
    </section>
  )
}

export default Users
