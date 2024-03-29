import { TSSchema } from '@squelette/core'

export const isEmpty = (obj: object = {}): boolean => Object.keys(obj).length === 0

export const optionalSymbol = (schema: TSSchema): string => schema.isRequired ? '' : '?'

export const arraySymbol = (schema: TSSchema): string => schema.isArray ? '[]' : ''

export const toTemplateLiteral = (path: string): string => path.replace(/\{/, "${args.pathParameter.")

export const isVoid = (schema: TSSchema): boolean => {
  return schema.type === 'void' && !Object.keys(schema.properties).length
}
