<template>
  <form class="item-form" @submit.prevent="handleSubmit" aria-label="Thêm item mới">
    <label for="item-title" class="sr-only">Tên item</label>
    <input
      id="item-title"
      v-model="localTitle"
      type="text"
      placeholder="Tên item"
      aria-label="Tên item"
      autocomplete="off"
    />
    <button type="submit" :disabled="!localTitle.trim()">Thêm</button>
  </form>
</template>

<script setup lang="ts">
import { ref } from "vue";

const emit = defineEmits<{ (e: "add", title: string): void }>();

const localTitle = ref("");

function handleSubmit() {
  const trimmed = localTitle.value.trim();
  if (!trimmed) return;
  emit("add", trimmed);
  localTitle.value = "";
}
</script>

<style scoped>
.item-form {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
  margin-bottom: 1rem;
}
.item-form input {
  flex: 1;
  min-width: 0;
  padding: 0.4rem 0.6rem;
  border: 1px solid #ccc;
  border-radius: 4px;
}
.item-form button {
  padding: 0.4rem 0.9rem;
  border: none;
  border-radius: 4px;
  background: #4a90d9;
  color: #fff;
  cursor: pointer;
}
.item-form button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip: rect(0 0 0 0);
  white-space: nowrap;
}
</style>
