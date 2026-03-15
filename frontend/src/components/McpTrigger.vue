<template>
  <section class="mcp-section" aria-label="MCP Trigger">
    <h2>MCP Trigger</h2>
    <button :disabled="loading" @click="callMcp()">
      {{ loading ? "Đang gọi…" : "Gọi MCP" }}
    </button>
    <pre v-if="mcpResponse" aria-live="polite" aria-label="Kết quả MCP">{{ mcpResponse }}</pre>
    <p v-if="mcpError" class="mcp-section__error" role="alert">{{ mcpError }}</p>
  </section>
</template>

<script setup lang="ts">
import { useMcp } from "../composables/useMcp";

const { mcpResponse, mcpError, loading, callMcp } = useMcp();
</script>

<style scoped>
.mcp-section {
  margin-top: 1.5rem;
  background: #f9f9f9;
  padding: 0.75rem;
  border-radius: 6px;
}
.mcp-section h2 {
  margin-top: 0;
}
.mcp-section pre {
  background: #fff;
  border: 1px solid #ddd;
  padding: 0.5rem;
  border-radius: 4px;
  overflow-x: auto;
  white-space: pre-wrap;
  word-break: break-all;
}
.mcp-section__error {
  color: red;
}
</style>
