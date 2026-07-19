export const convertJsonToFormData = (jsonObject: any): FormData => {
  const formData = new FormData()

  for (const key in jsonObject) {
    if (jsonObject.hasOwnProperty(key)) {
      const value = jsonObject[key]
      if (value !== undefined && value !== null) {
        if (value instanceof File) {
          formData.append(key, value) // Adiciona o arquivo ao FormData
        } else if (Array.isArray(value)) {
          // Se for um array (por exemplo, múltiplos arquivos), adicionar todos
          value.forEach((item, index) => {
            if (item instanceof File) {
              formData.append(`${key}[${index}]`, item)
            } else {
              formData.append(`${key}[${index}]`, item)
            }
          })
        } else {
          formData.append(key, value) // Adiciona campos simples (texto, números, etc.)
        }
        continue
      }
    }
  }

  return formData
}
