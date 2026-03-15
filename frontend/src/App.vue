<template>
  <div class="app">
    <p>Hello World</p>
    <h1>AI Agent Vue + DB + MCP</h1>
    <input v-model="title" placeholder="Tên item" />
    <button @click="addItem">Thêm</button>

    <ul>
      <li v-for="item in items" :key="item.id">
        <label>
          <input type="checkbox" :checked="item.completed" @change="toggle(item.id)" />
          <span :style="{ textDecoration: item.completed ? 'line-through' : 'none' }">{{ item.title }}</span>
        </label>
        <button @click="remove(item.id)">Xóa</button>
      </li>
    </ul>

    <div class="log">
      <h2>MCP Trigger</h2>
      <button @click="callMcp">Gọi MCP</button>
      <pre>{{ mcpResponse }}</pre>
    </div>

    <div v-if="errorMsg" class="error">
      {{ errorMsg }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { feAgent, type Item } from "./agents/FeAgent";

const title = ref("");
const items = ref<Item[]>([]);
const mcpResponse = ref("");
const errorMsg = ref("");

async function loadItems() {
  try {
    items.value = await feAgent.getItems();
    console.log("Loaded items:", items.value);
  } catch (error) {
    console.error("Error loading items:", error);
    errorMsg.value = `Error: ${error}`;
  }
}

async function addItem() {
  if (!title.value.trim()) return;
  try {
    await feAgent.addItem(title.value);
    title.value = "";
    await loadItems();
  } catch (error) {
    console.error("Error adding item:", error);
    errorMsg.value = `Error: ${error}`;
  }
}

async function toggle(id: number) {
  try {
    await feAgent.toggleItem(id);
    await loadItems();
  } catch (error) {
    console.error("Error toggling item:", error);
    errorMsg.value = `Error: ${error}`;
  }
}

async function remove(id: number) {
  try {
    await feAgent.removeItem(id);
    await loadItems();
  } catch (error) {
    console.error("Error removing item:", error);
    errorMsg.value = `Error: ${error}`;
  }
}

async function callMcp() {
  try {
    const response = await feAgent.triggerMcp("kích hoạt MCP");
    mcpResponse.value = JSON.stringify(response, null, 2);
  } catch (error) {
    console.error("Error calling MCP:", error);
    errorMsg.value = `Error: ${error}`;
  }
}

onMounted(() => {
  console.log("Component mounted, loading items...");
  loadItems();
});
</script>

<style>
* { box-sizing: border-box; }
body { font-family: Arial, Helvetica, sans-serif; padding: 1rem; }
.app { max-width: 650px; margin: auto; }
button { margin-left: 0.75rem; }
.log { margin-top: 1.5rem; background: #f9f9f9; padding: 0.75rem; border-radius: 6px; }
.error { margin-top: 1rem; color: red; background: #ffe6e6; padding: 0.5rem; border-radius: 4px; }
</style>
