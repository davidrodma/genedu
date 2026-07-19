import { _routes } from "@/app/(admin)/_configs/_routes"
import { IdProps } from "@/app/_common/types/id-props.type"
import Documents from "./_components/documents.component"

export async function generateMetadata({ params }: IdProps) {
  const { id } = await params
  return { title: `Documents #${id}` }
}

function DocumentsPage({ params }: IdProps) {
  return (
    <>
      <Documents params={params} />
    </>
  )
}

export default DocumentsPage
