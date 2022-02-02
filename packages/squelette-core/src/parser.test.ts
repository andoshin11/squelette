import { ResponsesObject, RequestBodyObject } from 'openapi3-ts'
import { parseResponse, parseErrors, parseRequestBody } from './parser'
import { TSSchema, IErrorsSchema } from './types'
import { getOperationObject } from './testing/helper'

describe('parseResponse', () => {
  it('should parse response correctly', () => {
    const cases: { input: ResponsesObject, expect: TSSchema }[] = [
      {
        input: getOperationObject('/pets', 'get').responses,
        expect: {
          type: 'any',
          isRequired: true,
          isArray: false,
          isRef: false,
          isNullable: false,
          enum: [],
          additionalProperties: null,
          properties: {
            pets: {
              type: 'Pet',
              isRequired: true,
              isArray: true,
              isRef: true,
              isNullable: false,
              enum: [],
              properties: {},
              additionalProperties: null,
            }
          }
        }
      },
      {
        input: getOperationObject('/pets', 'post').responses,
        expect: {
          type: 'any',
          isRequired: true,
          isArray: false,
          isRef: false,
          isNullable: false,
          enum: [],
          additionalProperties: null,
          properties: {
            pet: {
              type: 'Pet',
              isRequired: true,
              isArray: false,
              isRef: true,
              isNullable: false,
              enum: [],
              properties: {},
              additionalProperties: null,
            }
          }
        }
      }
    ]

    cases.forEach(c => {
      // console.log(JSON.stringify(parseResponse(c.input), null, '\t'))
      expect(parseResponse(c.input)).toEqual(c.expect)
    })
  })
})

describe('parseRequestBody', () => {
  it('should parse request correctly', () => {
    const cases: { input: RequestBodyObject, expect: TSSchema }[] = [
      {
        input: getOperationObject('/pets', 'post').requestBody as RequestBodyObject,
        expect: {
          type: 'any',
          isRequired: false,
          isArray: false,
          isRef: false,
          isNullable: false,
          enum: [],
          additionalProperties: {
            type: 'number',
            isRequired: false,
            isArray: false,
            isRef: false,
            isNullable: true,
            enum: [],
            properties: {},
            additionalProperties: null
          },
          properties: {
            name: {
              type: 'string',
              isRequired: true,
              isArray: false,
              isRef: false,
              isNullable: false,
              enum: [],
              properties: {},
              additionalProperties: null
            },
            category: {
              type: 'number',
              isRequired: false,
              isArray: false,
              isRef: false,
              isNullable: false,
              enum: [1, 2, 3],
              properties: {},
              additionalProperties: null,
            },
            sex: {
              type: 'string',
              isRequired: true,
              isArray: false,
              isRef: false,
              isNullable: false,
              enum: ['male', 'female'],
              properties: {},
              additionalProperties: null
            }
          }
        }
      },
    ]

    cases.forEach(c => {
      // console.log(JSON.stringify(parseResponse(c.input), null, '\t'))
      expect(parseRequestBody(c.input)).toEqual(c.expect)
    })
  })
})

describe('parseErrors', () => {
  it('should parse correctly', () => {
    const cases: { input: ResponsesObject, expect: IErrorsSchema | undefined }[] = [
      {
        input: getOperationObject('/pets', 'get').responses,
        expect: undefined
      },
      {
        input: getOperationObject('/pets', 'post').responses,
        expect: {
          422: {
            type: 'any',
            isRequired: true,
            isRef: false,
            isArray: false,
            isNullable: false,
            enum: [],
            additionalProperties: null,
            properties: {
              reason: {
                type: 'string',
                isRequired: true,
                isRef: false,
                isArray: false,
                isNullable: false,
                enum: [],
                properties: {},
                additionalProperties: null
              }
            }
          }
        }
      }
    ]
  
  
    cases.forEach(c => {
      // console.log(JSON.stringify(parseResponse(c.input), null, '\t'))
      expect(parseErrors(c.input)).toEqual(c.expect)
    })
  })
})
