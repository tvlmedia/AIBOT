import fs from "fs";
import path from "path";
import glob from "glob";
import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const MODEL = process.env.MODEL_EMBEDDING || "text-embedding-3-small";
const KNOWLEDGE_DIR = path.resolve("knowledge");
const OUTFILE = path.resolve("embeddings.json");

function splitIntoChunks(text, max = 1200) {
  const paras = text.split(/\n\n+/g);
  const chunks = [];
  let buf = "";
  for (const p of paras) {
    if ((buf + "\n\n" + p).length > max && buf) {
      chunks.push(buf.trim());
      buf = p;
    } else {
      buf = buf ? buf + "\n\n" + p : p;
    }
  }
  if (buf.trim()) chunks.push(buf.trim());
  return chunks.filter(Boolean);
}

async function embedChunks(chunks) {
  const res = await openai.embeddings.create({ model: MODEL, input: chunks });
  return res.data.map(d => d.embedding);
}

async function main() {
  if (!process.env.OPENAI_API_KEY) {
    console.error("Missing OPENAI_API_KEY"); process.exit(1);
  }
  const files = glob.sync(path.join(KNOWLEDGE_DIR, "**/*.md"));
  const index = [];
  for (const file of files) {
    const text = fs.readFileSync(file, "utf8");
    const chunks = splitIntoChunks(text, 1200);
    if (!chunks.length) continue;
    const vectors = await embedChunks(chunks);
    chunks.forEach((content, i) => {
      index.push({ source: path.relative(process.cwd(), file), content, embedding: vectors[i] });
    });
    console.log(`Embedded ${file} -> ${chunks.length} chunks`);
  }
  fs.writeFileSync(
    OUTFILE,
    JSON.stringify({ createdAt: new Date().toISOString(), items: index }, null, 2)
  );
  console.log(`Wrote ${OUTFILE} with ${index.length} chunks.`);
}

main().catch(e => { console.error(e); process.exit(1); });
