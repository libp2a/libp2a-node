#!/usr/bin/env node

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

const server = new McpServer({
  name: "libp2a-node",
  version: "1.0.0"
});

// Tool to execute p2a call command
server.tool(
  "p2a_call",
  {
    prompt: z.string().describe("The prompt to execute")
  },
  async ({ prompt }) => {
    try {
      const { stdout, stderr } = await execAsync(`p2a call "${prompt}"`);
      return {
        content: [
          {
            type: "text",
            text: stdout || stderr || "Command executed successfully"
          }
        ]
      };
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      return {
        content: [
          {
            type: "text",
            text: `Error executing p2a call: ${errorMessage}`
          }
        ],
        isError: true
      };
    }
  }
);

// Tool to execute p2a chat command
server.tool(
  "p2a_chat",
  {
    prompt: z.string().describe("The prompt to process")
  },
  async ({ prompt }) => {
    try {
      const { stdout, stderr } = await execAsync(`p2a chat "${prompt}"`);
      return {
        content: [
          {
            type: "text",
            text: stdout || stderr || "Command executed successfully"
          }
        ]
      };
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      return {
        content: [
          {
            type: "text",
            text: `Error executing p2a chat: ${errorMessage}`
          }
        ],
        isError: true
      };
    }
  }
);

// Start the server with stdio transport
const main = async () => {
  const transport = new StdioServerTransport();
  await server.connect(transport);
};

main().catch(console.error);
