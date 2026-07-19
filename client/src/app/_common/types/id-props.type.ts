import { ID } from "@/app/_common/types/ID.type"

export interface IdProps {
  params: Promise<{
    id: ID
  }>
}
