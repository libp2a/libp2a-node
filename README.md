# libp2a

This package is a Typescript/Javascript client for the [P2A service](https://p2a.telescope.chat/api/v1/docs).

* [Function call](#function-call)
* [Function chat](#function-chat)
* [Command Line Interface (CLI)](#command-line-interface-cli)
* [Local Development](#local-development)
* [Using as an MCP in Cursor](#using-as-an-mcp-in-cursor)


#### Function call

Runs one of the available functions based on the prompt and returns the exact
output of the function in the value field.

```ts
import { call } from "libp2a";

const { value } = await call("get the address of Outback downtown Houston");

console.log(value); // # => { "full": "10001 Westheimer Rd #1010, Houston, TX 77042, USA", "postal_code": "77042", "street_name": "Westheimer Road", "complement": "1010", "neighborhood": "Westside", "city_name": "Houston", "state_name": "Texas", "state_code": "TX", "country_name": "United States", "country_code": "US" }
```

#### Function chat

Runs one of the available functions based on the prompt and returns a modified
version of the function's output according to the prompt instructions.

```ts
import { chat } from "libp2a";

const { value } = await chat("get the address of zipcode 77042 and return only the city name")

console.log(value); // # => "Houston"
```

#### Command Line Interface (CLI)

The package includes a CLI that provides easy access to both `call` and `chat` functions from the command line.

##### Installation

You can install the package globally to use the CLI from anywhere:

```bash
npm install -g @libp2a/libp2a
```

Or install it locally in your project:

```bash
npm install @libp2a/libp2a
```

##### Usage

The CLI can be used in three ways:

1. **Direct usage** (uses `call` by default):
```bash
p2a "get the address of Outback downtown Houston"
```

2. **Explicit call** - Execute a function and get structured data:
```bash
p2a call "get the address of Outback downtown Houston"
```

3. **Chat mode** - Get processed results based on your prompt:
```bash
p2a chat "get the address of zipcode 77042 and return only the city name"
```

##### Additional Commands

- Get help information:
```bash
p2a --help          # General help
p2a call --help     # Help for call command
p2a chat --help     # Help for chat command
```

- Check version:
```bash
p2a --version
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

#### Using as an MCP in Cursor

To use libp2a as a Model Control Protocol (MCP) service in Cursor, follow these steps:

1. First, install the package globally:
```bash
npm install -g @libp2a/libp2a
```

2. Create or update your Cursor MCP configuration file at `~/.cursor/mcp.json`:
```json
{
  "mcpServers": {
    "p2a": {
      "name": "Prompt to Action (P2A) Service",
      "command": "p2a-mcp",
      "type": "stdio",
      "description": "Address and location service with structured data and natural language processing. Examples:\n- Get full address: 'get the address of Outback downtown Houston'\n- Get specific info: 'what's the zip code for Central Park NY'\n- Find location: 'where is the nearest Starbucks in Manhattan'\n- Extract components: 'get the street name for 123 Main St, Boston MA'"
    }
  }
}
```

This configuration will:
- Use the `p2a-mcp` command to interact with the P2A service
- Run in stdio mode for direct communication
- Provide helpful examples of the types of queries you can make

The service will now be available in Cursor, allowing you to make location and address-related queries directly from your editor.

Note: Make sure you have set up any required environment variables, such as `P2A_BASE_URL` if you're using a custom P2A service endpoint.
