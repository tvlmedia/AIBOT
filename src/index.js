import express from "express";
import { RAG } from "./rag.js";

const app = express();
app.use(express.json());
const rag = new RAG();

app.get("/health", (_, res) => res.json({ ok: true }));

app.post("/chat", async (req, res) => {
  try {
    const { message } = req.body || {};
    if (!message) return res.status(400).json({ error: "Missing message" });
    const out = await rag.answer(message);
    res.json(out);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Server error" });
  }
});

const port = process.env.PORT || 8080;
app.listen(port, () => console.log(`Chatbot luistert op :${port}`));
