import { TSSchema } from '@mill/core'

export interface IDefinition {
  name: string
  schema: TSSchema
}

export interface GenFileRequest {
  filepath: string
  content: string
}
