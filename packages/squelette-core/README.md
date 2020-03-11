# @squelette/core [![npm version](https://badge.fury.io/js/%40squelette%2Fcore.svg)](https://badge.fury.io/js/%40squelette%2Fcore)
Provides Open API parser and basic types.

# Breaking Changes :warning:
Since v1.0.0, `parse` method behaves differently from the previous versions.

```ts
type parsedContent = ReturnType<typeof parse>

// parsedContent === { [tag: string]: IOperation[] } <- before v1.0.0
// parsedContent === IOperation[]                    <- after v1.0.0
```


# Limitations
- Currently, this package only accepts Open API 3.0 written in yaml.

# Install

```sh
$ yarn add @squelette/core
```

# How to use programmatically
```js
import fs from "fs"
import YAML from "js-yaml"
import { parse } from '@squelette/core'

const file = fs.readFileSync(YOUR_FILE_PATH, 'utf-8')
const yaml = YAML.safeLoad(file)

// retrive abstract syntax tree
const parsedAST = parse(yaml)
```

# License
MIT
