![npm version](https://badgen.net/npm/v/react-query-keys)
![license](https://badgen.net/npm/license/react-query-keys)
![types](https://badgen.net/npm/types/react-query-keys)
![language](https://badgen.net/packagist/lang/react-query-keys)

# react-query-keys

> helps create unique query keys for use with the [react-query package](https://tanstack.com/query/). inspired by the [query-key-factory](https://www.npmjs.com/package/@lukemorales/query-key-factory) package but less extensive and therefore simpler to use.

## Prerequisites

The purpose of this package is to make it easier to configure query keys for use with React Query library. You don't need that to use this package, but it is pretty much useless without it

```sh
$ yarn add @tanstack/react-query
```

## Table of contents

- [Project Name](#project-name)
  - [Prerequisites](#prerequisites)
  - [Table of contents](#table-of-contents)
  - [Getting Started](#getting-started)
  - [Installation](#installation)
  - [Usage](#usage)
    - [Creating your keys](#creating-your-keys)
    - [Using your keys](#using-your-keys)
  - [API](#api)
    - [all](#all)
    - [key](#key)
    - [Configuration](#configuration)
  - [Credits](#credits)

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

## Installation

To install the library, run:

```sh
$ npm install react-query-keys
```

Or if you prefer using Yarn:

```sh
$ yarn add react-query-keys
```

## Usage

### Creating your keys

```ts
import ReactQueryKeys from "react-query-keys";

// the name of this section of the app
const keysName = "customers";

const queryKeyConfig = {
  keyDefinitions: {
    list: {
      dynamicVariableNames: ["productCount", "customerId"],
    },
    detail: {
      dynamicVariableNames: ["customerId"],
    },
    pagedList: {
      childOf: "list",
      dynamicVariableNames: ["skip", "take"],
    },
  },
};

// create an instance of your keys for this section. I like to do this once for each section of an app and split my queries accordingly
const customerQueryKeys = new ReactQueryKeys(keysName, queryKeyConfig);
```

### Using your keys

```ts
import { useQuery, useMutation } from "@tanstack/react-query";

const useGetCustomersQuery = (customerId: string) =>
  useQuery(
    customerQueryKeys.key("list", { customerId }), // resolves to ['customers', 'list', { customerId }]
    () => getCustomers(customerId)
  );

const useCreateCustomerQuery = () =>
  useMutation(
    ({ customerId, customer }: { customerId: string; customer: Customer }) =>
      createCustomer(customer),
    {
      // invalidate all queries that contain ['customer', 'list'] in their key
      onSuccess: () =>
        reactQueryClient.invalidateQueries(customerQueryKeys.key("list")),
    }
  );
```

## API

### all

```ts
ReactQueryKeys.all();
```

Returns top level key for this instance. You can use this to refer to all other keys created with this instance. For example given a key `['customers', 'list']`, `reactQueryKeys.all()` would return `['customers']`.

### key

```ts
ReactQueryKeys.key(name: string, dynamicValues?: Record<string, any>)
```

Get the value of a specific key with option to provide an object literal with dynamic values, thus creating different query keys as the given values change.

### Configuration

`config`

| Name           | Type                                                                  |
| -------------- | --------------------------------------------------------------------- |
| keyDefinitions | Record<string, { childOf?: string, dynamicVariableNames?: string[] }> |

Use the `config` constructor parameter to create your query keys instance. Each `keyName` refers to query key you want to be able to use for this instance. You can configure each key to be a child of another key, thus making the key dependent on the `childOf` key. You can also provide `dynamicVariableNames` which are the property names for any dynamic values you would like to include in your key. For example to use the value `{ customerId: '123' }` in your key, you would have `dynamicVariableNames` include `'customerId'`.

## Credits

- [React Query](https://www.npmjs.com/package/@tanstack/react-query)
- [Query Key Factor](https://www.npmjs.com/package/@lukemorales/query-key-factory)
- [README template](https://gist.github.com/andreasonny83/7670f4b39fe237d52636df3dec49cf3a)
