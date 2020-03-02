import * as YAML from 'js-yaml'
import * as path from 'path'
import * as fs from 'fs'
import { OpenAPIObject, PathsObject, OperationObject } from 'openapi3-ts'

const testFilePath = path.resolve(__dirname, '../testing/petstore.yml')

function loadYAML() {
  const file = fs.readFileSync(testFilePath, 'utf-8')
  return YAML.safeLoad(file) as OpenAPIObject
}

const loadedYAML = loadYAML()

export function getOperationObject(path: string, verb: 'get' | 'put' | 'post' | 'delete') {
  const data = loadedYAML
  const pathsObj = data.paths[path] as PathsObject
  return pathsObj[verb] as OperationObject
}
