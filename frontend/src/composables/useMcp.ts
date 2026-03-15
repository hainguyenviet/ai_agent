import axios from "axios";
import { ref } from "vue";

export function useMcp() {
  const mcpResponse = ref("");
  const mcpError = ref("");
  const loading = ref(false);

  async function callMcp(message = "kích hoạt MCP") {
    loading.value = true;
    mcpError.value = "";
    try {
      const response = await axios.post("/mcp/context", { message });
      mcpResponse.value = JSON.stringify(response.data, null, 2);
    } catch (error: unknown) {
      let message = "Unknown error";
      if (axios.isAxiosError(error)) {
        const data = error.response?.data as any;
        if (data && typeof data === "object" && "message" in data && typeof data.message === "string") {
          message = data.message;
        } else if (typeof data === "string") {
          message = data;
        } else if (error.message) {
          message = error.message;
        }
      } else if (error instanceof Error) {
        message = error.message;
      } else if (error !== undefined && error !== null) {
        message = String(error);
      }
      mcpError.value = `MCP error: ${message}`;
    } finally {
      loading.value = false;
    }
  }

  return { mcpResponse, mcpError, loading, callMcp };
}
