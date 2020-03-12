import * as fs from 'fs'
import * as path from 'path'
import * as ejs from 'ejs'
import * as prettier from 'prettier'
import { OpenAPIObject } from 'openapi3-ts'
import { mapTS, parse } from '@squelette/core'
import TSGen from '@squelette/ts-gen'
import { IDefinition, GenFileRequest } from './types'
import * as helper from './helper'

export default class Generator {
  private tsGenDir = 'gen-ts'
  private spec: OpenAPIObject
  private options: CodeGenOptions

  constructor(spec: OpenAPIObject, options: CodeGenOptions) {
    this.spec = spec
    this.options = options
  }

  private createEjsOptions(params: { filename: string }): ejs.Options {
    const defaultOptions = {
      root: path.resolve(__dirname, '../templates'),
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
    const typesTemplate = path.resolve(__dirname, '../templates/types.ejs')
    const requestsTemplate = path.resolve(__dirname, '../templates/requests.ejs')
    const indexTemplate = path.resolve(__dirname, '../templates/index.ejs')

    // Setup dist
    if (!fs.existsSync(this.dist)) {
      fs.mkdirSync(this.dist)
    }

    // Generate TS definitions.
    new TSGen(this.spec, { dist: path.resolve(this.dist, this.tsGenDir) }).generate()

    // console.log(JSON.stringify(data, null, '\t'))

    // Create files and write schema
    this.genFiles([
      {
        filepath: path.resolve(this.dist, 'types.ts'),
        content: ejs.render(this.readFileSync(typesTemplate), this.createEjsOptions({ filename: typesTemplate }))
      },
      {
        filepath: path.resolve(this.dist, 'requests.ts'),
        content: ejs.render(this.readFileSync(requestsTemplate), { ...data, helper }, this.createEjsOptions({ filename: requestsTemplate })) as string
      },
      {
        filepath: path.resolve(this.dist, 'index.ts'),
        content: ejs.render(this.readFileSync(indexTemplate), this.createEjsOptions({ filename: indexTemplate })) as string
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
      operations: parse(this.spec)
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
  dist: string
}
