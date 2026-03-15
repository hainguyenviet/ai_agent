import express from "express";
import cors from "cors";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const app = express();
const PORT = Number(process.env.PORT) || 4000;

app.use(cors());
app.use(express.json());

app.get("/api/items", async (req, res) => {
  const items = await prisma.item.findMany({ orderBy: { createdAt: "desc" } });
  res.json(items);
});

app.post("/api/items", async (req, res) => {
  const { title } = req.body;
  if (!title) return res.status(400).json({ error: "title required" });

  const item = await prisma.item.create({ data: { title } });
  res.status(201).json(item);
});

app.patch("/api/items/:id/toggle", async (req, res) => {
  const id = Number(req.params.id);
  const item = await prisma.item.findUnique({ where: { id } });
  if (!item) return res.status(404).json({ error: "not found" });

  const updated = await prisma.item.update({
    where: { id },
    data: { completed: !item.completed },
  });

  res.json(updated);
});

app.delete("/api/items/:id", async (req, res) => {
  const id = Number(req.params.id);
  await prisma.item.delete({ where: { id } });
  res.status(204).send();
});

async function seed() {
  const count = await prisma.item.count();
  if (count === 0) {
    await prisma.item.createMany({
      data: [
        { title: "Hello từ backend Việt-Hai", completed: false },
        { title: "Quét DB tự động khi start", completed: false },
      ],
    });
    console.log("Seeded items.");
  }
}

async function main() {
  await seed();

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Backend running: http://0.0.0.0:${PORT}`);
  });
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
