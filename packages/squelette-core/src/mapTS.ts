import { SchemaObject } from 'openapi3-ts'
import { TSSchema, SwaggerSchemaFormat, SwaggerSchemaType, Schema } from './types'
import { mapType, isSchema, getRefName, isRequired } from './utils'

export function mapTS(schema: SchemaObject, required: boolean = false) {
  const tsSchema: TSSchema = {
    type: mapType(
      schema.type as SwaggerSchemaType,
      schema.format as SwaggerSchemaFormat
    ),
    isRequired: required,
    isArray: false,
    isRef: false,
    isNullable: schema.nullable || false,
    enum: [],
    properties: {},
    additionalProperties: null
  }

  // Has array type
  if (schema.type === 'array') {
    const parsed = mapTS(schema.items as SchemaObject)
    tsSchema.type = parsed.type
    tsSchema.isArray = true
    tsSchema.isRef = parsed.isRef
    tsSchema.properties = parsed.properties
    return tsSchema
  }


  // Has enum values
  if (schema.enum) {
    tsSchema.enum = schema.enum
    return tsSchema
  }

  // Has schema
  if (isSchema(schema)) {
    if (schema.$ref) {
      const name = getRefName(schema.$ref)
      tsSchema.isRef = true
      tsSchema.type = name
    }
    if (schema.properties) {
      tsSchema.properties = Object.keys(schema.properties).reduce(
        (res: { [key: string]: TSSchema }, key) => {
          const property = schema.properties![key] as SchemaObject
          res[key] = mapTS(property, isRequired(schema, key))
          return res
        },
        {}
      )
    }
    if (!!schema.additionalProperties) {
      if (typeof schema.additionalProperties === 'boolean') {
        tsSchema.additionalProperties = schema.additionalProperties
      } else if (!!schema.additionalProperties) {
        tsSchema.additionalProperties = mapTS(schema.additionalProperties)
      }
    }
    return tsSchema
  }
  return tsSchema
}
