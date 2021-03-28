import * as ts from 'typescript'
import { TSSchema } from './types'

const printer = ts.createPrinter()

export function printList(nodeList: ts.Node[]) {
  return printer.printList(
    ts.ListFormat.MultiLine,
    ts.factory.createNodeArray(nodeList),
    ts.createSourceFile('', '', ts.ScriptTarget.ES2015)
  )
}

export function SchemaToAST(schema: TSSchema) {
  const hasProperties = schema.type === 'object' || !!Object.keys(schema.properties).length
  const isEnum = !!schema.enum.length

  let node: ts.TypeNode
  if (hasProperties) {
    const keys = Object.keys(schema.properties)
    node = ts.factory.createTypeLiteralNode(keys.map(key => {
      const property = schema.properties[key]
      return ts.factory.createPropertySignature(
        undefined,
        ts.factory.createStringLiteral(key),
        property.isRequired ? undefined : ts.createToken(ts.SyntaxKind.QuestionToken),
        SchemaToAST(property)
      )
    }))
  } else if (isEnum) {
    node = ts.factory.createUnionTypeNode(schema.enum.map(i => {
      return ts.factory.createLiteralTypeNode(convertToLiteral(i))
    }))
  } else if (schema.isRef) {
    node = ts.factory.createTypeReferenceNode(
      ts.factory.createIdentifier(schema.type),
      undefined
    )
  } else if (schema.type === 'number') {
    node = ts.factory.createKeywordTypeNode(ts.SyntaxKind.NumberKeyword)
  } else if (schema.type === 'string') {
    node = ts.factory.createKeywordTypeNode(ts.SyntaxKind.StringKeyword)
  } else if (schema.type === 'boolean') {
    node = ts.factory.createKeywordTypeNode(ts.SyntaxKind.BooleanKeyword)
  } else if (schema.type === 'Date') {
    node = ts.factory.createTypeReferenceNode(ts.factory.createIdentifier('Date'), undefined)
  } else if (schema.type === 'any') {
    node = ts.factory.createKeywordTypeNode(ts.SyntaxKind.AnyKeyword)
  } else if (schema.type === 'void') {
    node = ts.factory.createLiteralTypeNode(ts.factory.createNull())
  } else {
    throw new Error(`unsupported type: ${JSON.stringify(schema, null, '\t')}`)
  }

  if (schema.isArray) {
    node = ts.factory.createArrayTypeNode(node)
  }

  if (schema.isNullable) {
    if (ts.isUnionTypeNode(node)) {
      const children = node.types
      node = ts.factory.createUnionTypeNode([
        ...children,
        ts.factory.createLiteralTypeNode(ts.factory.createNull())
      ])
    } else {
      node = ts.factory.createUnionTypeNode([
        node,
        ts.factory.createLiteralTypeNode(ts.factory.createNull())
      ])
    }
  }

  return node
}

// Currently only supports number and string literal
function convertToLiteral(val: string | number | any): ts.StringLiteral | ts.NumericLiteral {
  switch (typeof val) {
    case 'string':
      return ts.factory.createStringLiteral(val)
    case 'number':
      return ts.factory.createNumericLiteral(val + '')
    default:
      throw new Error('Unsupported enum type.')
  }
}
