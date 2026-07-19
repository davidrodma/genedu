const root = "/panel"
export const _routes = {
  _root: root,
  signin: `/signin`,
  signup: `/signup`,
  signout: `/signout`,
  home: `${root}/dashboard`,
  dashboard: `${root}/dashboard`,
  users: `${root}/users`,
  settings: `${root}/settings`,
  configuration: `${root}/configuration`,
  contents: `${root}/generation/contents`,
  documents: `${root}/generation/contents/documents`,
  verificationTelegram: `${root}/verification/telegram`,
} as const
