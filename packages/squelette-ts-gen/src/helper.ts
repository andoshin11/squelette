import { TSSchema } from '@mill/core'

export const isEmpty = (obj: object = {}): boolean => Object.keys(obj).length === 0

export const optionalSymbol = (schema: TSSchema): string => schema.isRequired ? '' : '?'

export const arraySymbol = (schema: TSSchema): string => schema.isArray ? '[]' : ''
