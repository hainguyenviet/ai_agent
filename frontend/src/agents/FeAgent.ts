import axios from "axios";

export type Item = {
  id: number;
  title: string;
  completed: boolean;
};

export type McpResponse = Record<string, unknown>;

/**
 * FeAgent – Frontend Agent
 *
 * Charter / Responsibility boundaries:
 *  - Owns ALL network I/O to the backend (/api/*) and the MCP server (/mcp/*).
 *  - Returns plain data objects; never reads or writes Vue reactive state or the DOM.
 *  - The component layer is solely responsible for mapping agent output into
 *    reactive refs and for rendering decisions.
 *  - Error propagation: exceptions are intentionally left unhandled here so that
 *    callers can apply their own UI-level error strategies.
 *
 * Out-of-scope (NOT this agent's responsibility):
 *  - Routing / navigation
 *  - Local component state (refs, computed, watchers)
 *  - DOM manipulation or styling
 *  - Authentication / authorisation (future concern)
 */
export class FeAgent {
  /** Fetch all items from the backend. */
  async getItems(): Promise<Item[]> {
    const { data } = await axios.get<Item[]>("/api/items");
    return data;
  }

  /** Create a new item with the given title. */
  async addItem(title: string): Promise<void> {
    await axios.post("/api/items", { title });
  }

  /** Toggle the completed state of an item by id. */
  async toggleItem(id: number): Promise<void> {
    await axios.patch(`/api/items/${id}/toggle`);
  }

  /** Permanently delete an item by id. */
  async removeItem(id: number): Promise<void> {
    await axios.delete(`/api/items/${id}`);
  }

  /**
   * Send a context message to the MCP server and return its structured response.
   * The MCP server is responsible for any model-context processing.
   */
  async triggerMcp(message: string): Promise<McpResponse> {
    const { data } = await axios.post<McpResponse>("/mcp/context", { message });
    return data;
  }
}

/** Singleton instance shared across the application. */
export const feAgent = new FeAgent();
