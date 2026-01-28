# LearnLao assets

## Source of truth

Current source of truth is:
- `apps/learnlao/src/assets/knowledge_base.json`

`apps/learnlao/src/assets/lao_words.csv` exists as an optional/import dataset but is not currently used as the authoritative source.

## Rebuilding (optional)

If you choose to regenerate the vocabulary in `knowledge_base.json` from `lao_words.csv` (while trying to preserve existing word IDs so topics/phrases stay stable):

```bash
python3 tools/rebuild_knowledge_base_from_csv.py
```

What the rebuild does:
- Overwrites `knowledge_base.json.vocabulary` from the CSV
- Preserves existing IDs when possible by matching `(Lao Script + English Translation)`
- Repairs topics to keep `15` words each
- Drops any phrase/topic references to missing word IDs

## Audio

See:
- `apps/learnlao/src/assets/audio/README.md`
