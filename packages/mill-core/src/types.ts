import { ErrorStatusCode } from './const'

export interface TSSchema {
  type: string
  isRequired: boolean
  isRef: boolean
  isArray: boolean
  isNullable: boolean
  enum: any[]
  properties: { [name: string]: TSSchema }
}

export type SwaggerSchemaFormat =
  | 'int32'
  | 'int64'
  | 'uint64'
  | 'float'
  | 'double'
  | 'byte'
  | 'date'
  | 'date-time'

export type SwaggerSchemaType =
  | 'Array'
  | 'array'
  | 'List'
  | 'boolean'
  | 'string'
  | 'int'
  | 'float'
  | 'number'
  | 'long'
  | 'short'
  | 'char'
  | 'double'
  | 'object'
  | 'integer'
  | 'Map'
  | 'date'
  | 'DateTime'
  | 'binary'
  | 'ByteArray'
  | 'UUID'
  | 'File'
  | 'Error'

export type HTTPMethod = 'get' | 'put' | 'post' | 'delete' | 'options' | 'head'| 'patch'

export interface IOperation {
  name: string
  path: string
  method: HTTPMethod
  pathParameter?: TSSchema
  queryParameter?: TSSchema
  requestBody?: TSSchema
  response?: TSSchema
  errors?: IErrorsSchema
}
  

export type ErrorStatusCodeType = TupleToUnion<typeof ErrorStatusCode>

export type IErrorsSchema = {
  [key in ErrorStatusCodeType]?: TSSchema
}
  
export interface ITag {
  [tag: string]: IOperation[]
}

// ------------------------------ Schema -------------------------------------
export interface BaseSchema {
  title?: string
  multipleOf?: number
  maximum?: number
  exclusiveMaximum?: boolean
  minimum?: number
  exclusiveMinimum?: boolean
  maxLength?: number
  minLength?: number
  pattern?: string
  maxItems?: number
  minItems?: number
  uniqueItems?: boolean
  maxProperties?: number
  minProperties?: number
  enum?: Array<string | boolean | number | {}>
}

export interface Schema extends BaseSchema {
  type?: string
  allOf?: Schema[]
  oneOf?: Schema[]
  anyOf?: Schema[]
  not?: Schema[]
  items?: Schema | Schema[]
  properties?: { [propertyName: string]: Schema }
  additionalProperties?: Schema
  description?: string
  format?:
    | 'int32'
    | 'int64'
    | 'float'
    | 'double'
    | 'byte'
    | 'binary'
    | 'date'
    | 'date-time'
    | 'password'
  default?: string | boolean | number | {}
  nullable?: boolean
  discriminator?: string
  readOnly?: boolean
  writeOnly?: boolean
  xml?: XML
  externalDocs?: ExternalDocs
  example?: any
  deprecated?: boolean
  required?: string[]
  $ref?: string
}

export interface XML {
  name?: string
  namespace?: string
  prefix?: string
  attribute?: boolean
  wrapped?: boolean
}

export interface ExternalDocs {
  url: string
  description?: string
}

// ------------------------------ Utility Types -------------------------------------
type TupleToUnion<T> = T extends { [K in keyof T]: infer U } ? U : never
