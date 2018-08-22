# Swagger Mocks server

This package is a wrapper around `swagger-server` library. 

## Installation

```
npm install -g @automatic-labs/swagger-mocks
```

## Terminal command

Whenever package is installed, there will be new terminal command abailable. Go with 

```
swagger-mocks -h
```
to inspect its usage.

Command takes two arguments:
 - swagger definitions file path,
 - path to mocked data directory

for example

```
swagger-mocks path/to/api.yaml path/to/mocks/
```

Server will pick up files from directory and pipe them to output, whenever mocks for specified path exist.

If there is no data, but there is a path defined in swagger definitions, server will respond with 404.

When you try to request for non-existent path, you will get the same error code with body 

```
404 Error!</h1><pre>Resource not found: /non/existent/path
```

and server will report to the console

```
WARNING! Unable to find a Swagger path that matches "/non/existent/path"
```

## Swagger default data

One can define default data structure to each definition in swagger file, leveraging `default` or `wxample` section. This structure will be returned by the server whenever path matches and there is no mocked data for specific path. This will also allow 405 errors.

Example:

```
definitions:
  Vehicle:
    type: object
    required:
    - id
    - displayName
    - isConnected
    properties:
      id:
        type: string
      displayName:
        type: string
      isConnected:
        type: boolean
      pendingPayments:
        type: integer
        example: 1
      totalAmountPaid:
        type: number
      tollsPaid:
        type: integer
    default:
      id: DEFAULT_VEHICLE
      totalAmountPaid: 9.99
      tollsPaid: 999
```

For more examples you can look into `api.yaml` file as well as `mocked-data/` directory, which are a part of this repo.

> When running with examplary files, issue commands listed below (assuming default port number) and refer to appropriate `mocked-data` files as well as `default`/`example` sections in `api.yaml` file to understand what is going on.
>
> `curl localhost:3003/v1/vehicles` - to get the list of vehicles defined in files from `mocked-data/vehicles/` directory,
>
> `curl localhost:3003/v1/vehicles/C_123` - for server to return vehicle with name of `C_123` from `mocked-data/vehicles/C_123.json`,
>
> `curl localhost:3003/v1/vehicles/nonExistentKey` - to get single vehicle from `default` section of appropriate yaml definition,
>
> `curl localhost:3003/v1/no-mocked-data` - to experience 404 response due to lack of both `default`/`example` section for `NoMockedData` definition as well as matching json file in `mocked-data/` directory,
>
> `curl localhost:3003/v1/non-existent-path` - to experience 404 response.
