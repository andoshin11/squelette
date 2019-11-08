import { TSSchema } from '@squelette/core'

export interface IDefinition {
  name: string
  schema: TSSchema
}

export interface GenFileRequest {
  filepath: string
  content: string
}


export interface text {
  opetationId: string
  rawPath: string
  literalPath: string
  method: string
  pathParameters: Record<string, TSSchema>
  queryParameters: Record<string, TSSchema>
  requestBody: Record<string, TSSchema>
}
