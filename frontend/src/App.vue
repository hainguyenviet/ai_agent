<template>
  <div class="app">
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
  </div>
</template>

<script setup lang="ts">
import axios from "axios";
import { ref, onMounted } from "vue";

type Item = {
  id: number;
  title: string;
  completed: boolean;
};

const title = ref("");
const items = ref<Item[]>([]);
const mcpResponse = ref("");

async function loadItems() {
  const r = await axios.get<Item[]>("/api/items");
  items.value = r.data;
}

async function addItem() {
  if (!title.value.trim()) return;
  await axios.post("/api/items", { title: title.value });
  title.value = "";
  await loadItems();
}

async function toggle(id: number) {
  await axios.patch(`/api/items/${id}/toggle`);
  await loadItems();
}

async function remove(id: number) {
  await axios.delete(`/api/items/${id}`);
  await loadItems();
}

async function callMcp() {
  const r = await axios.post("/mcp/context", { message: "kích hoạt MCP" });
  mcpResponse.value = JSON.stringify(r.data, null, 2);
}

onMounted(() => {
  loadItems();
});
</script>

<style>
* { box-sizing: border-box; }
body { font-family: Arial, Helvetica, sans-serif; padding: 1rem; }
.app { max-width: 650px; margin: auto; }
button { margin-left: 0.75rem; }
.log { margin-top: 1.5rem; background: #f9f9f9; padding: 0.75rem; border-radius: 6px; }
</style>
