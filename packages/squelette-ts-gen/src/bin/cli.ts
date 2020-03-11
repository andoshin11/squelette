import * as fs from 'fs'
import * as path from 'path'
import * as YAML from 'js-yaml'
import * as commander from 'commander'
import Generator from '../generator'

const pkg = require('../../package.json')

commander
  .version(pkg.version)
  .description("Generate type definitions from swagger specs")
  .command("generate <file>")
  .option("-n, --namespace <namespace>", "Root namepace")
  .option("-d, --dist <dist>", "Output directory")
  .action(async (file: string, options: { namespace?: string, dist?: string }) => {
    const { namespace, dist } = options
    try {
      if (!namespace) {
        throw new Error('Namespace is required. Please specify with --namespace option.')
      }

      if (!dist) {
        throw new Error('Dist directory is required. Please specify with --dist option.')
      }

      if (/\.ya?ml$/.test(file)) {
        if (!fs.existsSync(path.resolve(process.cwd(), file))) {
          throw new Error('File does not exist.')
        }
        const target = fs.readFileSync(path.resolve(process.cwd(), file), 'utf-8')
        const yaml = YAML.safeLoad(target)
        new Generator(yaml, { namespace, dist }).generate()
      }
    } catch (e) {
      console.error(e)
      process.exit(2)
    }
  })

commander.parse(process.argv)
