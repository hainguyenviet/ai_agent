<template>
  <div class="app">
    <h1>AI Agent Vue + DB + MCP</h1>

    <ItemForm @add="addItem" />

    <div v-if="errorMsg" class="app__error" role="alert">
      {{ errorMsg }}
    </div>

    <ItemList
      :items="items"
      :loading="loading"
      @toggle="toggleItem"
      @remove="removeItem"
    />

    <McpTrigger />
  </div>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import ItemForm from "./components/ItemForm.vue";
import ItemList from "./components/ItemList.vue";
import McpTrigger from "./components/McpTrigger.vue";
import { useItems } from "./composables/useItems";

const { items, errorMsg, loading, loadItems, addItem, toggleItem, removeItem } = useItems();

onMounted(loadItems);
</script>

<style>
* { box-sizing: border-box; }
body { font-family: Arial, Helvetica, sans-serif; padding: 1rem; }
.app { max-width: 650px; margin: auto; }
.app__error { margin-top: 1rem; color: red; background: #ffe6e6; padding: 0.5rem; border-radius: 4px; }
</style>
