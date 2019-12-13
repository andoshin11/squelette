import * as fs from 'fs'
import * as path from 'path'
import * as ejs from 'ejs'
import * as prettier from 'prettier'
import { OpenAPIObject } from 'openapi3-ts'
import { parse } from '@squelette/core'
import { GenFileRequest } from './types'
import * as helper from './helper'

export default class Generator {
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
    const pathsTemplate = path.resolve(__dirname, '../templates/paths.ejs')
    const typesTemplate = path.resolve(__dirname, '../templates/types.ejs')

    // Setup dist
    if (!fs.existsSync(this.dist)) {
      fs.mkdirSync(this.dist)
    }

    // console.log(JSON.stringify(data, null, '\t'))

    // Create files and write schema
    this.genFiles([
      {
        filepath: path.resolve(this.dist, 'paths.ts'),
        content: ejs.render(this.readFileSync(pathsTemplate), { helper, tags: data.tags }, this.createEjsOptions({ filename: pathsTemplate })) as string
      },
      {
        filepath: path.resolve(this.dist, 'types.ts'),
        content: ejs.render(this.readFileSync(typesTemplate), {}, this.createEjsOptions({ filename: typesTemplate })) as string
      }
    ])
  }

  private readFileSync(path: string): string {
    return fs.readFileSync(path, 'utf-8')
  }

  parseSpec() {
    return {
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
  dist: string
}
