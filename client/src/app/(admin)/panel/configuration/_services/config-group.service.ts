import { PaginateResponse, PaginateType } from '@/app/_common/components/datatable/types/paginate.type'
import { api } from '@/app/_common/services/api/api.service'
import { ID } from '@/app/_common/types/ID.type'
import { StatusDefault } from '@/app/_common/enums/status.default.enum'
import { CountResponse } from '@/app/_common/types/count-response.type'
import { Config } from '@/app/_common/models/config/config.model'
import { ConfigGroup } from '@/app/_common/models'

const path = '/config/groups'

type Model = Config

export const ConfigGroupService = {
  paginate(query?: PaginateType) {
    let params: any = { ...query }
    params.page = params?.page || 1
    params?.filters ? (params.filters = JSON.stringify(params.filters)) : delete params.filters
    params.order = params?.order ? params?.order : params?.order
    params?.order ? (params.order = JSON.stringify(params.order)) : delete params.order
    !params?.search ? delete params.search : null
    return api().get<PaginateResponse<Model>>(path, params)
  },
  save: async (params: Partial<Model>) => {
    return params?.id
      ? api().put<Model>(`${path}/${params.id}`, { ...params, id: undefined })
      : api().post(path, params)
  },
  deleteById: async (id: ID) => {
    return api().delete<Model>(`${path}/${id}`)
  },
  status: async (ids: ID[], status: StatusDefault) => {
    return api().patch<CountResponse>(`${path}/status`, { ids, status })
  },
  groups: async (excludeConfigs = false) => {
    return api().get<ConfigGroup[]>(`${path}/all`, { excludeConfigs })
  },
}
