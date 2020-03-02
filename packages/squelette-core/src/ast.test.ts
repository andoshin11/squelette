import { RequestBodyObject } from 'openapi3-ts'
import { getOperationObject } from './testing/helper'
import { SchemaToAST, printList } from './ast'
import { parseResponse, parseErrors, parseRequestBody } from './parser'
import { TSSchema } from './types'

describe('SchemaToAST', () => {
  it('should convert correctly', () => {
    const cases: { input: TSSchema, expect: string }[] = [
      {
        input: parseResponse(getOperationObject('/pets', 'get').responses),
        expect: '{\n    "pets": Pet[];\n}\n'
      },
      {
        input: parseErrors(getOperationObject('/pets', 'post').responses)![422]!,
        expect: '{\n    "reason": string;\n}\n'
      },
      {
        input: parseRequestBody(getOperationObject('/pets', 'post').requestBody as RequestBodyObject),
        expect: '{\n    "name": string;\n    "category"?: 1 | 2 | 3;\n    "sex": "male" | "female";\n}\n'
      }
    ]

    cases.forEach(c => {
      const printed = printList([SchemaToAST(c.input)])
      // console.log(printed)
      expect(printed).toEqual(c.expect)
    })
  })
})
