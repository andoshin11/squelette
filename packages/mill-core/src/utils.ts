import { SchemaObject } from 'openapi3-ts'
import { SwaggerSchemaType, SwaggerSchemaFormat, BaseSchema, Schema } from './types'

// Map swagger types to typescript definitions
// [swagger-type:typescript-type]
const typeMap: Record<SwaggerSchemaType, string> = {
  Array: 'Array',
  array: 'Array',
  List: 'Array',
  boolean: 'boolean',
  string: 'string',
  int: 'number',
  float: 'number',
  number: 'number',
  long: 'number',
  short: 'number',
  char: 'string',
  double: 'number',
  object: 'any',
  integer: 'number',
  Map: 'any',
  date: 'string',
  DateTime: 'Date',
  binary: 'string', // TODO: binary should be mapped to byte array
  ByteArray: 'string',
  UUID: 'string',
  File: 'any',
  Error: 'Error' // Note: Error is not same as the Javascript Error
}


export function mapType(type?: SwaggerSchemaType, format?: SwaggerSchemaFormat): string {
  if (!type) {
    return 'any'
  }

  if (type === 'string' && (format === 'int64' || format === 'uint64')) {
    // TODO: use options
    return 'number'
  }

  return typeMap[type] || 'any'
}

/**
 * Check passed object is schema or not
 * @param schemaOrBaseSchema
 */
export function isSchema(
  schemaOrBaseSchema: BaseSchema | Schema
): schemaOrBaseSchema is Schema {
  const schema = schemaOrBaseSchema as Schema
  return (
    schema.$ref !== undefined ||
    schema.allOf !== undefined ||
    schema.additionalProperties !== undefined ||
    schema.properties !== undefined ||
    schema.discriminator !== undefined ||
    schema.readOnly !== undefined ||
    schema.xml !== undefined ||
    schema.externalDocs !== undefined ||
    schema.example !== undefined ||
    schema.required !== undefined
  )
}

/**
 * Get ref names from ref path
 * @param schema
 */
export function getRefName(ref: string): string {
  const segments = ref.split('/')
  return segments[segments.length - 1]
}

/**
 * Check paramter is required
 */
export function isRequired(schema: SchemaObject, key: string): boolean {
  return (schema.required || []).includes(key)
}
