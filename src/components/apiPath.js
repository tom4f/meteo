const dev = process.env.NODE_ENV !== 'production'

export const apiPath = dev ? 'http://localhost/lipnonet/rekreace/api' : './../api'

export const commonPath = dev ? 'http://localhost/lipnonet' : './../..'