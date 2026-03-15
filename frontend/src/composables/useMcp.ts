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
    } catch (error) {
      mcpError.value = `MCP error: ${error}`;
    } finally {
      loading.value = false;
    }
  }

  return { mcpResponse, mcpError, loading, callMcp };
}
