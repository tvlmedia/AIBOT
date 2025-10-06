import fs from "fs";
import yaml from "js-yaml";
import OpenAI from "openai";

const dot = (a, b) => a.reduce((s, v, i) => s + v * b[i], 0);
const norm = (a) => Math.sqrt(dot(a, a));
const cosineSim = (a, b) => dot(a, b) / (norm(a) * norm(b));

export class RAG {
  constructor() {
    this.config = yaml.load(fs.readFileSync("ai.config.yml", "utf8"));
    this.modelChat = process.env.MODEL_CHAT || "gpt-4o-mini";
    this.modelEmb = process.env.MODEL_EMBEDDING || "text-embedding-3-small";
    this.openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    this.index = fs.existsSync("embeddings.json")
      ? JSON.parse(fs.readFileSync("embeddings.json", "utf8")).items
      : [];
  }

  async retrieve(query) {
    if (!this.index.length) return [];
    const e = await this.openai.embeddings.create({ model: this.modelEmb, input: query });
    const qvec = e.data[0].embedding;
    const scored = this.index.map((it) => ({ ...it, score: cosineSim(qvec, it.embedding) }))
      .sort((a, b) => b.score - a.score)
      .slice(0, this.config?.retrieval?.top_k || 5);
    return scored;
  }

  buildContext(chunks) {
    const maxChars = this.config?.retrieval?.max_context_chars || 8000;
    let ctx = "";
    for (const c of chunks) {
      const snippet = `\n\n[Bron: ${c.source}]\n${c.content}`;
      if ((ctx + snippet).length > maxChars) break;
      ctx += snippet;
    }
    return ctx.trim();
  }

  async answer(userMessage) {
    const retrieved = await this.retrieve(userMessage);
    const context = this.buildContext(retrieved);

    const sys = this.config?.system_prompt || "Je bent een behulpzame assistent.";
    const messages = [
      { role: "system", content: sys },
      { role: "user", content: `Vraag: ${userMessage}\n\nContext:\n${context || "(geen context gevonden)"}` }
    ];

    const resp = await this.openai.chat.completions.create({
      model: this.modelChat,
      messages,
      temperature: 0.2
    });

    return {
      answer: resp.choices[0].message.content.trim(),
      sources: retrieved.map((r) => ({ source: r.source, score: Number(r.score.toFixed(3)) }))
    };
  }
}
