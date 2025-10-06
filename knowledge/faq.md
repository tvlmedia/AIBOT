# FAQ — Project Chatbot

## Wat is dit?
Een Node.js chatbot met RAG die antwoorden kan geven op basis van Markdown in `/knowledge`.

## Hoe train ik 'm?
Gewoon nieuwe `.md`-bestanden toevoegen en pushen naar GitHub. De Action bouwt embeddings automatisch.

## Welke modellen?
- Chat: `gpt-4o-mini` (pas aan via `.env`/Actions secret)
- Embeddings: `text-embedding-3-small`

## Beperkingen
- Contextlengte en retrieval zijn begrensd; zie `ai.config.yml`.
- Geen stateful gebruikerssessies out-of-the-box (kan je toevoegen).
