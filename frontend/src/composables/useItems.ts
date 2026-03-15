import { ref } from "vue";
import { itemsService, type Item } from "../services/itemsService";

export function useItems() {
  const items = ref<Item[]>([]);
  const errorMsg = ref("");
  const loading = ref(false);

  async function loadItems() {
    loading.value = true;
    errorMsg.value = "";
    try {
      items.value = await itemsService.getAll();
    } catch (error) {
      errorMsg.value = `Error loading items: ${error}`;
    } finally {
      loading.value = false;
    }
  }

  async function addItem(title: string) {
    if (!title.trim()) return;
    try {
      await itemsService.create({ title });
      await loadItems();
    } catch (error) {
      errorMsg.value = `Error adding item: ${error}`;
    }
  }

  async function toggleItem(id: number) {
    try {
      await itemsService.toggle(id);
      await loadItems();
    } catch (error) {
      errorMsg.value = `Error toggling item: ${error}`;
    }
  }

  async function removeItem(id: number) {
    try {
      await itemsService.remove(id);
      await loadItems();
    } catch (error) {
      errorMsg.value = `Error removing item: ${error}`;
    }
  }

  return { items, errorMsg, loading, loadItems, addItem, toggleItem, removeItem };
}
