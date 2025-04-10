# libp2a

libp2a provides access to the
[P2A API](https://p2a.telescope.chat/api/v1/docs) from
Javascript and Typescript.

* [Installation](#installation)
* [Introduction](#introduction)
* [Why](#why)
* [Usage](#usage)
  - [Call](#call)
  - [Chat](#chat)
* [How it works](#how-it-works)
  - [Execution plan](#execution-plan)
  - [Security](#security)
* [Command Line Interface (CLI)](#command-line-interface-cli)
* [Contributing](#contributing)

# Installation

```bash
npm install @libp2a/libp2a

# or globally, to use the CLI

npm install -g @libp2a/libp2a
```

# Introduction

libp2a provides access to hundreds of APIs using natural language and a single
authentication mechanism. For example:

```ts
import { call } from "@libp2a/libp2a"

app.get("/address/report", async (req, res) => {
  const { location, email } = req.params

  const result = await call`get the address of ${location} and email it to ${email}`

  return res.json(result)
})
```

> Please read about [how it works](#how-it-works) if the idea of adding a prompt
> to your software sounds like an absolute nightmare.

# Why

Implementing software integrations is a tedious process. Boring, not hard.
We have learn how the other software works, which endpoints are available, learn
the names and the types, learn the ever slightly different authentication
mechanisms.

libp2a aims to be the only SDK needed to integrate with any API, using natural
language familiar to you and your problem domain. 

# Usage

libp2a provides two functions: `call` and `chat`.

## Call

The `call` function executes one or more actions and returns a result.
The execution plan is guaranteed to be the same for the same prompt key,
and results are guaranteed to always have the same format. The `call` function
is meant to be deployed to production.

```ts
import { call } from "@libp2a/libp2a"

const { value } = await call`get the address of Outback downtown Houston`

console.log(value) // # => { "full": "10001 Westheimer Rd #1010, Houston, TX 77042, USA", "postal_code": "77042", "street_name": "Westheimer Road", "complement": "1010", "neighborhood": "Westside", "city_name": "Houston", "state_name": "Texas", "state_code": "TX", "country_name": "United States", "country_code": "US" }
```

## Chat

The `chat` function executes one or more actions and returns a string. The
executing plan is reevaluated on every call. The `chat` function is meant to
assist during development and should not be deployed to production.

```ts
import { chat } from "libp2a"

const { value } = await chat("get the address of zipcode 77042 and return only the city name")

console.log(value) // # => "Houston"
```

# How it works

libp2a has two pieces:

* **The client**, which is this open source library.
* **The service**, which is a closed source service hosted by the Nova Team at
  [nova-integration.webflow.io](https://nova-integration.webflow.io/).

## Execution plan

In order to make remote calls using natural language viable, predictable,
secure and fast we cannoy rely on LLMs. At least not for every call.

The first step before executing an action is parsing the instruction and building
an execution plan. Even though it looks like a string is being passed into `call`,
there are several steps behind the scene. For example:

```ts
call`get the address of ${company}`
```

The following steps are executed on the first run.

1. A unique key is generated for the instruction "get the address of".
2. The instruction and the arguments are sent to the P2A service to be parsed
   and analyzed. The response from P2A is an execution plan encoded as data.
   In this example, the execution plan is a single request to the endpoint
   `/geo/get_address_by_description`.
3. The client and the server cache the execution plan. The client caches for
   performance, and the server cache for consistency and security.
4. The plan is executed.

Because of the cache, the execution plan is known from the second run forwards.
This means whenever <code>call`get the address of ${company}`</code>
runs it immediatly sends a request to the `/geo/get_address_by_description`
with no extra overhead.

> Just to give you an idea of the order of magnitude, the first run takes 1~2s,
> and the second takes 50~80ms.

## Security

The first question 

# Command Line Interface (CLI)

The package includes a CLI that provides easy access to both `call` and `chat` functions from the command line. The CLI can be used in two ways:

1. **Direct usage** (uses `call` by default):
```bash
p2a "get the address of Outback downtown Houston"
```

2. **Chat mode** - Get processed results based on your prompt:
```bash
p2a chat "get the address of zipcode 77042 and return only the city name"
```

#### Local Development

To build and test the CLI locally:

1. Clone the repository and install dependencies:
```bash
git clone https://github.com/libp2a/libp2a-node.git
cd libp2a-node
npm install
```

2. Build the package:
```bash
npm run build
```
This will:
- Build both the library and CLI
- Generate type definitions
- Make the CLI executable

3. Link the package locally:
```bash
npm link
```
This creates a symbolic link from the global `node_modules` to your local development directory.

4. Test the CLI:
```bash
# Test the version command
p2a --version

# Test the call command
p2a call "get the address of Outback downtown Houston"

# Test the chat command
p2a chat "get the address of zipcode 77042 and return only the city name"
```

5. To unlink the package when you're done:
```bash
npm unlink
```

Note: If you make changes to the CLI code, you'll need to rebuild the package (`npm run build`) for the changes to take effect.
