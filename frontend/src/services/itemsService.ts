import axios from "axios";

export type Item = {
  id: number;
  title: string;
  completed: boolean;
  createdAt?: string;
};

export type CreateItemPayload = {
  title: string;
};

const BASE = "/api/items";

export const itemsService = {
  async getAll(): Promise<Item[]> {
    const response = await axios.get<Item[]>(BASE);
    return response.data;
  },

  async create(payload: CreateItemPayload): Promise<Item> {
    const response = await axios.post<Item>(BASE, payload);
    return response.data;
  },

  async toggle(id: number): Promise<Item> {
    const response = await axios.patch<Item>(`${BASE}/${id}/toggle`);
    return response.data;
  },

  async remove(id: number): Promise<void> {
    await axios.delete(`${BASE}/${id}`);
  },
};
