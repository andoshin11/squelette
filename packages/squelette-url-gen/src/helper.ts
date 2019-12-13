import { TSSchema } from '@squelette/core'

export const isEmpty = (obj: object = {}): boolean => Object.keys(obj).length === 0

export const optionalSymbol = (schema: TSSchema): string => schema.isRequired ? '' : '?'

export const arraySymbol = (schema: TSSchema): string => schema.isArray ? '[]' : ''

export const toTemplateLiteral = (path: string): string => path.replace(/\{/, "${pathParameter.")
