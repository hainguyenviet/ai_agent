<template>
  <section aria-label="Danh sách items">
    <p v-if="loading" role="status" aria-live="polite">Đang tải…</p>
    <ul v-else-if="items.length" class="item-list">
      <li v-for="item in items" :key="item.id" class="item-list__item">
        <label class="item-list__label">
          <input
            type="checkbox"
            :checked="item.completed"
            :aria-label="`Hoàn thành: ${item.title}`"
            @change="$emit('toggle', item.id)"
          />
          <span :class="{ completed: item.completed }">{{ item.title }}</span>
        </label>
        <button
          class="item-list__delete"
          :aria-label="`Xóa item: ${item.title}`"
          @click="$emit('remove', item.id)"
        >
          Xóa
        </button>
      </li>
    </ul>
    <p v-else class="item-list__empty">Chưa có item nào.</p>
  </section>
</template>

<script setup lang="ts">
import type { Item } from "../services/itemsService";

defineProps<{ items: Item[]; loading?: boolean }>();
defineEmits<{
  (e: "toggle", id: number): void;
  (e: "remove", id: number): void;
}>();
</script>

<style scoped>
.item-list {
  list-style: none;
  padding: 0;
  margin: 0;
}
.item-list__item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.4rem 0;
  border-bottom: 1px solid #eee;
}
.item-list__label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
}
.item-list__label .completed {
  text-decoration: line-through;
  color: #888;
}
.item-list__delete {
  padding: 0.25rem 0.6rem;
  border: 1px solid #e55;
  border-radius: 4px;
  background: transparent;
  color: #e55;
  cursor: pointer;
  flex-shrink: 0;
}
.item-list__delete:hover {
  background: #ffe6e6;
}
.item-list__empty {
  color: #888;
  font-style: italic;
}
</style>
