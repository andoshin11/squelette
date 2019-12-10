import * as fs from 'fs'
import * as path from 'path'
import * as ejs from 'ejs'
import * as prettier from 'prettier'
import { OpenAPIObject } from 'openapi3-ts'
import { mapTS, parse } from '@squelette/core'
import { IDefinition, GenFileRequest } from './types'
import * as helper from './helper'

export default class Generator {
  private definitionDir = 'models'
  private spec: OpenAPIObject
  private options: CodeGenOptions

  constructor(spec: OpenAPIObject, options: CodeGenOptions) {
    this.spec = spec
    this.options = options
  }

  private createEjsOptions(params: { filename: string }): ejs.Options {
    const defaultOptions = {
      root: path.resolve(__dirname, '../../templates'),
    }
    return {
      ...defaultOptions,
      ...params
    }
  }

  generate() {
    if (this.spec.openapi !== '3.0.0') {
      throw new Error(
        `Only 3.0.0 is supported. Your version: ${this.spec.openapi}`
      )
    }

    // Parse spec
    const data = this.parseSpec()

    // Setup templates
    const indexTemplate = path.resolve(__dirname, '../../templates/index.ejs')
    const definitionTemplate = path.resolve(__dirname, '../../templates/definition.ejs')
    const rootTemplate = path.resolve(__dirname, '../../templates/root.ejs')
    const namespaceTemplate = path.resolve(__dirname, '../../templates/namespace.ejs')

    // Setup dist
    if (!fs.existsSync(this.dist)) {
      fs.mkdirSync(this.dist)
    }

    // Setup output directory
    const definitionDirPath = path.resolve(this.dist, this.definitionDir)
    if (data.definitions.length > 0 && !fs.existsSync(definitionDirPath)) {
      fs.mkdirSync(definitionDirPath)
    }

    // console.log(JSON.stringify(data, null, '\t'))

    // Create files and write schema
    const definitionNames = data.definitions.map(d => d.name)
    this.genFiles([
      ...data.definitions.map(definition => ({
        filepath: path.resolve(definitionDirPath, `${definition.name}.ts`),
        content: ejs.render(this.readFileSync(definitionTemplate), { ...definition, helper }, this.createEjsOptions({ filename: definitionTemplate })) as string
      })),
      {
        filepath: path.resolve(definitionDirPath, 'index.ts'),
        content: ejs.render(this.readFileSync(indexTemplate), { names: definitionNames }, this.createEjsOptions({ filename: indexTemplate })) as string
      },
      {
        filepath: path.resolve(this.dist, 'namespace.ts'),
        content: ejs.render(this.readFileSync(namespaceTemplate), { ...data, definitionDir: this.definitionDir, helper }, this.createEjsOptions({ filename: namespaceTemplate })) as string
      },
      {
        filepath: path.resolve(this.dist, 'index.ts'),
        content: ejs.render(this.readFileSync(rootTemplate), { definitionDir: this.definitionDir }, this.createEjsOptions({ filename: rootTemplate })) as string
      }
    ])
  }

  private readFileSync(path: string): string {
    return fs.readFileSync(path, 'utf-8')
  }

  parseSpec() {
    const components = this.spec.components || {}
    const schemas = components.schemas || {}

    const definitions: IDefinition[] = Object.keys(schemas).map(key => {
      return {
        name: key,
        schema: mapTS(schemas[key])
      }
    })

    return {
      definitions,
      namespace: this.options.namespace,
      tags: parse(this.spec)
    }
  }

  /**
   * Generate files with requests
   * @param genCodeRequests
   */
  private genFiles(genCodeRequests: GenFileRequest[]) {
    genCodeRequests.forEach(v => {
      fs.writeFileSync(v.filepath, prettier.format(v.content, { parser: 'typescript' }), {
        encoding: 'utf-8',
        flag: 'w+'
      })
      console.log('Generated:', v.filepath)
    })
  }

  /**
   * Get dist path
   */
  get dist(): string {
    return path.resolve(process.cwd(), this.options.dist)
  }
}

/**
 * Options for TSCodeGenerator
 */
export interface CodeGenOptions {
  namespace: string
  dist: string
}
