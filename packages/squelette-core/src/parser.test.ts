import { ResponsesObject } from 'openapi3-ts'
import { parseResponse, parseErrors } from './parser'
import { TSSchema, IErrorsSchema } from './types'
import { getOperationObject } from './testing/helper'

describe('parseResponse', () => {
  it('should parse correctly', () => {
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
          properties: {
            pets: {
              type: 'Pet',
              isRequired: true,
              isArray: true,
              isRef: true,
              isNullable: false,
              enum: [],
              properties: {}
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
          properties: {
            pet: {
              type: 'Pet',
              isRequired: true,
              isArray: false,
              isRef: true,
              isNullable: false,
              enum: [],
              properties: {}
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
            properties: {
              reason: {
                type: 'string',
                isRequired: true,
                isRef: false,
                isArray: false,
                isNullable: false,
                enum: [],
                properties: {}
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
