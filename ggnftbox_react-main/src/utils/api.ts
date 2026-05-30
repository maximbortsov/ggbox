const normalizeOrigin = (origin?: string): string => (origin ?? 'http://localhost:3000').replace(/\/$/, '')

const Source = normalizeOrigin(process.env.REACT_APP_API_SOURCE)

export const ApiSource = Source + '/api/'
export const AssetsPath = Source + '/files/'
