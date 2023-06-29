export interface HeadersModel {
  headers: {
    'content-type': string,
    'BB-Xsrf-Header'?: string,
  },
  credentials: string,
  mode: string,
}