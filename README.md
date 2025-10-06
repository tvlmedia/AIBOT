# Chatbot in GitHub (trainbaar via Markdown + Actions)

Een simpele maar volwassen basis om een eigen chatbot te draaien, te *trainen* met je eigen documenten (RAG), en automatisch embeddings te bouwen bij elke push.

## Snel starten
1. **Fork of clone** deze repo-structuur.
2. Ga in GitHub → **Settings → Secrets → Actions** en voeg `OPENAI_API_KEY` toe.
3. Pas eventueel `ai.config.yml` aan.
4. Plaats je Markdown in `/knowledge` en push. De Action bouwt `embeddings.json`.
5. Lokaal draaien:
   ```bash
   cp .env.example .env  # zet je key
   npm i
   npm run embed   # bouw embeddings (optioneel, CI doet het ook)
   npm run dev
   ```
6. Chatten:
   ```bash
   curl -X POST http://localhost:8080/chat      -H 'Content-Type: application/json'      -d '{"message": "Wat staat er in de knowledge base?"}'
   ```

## Trainen (RAG)
- Voeg/werk Markdown-bestanden bij in `/knowledge`.
- Bij elke push draait de workflow en ververst `embeddings.json`.
- De runtime gebruikt die om relevante context te vinden en antwoorden te geven.

## Deploy
- Docker of een PaaS (Fly.io/Render/Railway). Je hebt alleen `OPENAI_API_KEY` nodig.

## Licentie
MIT
