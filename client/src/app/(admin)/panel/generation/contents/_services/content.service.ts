import {
  PaginateType,
  PaginateResponse,
} from "@/app/_common/components/datatable/types/paginate.type"
import { Content } from "@/app/_common/models/content/content.model"
import { api } from "@/app/_common/services/api/api.service"
import { ID } from "@/app/_common/types/ID.type"
import { StatusDefault } from "@/app/_common/enums/status.default.enum"
import { CountResponse } from "@/app/_common/types/count-response.type"

const path = "/content"

type Model = Content

export const ContentService = {
  paginate(query?: PaginateType): Promise<PaginateResponse<Model>> {
    let params: any = { ...query }
    params.page = params?.page || 1
    params?.filters
      ? (params.filters = JSON.stringify(params.filters))
      : delete params.filters
    params?.order
      ? (params.order = JSON.stringify(params.order))
      : delete params.order
    !params?.search ? delete params.search : null
    return api().get(path, params)
  },
  findById: async (id: ID): Promise<Model> => {
    return api().get(`${path}/${id}`)
  },
  save: async (formData: FormData, id?: ID) => {
    const isUpdate = !!id
    return isUpdate
      ? api().put<Model>(`${path}/${id}`, formData, {
          content_type: "",
        })
      : api().post<Model>(path, formData, {
          content_type: "",
        })
  },
  delete: async (ids: ID[]): Promise<CountResponse> => {
    return api().delete(path, { ids })
  },
  status: async (ids: ID[], status: StatusDefault): Promise<CountResponse> => {
    const url = `${path}/status`
    return api().patch(url, { ids, status })
  },
}
