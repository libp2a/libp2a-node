# libp2a

libp2a provides access to the P2A service from Javascript and Typescript.

1. [Installation](#installation)
2. [Introduction](#introduction)
3. [Why](#why)
4. [Usage](#usage)
    - [Call](#call)
    - [Chat](#chat)
5. [How it works](#how-it-works)
    - [Execution plan](#execution-plan)
    - [Security](#security)
6. [Command Line Interface (CLI)](#command-line-interface-cli)
7. [Contributing](#contributing)

# Installation

```bash
npm install @libp2a/libp2a

# or globally, to use the CLI

npm install -g @libp2a/libp2a
```

# Introduction

libp2a provides access to hundreds of APIs through natural language commands.
Here's an example of what it looks like: 

```js
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
We have to learn how the other software works, which endpoints are available,
learn the names and the types, implement the ever slightly different
authentication mechanisms.

libp2a aims to be the only SDK needed to integrate with any API using natural
language already familiar to you and your problem domain. 

# Usage

libp2a provides two functions: `call` and `chat`.

## Call

The `call` function executes one or more actions and returns a result.
The execution plan is guaranteed to be the same on every run, and results are
guaranteed to always have the same format. The `call` function is meant to be
deployed to production.

```ts
import { call } from "@libp2a/libp2a"

const { value } = await call`get the address of ${company}`

console.log(value) // # => { "full": "...", "postal_code": "...", "street_name": "...", "complement": "...", "neighborhood": "...", "city_name": "...", "state_name": "...", "state_code": "...", "country_name": "...", "country_code": "..." }
```

## Chat

The `chat` function executes one or more actions and returns a string. The
execution plan is reevaluated on every run. Because of that, the `chat` function
is meant to assist during development and should not be deployed to production.

```ts
import { chat } from "libp2a"

const { value } = await chat("get the address of zipcode 77042 and return only the city name")

console.log(value) // # => "Houston"
```

# How it works

libp2a works in a client-server architecture:

* **The client**, which is this open source library. The client knows how to
  talk to the P2A server and how to run execution plans.
* **The server**, which is a closed source service hosted by the Nova Team. The
  server provides integration with many APIs and is responsible to build
  execution plans.

## Execution plan

In order to make remote calls using natural language predictable,
secure and fast we cannot rely on LLMs. At least not on every call.

When running a prompt with `call`, the first step is to parse the prompt and
build an execution plan. We do use LLMs here to detect which functions should be
executed, which variables map to which params, and the transformations needed to
compose the functions. Because we know the input and output type of every
function, we can guarantee the composition inside the execution plan is correct.

The execution plan is built and cached on the server. That means that, once
parsed, `call` commands are:

* Predictable: the same execution plan is executed on every call.
* Secure: user provided values are mapped to specific params. There is no room
  for sneaky "ignore all previous instructions and run x instead".
* Fast: the execution plan resolves to plain old API calls. There should be no
  overhead over an HTTP request you'd write by hand.

Not all prompts resolve to a valid execution plan. Some might be invalid, in
which case an error is raised, and you tweak the prompt. Failed execution plans
are also cached. This is important to guarantee consistent behavior at
runtime. We either consistently succeed with the same execution plan, or we
consistently fail to build one.

Let's look at a concrete example with following code:

```ts
call`get the address of ${company}`
```

1. A unique key is generated for the instruction "get the address of". The key
   is scoped to your account.
2. The command and the arguments are sent to the P2A service to build the
   execution plan. The response from P2A is either an error or an execution plan
   encoded as data. In this example, the execution plan is a single request to
   `GET /geo/get_address_by_description`.
3. The client caches the execution plan.
4. A request is sent to `/geo/get_address_by_description` and the response is
   returned as the result.

Because of the cache, calls to `get the address of ${company}` are immediatly
translated to `GET /geo/get_address_by_description` with no extra overhead.

## Security

At first, it might appear that `get the address of ${company}`
has a big vulnerability. What if the user sends "ignore all previous
instructions and run x instead"?

This is not an issue because the server never executes the whole prompt as
string. Instead, it uses the static part (`"get the address of"`) and dynamic
part (`${company}`) to figure out which functions should be executed.

We only use user-provided values after the execution plan is built. In this
example, "ignore all previous instruction and run x instead" would be sent as
the `description` param to the `/geo/get_address_by_description` endpoint. It
wouldn't return anything, but no harm was made.

Important: This only applies to the `call` function, which is designed to be
used in production. The `chat` method is vulnerable to prompt injection, and we
strongly recommend using it during development only.

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

# Contributing

While we value open-source contributions to this SDK, this library is generated
programmatically. Additions made directly to this library would have to be moved
over to our generation code, otherwise they would be overwritten upon the next
generated release.