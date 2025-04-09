# libp2a

libp2a provides access to the
[P2A service](https://p2a.telescope.chat/api/v1/docs) from
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

libp2a provides access to hundreds of APIs and services with a single function
call. It accepts a description of one or more actions, it executes the actions
and returns a result.

```ts
import { call } from "@libp2a/libp2a"

app.get("/address/report", async (req, res) => {
  const { location, email } = req.params

  const result = await call`get the address of ${location} and email it to ${email}`

  return res.json(result)
})
```

> :warning: Please read about [how it works](#how-it-works) if the idea of
> adding a prompt to your software sounds like an absolute nightmare.

# Why

Implementing software integrations is a tedious process. Boring, not hard.
We have learn how the other software works, which endpoints are available, learn
names and types, learn the ever slightly different authentication mechanisms.

libp2a's goal is to be the only SDK you need to integrate with any web service.
The ingrations are implemented using natural language that makes sense to you
and your problem domain.

# Usage

libp2a provides two functions: `call` and `chat`.

## Call

The `call` function executes one or more actions and returns a result.
The execution plan is guaranteed to be the same for the same prompt key,
and results are guaranteed to always have the same format for the prompt key.

The `call` function is meant to be deployed to production.

```ts
import { call } from "@libp2a/libp2a"

const result = await call`get the address of Outback downtown Houston`

console.log(result) // # => { "full": "10001 Westheimer Rd #1010, Houston, TX 77042, USA", "postal_code": "77042", "street_name": "Westheimer Road", "complement": "1010", "neighborhood": "Westside", "city_name": "Houston", "state_name": "Texas", "state_code": "TX", "country_name": "United States", "country_code": "US" }
```

## Chat

The `chat` function executes one or more actions and returns a string.

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

## Security

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
