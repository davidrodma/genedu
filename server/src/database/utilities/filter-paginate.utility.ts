import { PaginateDto } from 'src/common/dto/paginate.dto'

export function filterPaginate({
  paginateDto,
  fieldsSearch,
  allowedFieldsFilters = [],
}: {
  paginateDto: PaginateDto
  fieldsSearch: string[]
  allowedFieldsFilters?: string[]
}) {
  let where = {}

  if (paginateDto?.search) {
    const searches = fieldsSearch.map(field => {
      return { [field]: { contains: paginateDto.search, mode: 'insensitive' } }
    })
    where = {
      ...where,
      OR: searches,
    }
  }
  let filters = {}
  if (paginateDto?.filters) {
    function initializeFilterCoditions(filters: object, condition: string) {
      if (!filters[condition] || (filters[condition] && filters[condition].length == 0)) {
        filters[condition] = []
      }

      return filters
    }
    const filtersPaginate = paginateDto.filters
    const checkAllowedFilters = allowedFieldsFilters.length ? true : false
    for (const fieldKey of Object.keys(filtersPaginate)) {
      const item = {
        ...filtersPaginate[fieldKey],
        field: filtersPaginate[fieldKey]?.fieldDb || fieldKey,
        condition: filtersPaginate[fieldKey]?.condition || 'AND',
      }
      initializeFilterCoditions(filters, item.condition)
      if (
        (item.value && (!Array.isArray(item.value) || item.value.length)) ||
        item.matchMode == 'isEmpty' ||
        item.matchMode == 'isNotEmpty'
      ) {
        if (checkAllowedFilters) {
          if (!allowedFieldsFilters.includes(item.field)) {
            continue
          }
        }
        switch (item.matchMode) {
          case 'equals':
            filters[item.condition].push({
              [item.field]: item.value,
            })
            break
          case 'startsWith':
            filters[item.condition].push({
              [item.field]: {
                startsWith: item.value,
                mode: 'insensitive',
              },
            })
            break
          case 'endsWith':
            filters[item.condition].push({
              [item.field]: {
                endsWith: item.value,
                mode: 'insensitive',
              },
            })
            break
          case 'greaterThen':
            filters[item.condition].push({
              [item.field]: { gt: item.value },
            })
            break
          case 'lessThen':
            filters[item.condition].push({
              [item.field]: { lt: item.value },
            })
            break
          case 'greaterOrEqual':
            filters[item.condition].push({
              [item.field]: { gte: item.value },
            })
            break
          case 'lessOrEqual':
            filters[item.condition].push({
              [item.field]: { lte: item.value },
            })
            break
          case 'isNotEqual':
            filters[item.condition].push({
              NOT: {
                [item.field]: {
                  equals: item.value,
                  mode: 'insensitive',
                },
              },
            })
            break
          case 'notContains':
            filters[item.condition].push({
              NOT: {
                [item.field]: {
                  contains: item.value,
                  mode: 'insensitive',
                },
              },
            })
            break
          case 'isEmpty':
            filters[item.condition].push({
              OR: [{ [item.field]: '' }, { [item.field]: null }],
            })
            break
          case 'isNotEmpty':
            filters[item.condition].push({
              NOT: [{ OR: [{ [item.field]: '' }, { [item.field]: null }] }],
            })
            break
          case 'isAnyOf':
            if (Array.isArray(item.value)) {
              const words = item.value as string[]
              const any = words.map(word => {
                return {
                  [item.field]: {
                    equals: item.value,
                    mode: 'insensitive',
                  },
                }
              })
              filters[item.condition].push({
                OR: any,
              })
            }
            break
          case 'in':
            filters[item.condition].push({
              [item.field]: { in: item.value },
            })
            break
          case 'contains':
            filters[item.condition].push({
              [item.field]: { contains: item.value, mode: 'insensitive' },
            })
            break
          default:
            if (typeof item.value !== 'string') {
              filters[item.condition].push({
                [item.field]: item.value,
              })
            }
            if (typeof item.value === 'string') {
              filters[item.condition].push({
                [item.field]: {
                  contains: item.value,
                  mode: 'insensitive',
                },
              })
            }
            break
        }
      }
    }
  }
  where = { ...where, ...filters }
  return { where }
}
