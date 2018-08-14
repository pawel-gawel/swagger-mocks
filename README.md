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

Server will pick up files from directory and pipe them to output, whenever mocks for specified path exist.

If there is no data, but there is a path defined in swagger definitions, server will respond with not-that-intuitive 

```
HTTP/1.1 405 Method Not Allowed
```

This is something that `swagger-server` does.

When you try to request or non-existent path, you will get

```
HTTP/1.1 404 Not Found
```
with body 

```
404 Error!</h1><pre>Resource not found: /non/existent/path
```

and server will report to the console

```
WARNING! Unable to find a Swagger path that matches "/non/existent/path"
```

## Swagger default data

One can define default data structure to each definition in swagger file, leveraging `default` section. This structure will be returned by the server whenever path matches and there is no mocked data for specific path. This will also allow 405 errors.

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

## Mocked data format

`swagger-server` expects mocks to be in some particular format. It shoul adhere to structure of

```
[
  {
    name: "entity name / primary key",
    data: {
      // data in format defined by swagger definitions
    }
  }
]
```
