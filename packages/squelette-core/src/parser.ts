import { OpenAPIObject, PathItemObject, ResponsesObject, ResponseObject, ParameterObject, RequestBodyObject, SchemaObject } from 'openapi3-ts'
import { HTTPMethod, IOperation, TSSchema, IErrorsSchema, ErrorStatusCodeType } from './types'
import { emptySchema } from './utils'
import { mapTS } from './mapTS'
import { ErrorStatusCode } from './const'

const methods: HTTPMethod[] = ['get', 'put', 'post', 'delete', 'options', 'head', 'patch']

export function parse (spec: OpenAPIObject): IOperation[] {
  const operations = [] as IOperation[]

  Object.entries(spec.paths).forEach(([key, val]) => {
    const path = key
    const pathItem = val as PathItemObject

    methods.filter(m => !!pathItem[m]).forEach(method => {
      const operation = pathItem[method]!
      if (operation.deprecated) {
        console.warn('Skip depricated operation', operation.operationId)
        return
      }
      if (!operation.operationId) {
        console.warn('Skip non-identified operation', path + ' : ' + method)
        return
      }

      const operationSchema: IOperation = {
        tags: operation.tags || [],
        name: operation.operationId,
        path,
        method,
        response: parseResponse(operation.responses),
        pathParameter: parsePathParameter(operation.parameters as ParameterObject[]),
        queryParameter: parseQueryParameter(operation.parameters as ParameterObject[]),
        requestBody: parseRequestBody(operation.requestBody as RequestBodyObject),
        errors: parseErrors(operation.responses)
      }

      operations.push(operationSchema)
    })
  })

  return operations
}

/**
 * Parse response schema
 * @param responses
 */
export function parseResponse(responses: ResponsesObject): TSSchema {
  // Parse response
  if (responses) {
    const response: ResponseObject = responses['200'] || responses['201']
    // console.log(JSON.stringify(responses['200'].content, null, '\t'))
    if (response && response.content) {
      return mapTS(response.content['application/json'].schema as SchemaObject, true)
    }
  }
  return emptySchema()
}

/**
 * Parse response schema
 * @param responses
 */
export function parseErrors(responses: ResponsesObject): IErrorsSchema | undefined {
  const errors = Object.keys(responses).filter(status => ErrorStatusCode.includes(status as ErrorStatusCodeType))

  if (!errors.length) return undefined

  const errorsSchema = errors.reduce((acc, ac) => {
    const response = responses[ac] as ResponseObject | undefined
    if (!response) return acc
    const { content } = response
    if (!content) return acc
    const json = content['application/json']
    if (!json) return acc
    const { schema } = json
    if (!schema) return acc

    acc[ac as ErrorStatusCodeType] = mapTS(schema, true)
    return acc
  }, {} as IErrorsSchema)

  return errorsSchema
}

/**
 * Parse path parameters
 * @param parameters
 */
function parsePathParameter(parameters: ParameterObject[] = []): TSSchema {
  // Parse path parameters
  return parameters.filter(params => params.in === 'path' ).reduce((res, params) => {
    res.properties[params.name] = mapTS(params.schema as SchemaObject, params.required)
    return res
  }, emptySchema())
}

/**
 * Parse query parameters
 * @param parameters
 */
function parseQueryParameter(parameters: ParameterObject[] = []): TSSchema {
  // Parse query parameters
  return parameters.filter(params => params.in === 'query')
    .reduce((res, params) => {
      res.properties[params.name] = mapTS(params.schema as SchemaObject, params.required)
      return res
    }, emptySchema())
}

export function parseRequestBody(requestBody?: RequestBodyObject): TSSchema {
  if (!requestBody || !requestBody.content) return emptySchema()
  const targetContent = Object.values(requestBody.content)[0]
  if (!targetContent) return emptySchema()

  return mapTS(targetContent.schema as SchemaObject)
}
