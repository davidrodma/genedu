import { DataTableCustomContextProvider } from "@/app/_common/components/datatable/contexts/datatable-custom.context"
import { ContentDatatable } from "./_components/datatable/content-datatable.component"

function Contents() {
  return (
    <section className="mb-6 2xl:mb-0 2xl:flex-1">
      <DataTableCustomContextProvider>
        <ContentDatatable />
      </DataTableCustomContextProvider>
    </section>
  )
}

export default Contents
