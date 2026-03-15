import { ref } from "vue";
import { itemsService, type Item } from "../services/itemsService";

export function useItems() {
  const items = ref<Item[]>([]);
  const errorMsg = ref("");
  const loading = ref(false);

  function getErrorMessage(error: unknown): string {
    if (typeof error === "string") {
      return error;
    }

    if (error instanceof Error) {
      return error.message;
    }

    const anyError = error as any;

    const axiosMessage =
      anyError?.response?.data?.error ??
      anyError?.response?.data?.message ??
      anyError?.message;

    if (typeof axiosMessage === "string") {
      return axiosMessage;
    }

    try {
      return JSON.stringify(error);
    } catch {
      return String(error);
    }
  }

  async function loadItems() {
    loading.value = true;
    errorMsg.value = "";
    try {
      items.value = await itemsService.getAll();
    } catch (error: unknown) {
      errorMsg.value = `Error loading items: ${getErrorMessage(error)}`;
    } finally {
      loading.value = false;
    }
  }

  async function addItem(title: string) {
    if (!title.trim()) return;
    try {
      await itemsService.create({ title });
      await loadItems();
    } catch (error: unknown) {
      errorMsg.value = `Error adding item: ${getErrorMessage(error)}`;
    }
  }

  async function toggleItem(id: number) {
    try {
      await itemsService.toggle(id);
      await loadItems();
    } catch (error: unknown) {
      errorMsg.value = `Error toggling item: ${getErrorMessage(error)}`;
    }
  }

  async function removeItem(id: number) {
    try {
      await itemsService.remove(id);
      await loadItems();
    } catch (error: unknown) {
      errorMsg.value = `Error removing item: ${getErrorMessage(error)}`;
    }
  }

  return { items, errorMsg, loading, loadItems, addItem, toggleItem, removeItem };
}
