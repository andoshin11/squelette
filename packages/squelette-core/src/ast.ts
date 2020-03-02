import * as ts from 'typescript'
import { TSSchema } from './types'

const printer = ts.createPrinter()

export function printList(nodeList: ts.Node[]) {
  return printer.printList(
    ts.ListFormat.MultiLine,
    ts.createNodeArray(nodeList),
    ts.createSourceFile('', '', ts.ScriptTarget.ES2015)
  )
}

export function SchemaToAST(schema: TSSchema) {
  const hasProperties = schema.type === 'object' || !!Object.keys(schema.properties).length
  const isEnum = !!schema.enum.length

  let node: ts.TypeNode
  if (hasProperties) {
    const keys = Object.keys(schema.properties)
    node = ts.createTypeLiteralNode(keys.map(key => {
      const property = schema.properties[key]
      return ts.createPropertySignature(
        undefined,
        ts.createStringLiteral(key),
        property.isRequired ? undefined : ts.createToken(ts.SyntaxKind.QuestionToken),
        SchemaToAST(property),
        undefined
      )
    }))
  } else if (isEnum) {
    node = ts.createUnionTypeNode(schema.enum.map(i => {
      return ts.createLiteralTypeNode(convertToLiteral(i))
    }))
  } else if (schema.isRef) {
    node = ts.createTypeReferenceNode(
      ts.createIdentifier(schema.type),
      undefined
    )
  } else if (schema.type === 'number') {
    node = ts.createKeywordTypeNode(ts.SyntaxKind.NumberKeyword)
  } else if (schema.type === 'string') {
    node = ts.createKeywordTypeNode(ts.SyntaxKind.StringKeyword)
  } else if (schema.type === 'boolean') {
    node = ts.createKeywordTypeNode(ts.SyntaxKind.BooleanKeyword)
  } else if (schema.type === 'any') {
    node = ts.createKeywordTypeNode(ts.SyntaxKind.AnyKeyword)
  } else if (schema.type === 'void') {
    node = ts.createNull()
  } else {
    throw new Error(`unsupported type: ${JSON.stringify(schema, null, '\t')}`)
  }

  if (schema.isArray) {
    node = ts.createArrayTypeNode(node)
  }

  if (schema.isNullable) {
    if (ts.isUnionTypeNode(node)) {
      const children = node.types
      node = ts.createUnionTypeNode([
        ...children,
        ts.createNull()
      ])
    } else {
      node = ts.createUnionTypeNode([
        node,
        ts.createNull()
      ])
    }
  }

  return node
}

// Currently only supports number and string literal
function convertToLiteral(val: string | number | any): ts.StringLiteral | ts.NumericLiteral {
  switch (typeof val) {
    case 'string':
      return ts.createStringLiteral(val)
    case 'number':
      return ts.createNumericLiteral(val + '')
    default:
      throw new Error('Unsupported enum type.')
  }
}
