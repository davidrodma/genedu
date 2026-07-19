export type ModalParams = {
  close: (...params: any) => any
  handelModalData: (...params: any) => any
  telegram: string
  setTelegram: (telegram: string) => void
  code: number
  setCode: (code: number) => void
}
