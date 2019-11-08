#  @squelette/ts-gen [![npm version](https://badge.fury.io/js/%40squelette%2Fts-gen.svg)](https://badge.fury.io/js/%40squelette%2Fts-gen)
A type definition generator from Open API 3.0 spec.

# About package
This packages generates TypeScript interface from.

- Schema components
- Error object (for each status codes)
- Request bodies
- Query Parameters
- Response objects
- Path Parameters

# Install

```sh
$ yarn add @squelette/ts-gen
```

# How to use
```sh
$ ts-gen generate swagger.yml --namespace PetStore --dist types
```

# CLI Options

```
Usage: ts-gen [options] [command]

Generate type definitions from swagger specs

Options:
  -V, --version              output the version number
  -h, --help                 output usage information

Commands:
  generate [options] <file>

  Options:
  -n, --namespace <namespace>  Root namepace
  -d, --dist <dist>            Output directory
  -h, --help                   output usage information
```

# License
MIT