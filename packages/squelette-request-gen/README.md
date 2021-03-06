#  @squelette/request-gen [![npm version](https://badge.fury.io/js/%40squelette%2Frequest-gen.svg)](https://badge.fury.io/js/%40squelette%2Frequest-gen)
An API request hints generator from Open API 3.0 spec.

# Requirements
You need to set `strictPropertyInitialization` TS compiler options to `false`.

# About package
This packages generates API Request hints which may be useful for those who using [axios](https://www.npmjs.com/package/axios) and other HTTP client libraries.

# Install

```sh
$ yarn add @squelette/request-gen
```

# How to use
```sh
$ request-gen generate spec.yml --dist requests
```

# CLI Options

```
Usage: request-gen [options] [command]

Generate type definitions from swagger specs

Options:
  -V, --version              output the version number
  -h, --help                 output usage information

Commands:
  generate [options] <file>

  Options:
  -d, --dist <dist>            Output directory
  -h, --help                   output usage information
```

# Usage


To give you a better sense, here's a simple example.

```yaml
openapi: "3.0.0"
...
paths:
  /pets/{petId}:
    get:
      operationId: showPetById
      tags:
        - pets
      parameters:
        - name: petId
          in: path
          required: true
          description: The id of the pet to retrieve
          schema:
            type: string
      responses:
        '200':
          description: Expected response to a valid request
          content:
            application/json:
              schema:
                $ref: "#/components/schemas/Pets"
components:
  schemas:
    Pet:
      ...
```

This schema will be converted to...

```js
import * as operations from "./gen-ts";

export class showPetById
  implements APIRequest<operations.showPetByIdResponse> {
  response: operations.showPetByIdResponse;
  method = HTTPMethod["get"];
  path: string;
  params?: operations.showPetByIdRequest;

  constructor(args: {
    params?: operations.showPetByIdRequest;
    pathParameter: operations.showPetByIdPathParameter;
  }) {
    const { params, pathParameter } = args;
    this.params = params;
    this.path = `/pets/${pathParameter.petId}`;
  }
}
```

The generated schema can be used with your API client like this.

```js
# Your API Client
import axios from 'axios'

class APIClient {
  baseURL = 'https//hogehoge.com'

  request<U>(hint: APIRequest<U>): Promise<U> {
    const isRead = request.method === HTTPMethod.GET

    return axios.request({
      url: hint.path,
      method: hint.method,
      params: isRead && request.params,
      data: !isRead && request.params,
      baseURL: request.baseURL || this.baseURL
    })
  }
}

# Call API
import { showPetByID } from './requests'

new APIClient().request(new showPetByID({
  pathParameter: {
    petId: 'hoge'
  }
}))
```


# Detailed Example
See [example](https://github.com/andoshin11/squelette/tree/master/packages/squelette-request-gen/example/README.md).

# License
MIT
