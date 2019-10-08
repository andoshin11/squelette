export interface TSSchema {
  type: string
  isRequired: boolean
  isRef: boolean
  isArray: boolean
  isNullable: boolean
  enum: any[]
  properties: { [name: string]: TSSchema }
}
