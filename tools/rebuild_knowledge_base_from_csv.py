#!/usr/bin/env python3
"""Rebuild apps/learnlao/src/assets/knowledge_base.json from lao_words.csv.

Source of truth:
- apps/learnlao/src/assets/lao_words.csv (vocabulary rows)

Generated artifact:
- apps/learnlao/src/assets/knowledge_base.json (vocabulary overwritten; topics/phrases preserved and repaired)

This script tries hard to preserve existing vocabulary IDs by matching
(Lao Script, English Translation) pairs and unique Lao-script matches.

Usage:
  python3 tools/rebuild_knowledge_base_from_csv.py
"""

from __future__ import annotations

import csv
import datetime
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
KB_PATH = ROOT / "apps/learnlao/src/assets/knowledge_base.json"
CSV_PATH = ROOT / "apps/learnlao/src/assets/lao_words.csv"

LAO_RE = re.compile(r"[\u0E80-\u0EFF]")


def norm(value: str) -> str:
    value = (value or "").strip().lower()
    value = re.sub(r"\s+", " ", value)
    return value


def slugify(value: str) -> str:
    value = norm(value)
    value = value.replace("&", " and ")
    value = re.sub(r"[^a-z0-9]+", "_", value)
    value = re.sub(r"_+", "_", value).strip("_")
    return value or "word"


FOOD_KEYWORDS = {
    "rice",
    "noodles",
    "soup",
    "salad",
    "bread",
    "water",
    "coffee",
    "tea",
    "milk",
    "sugar",
    "salt",
    "pepper",
    "chili",
    "fish",
    "chicken",
    "pork",
    "beef",
    "egg",
    "vegetable",
    "fruit",
    "banana",
    "mango",
    "papaya",
    "lime",
    "lemon",
    "coconut",
    "garlic",
    "onion",
    "ginger",
    "basil",
    "mint",
    "cilantro",
    "oil",
    "sauce",
    "snack",
    "dessert",
    "beer",
    "food",
}


def pick_level(english: str) -> str:
    e = norm(english)
    return "food_01" if any(k in e for k in FOOD_KEYWORDS) else "basics_01"


def main() -> int:
    kb = json.loads(KB_PATH.read_text(encoding="utf-8"))
    old_vocab = kb.get("vocabulary", []) or []
    old_vocab_by_id = {v.get("id"): v for v in old_vocab if v.get("id")}

    # Keep stable IDs by matching existing vocabulary.
    pair_to_id: dict[tuple[str, str], str] = {}
    for v in old_vocab:
        lao = str(v.get("lao") or "").strip()
        eng = norm(str(v.get("english") or ""))
        vid = v.get("id")
        if lao and eng and vid:
            pair_to_id[(lao, eng)] = vid

    # Lao-script-only fallback if unique.
    lao_to_ids: dict[str, set[str]] = {}
    for v in old_vocab:
        lao = str(v.get("lao") or "").strip()
        vid = v.get("id")
        if lao and vid:
            lao_to_ids.setdefault(lao, set()).add(vid)

    with CSV_PATH.open("r", encoding="utf-8", newline="") as f:
        reader = csv.DictReader(f)
        rows = list(reader)

    if not rows:
        raise SystemExit("CSV has no rows")

    assigned_ids: set[str] = set()

    def allocate_id(preferred: str) -> str:
        base = preferred
        if base and base not in assigned_ids:
            assigned_ids.add(base)
            return base
        i = 2
        while True:
            cand = f"{base}_{i:02d}" if base else f"word_{i:02d}"
            if cand not in assigned_ids:
                assigned_ids.add(cand)
                return cand
            i += 1

    new_vocab: list[dict] = []

    for idx, r in enumerate(rows, start=1):
        lao = (r.get("Lao Script") or "").strip()
        translit = (r.get("Transliteration") or "").strip()
        english = (r.get("English Translation") or "").strip()
        wtype = (r.get("Word Type") or "").strip()

        if not lao or not english:
            continue
        if not LAO_RE.search(lao):
            continue

        eng_n = norm(english)

        preferred_id = pair_to_id.get((lao, eng_n))
        if not preferred_id:
            ids = lao_to_ids.get(lao)
            if ids and len(ids) == 1:
                preferred_id = next(iter(ids))

        if not preferred_id:
            preferred_id = f"{slugify(english)}_01"

        vid = allocate_id(preferred_id)

        item = {
            "id": vid,
            "lao": lao,
            "english": english,
            "level_id": pick_level(english),
            "phonetic": translit or None,
            "category": wtype.lower() if wtype else None,
            "usage_rank": idx,
        }
        item = {k: v for k, v in item.items() if v not in (None, "")}
        new_vocab.append(item)

    for i, v in enumerate(new_vocab, start=1):
        v["usage_rank"] = i

    vocab_ids = {v["id"] for v in new_vocab}

    # Preserve any old vocab entries referenced by topics/phrases but missing from CSV.
    required_ids: set[str] = set()

    for p in kb.get("phrases", []) or []:
        for cid in (p.get("components") or []):
            required_ids.add(cid)
        for cid in (p.get("related_word_ids") or []):
            required_ids.add(cid)
    for t in kb.get("topics", []) or []:
        for wid in (t.get("words") or []):
            required_ids.add(wid)

    missing_required = [
        rid for rid in required_ids if rid and rid not in vocab_ids and rid in old_vocab_by_id
    ]

    if missing_required:
        for rid in missing_required:
            ov = dict(old_vocab_by_id[rid])
            ov.pop("needs_translation", None)
            ov["usage_rank"] = len(new_vocab) + 1
            new_vocab.append(ov)
        for i, v in enumerate(new_vocab, start=1):
            v["usage_rank"] = i
        vocab_ids = {v["id"] for v in new_vocab}

    kb["vocabulary"] = new_vocab
    kb.setdefault("meta", {})
    kb["meta"]["total_words"] = len(new_vocab)
    kb["meta"]["last_updated"] = datetime.date.today().isoformat()

    # Repair topics (keep 15 words each).
    TARGET_WORDS_PER_TOPIC = 15

    vocab_by_id = {v["id"]: v for v in new_vocab}
    word_re = re.compile(r"[a-zA-Z]+")

    def english_tokens(word_id: str) -> set[str]:
        v = vocab_by_id.get(word_id)
        if not v:
            return set()
        return set(word_re.findall((v.get("english") or "").lower()))

    insect_keywords = {
        "insect",
        "mosquito",
        "ant",
        "bee",
        "fly",
        "butterfly",
        "cockroach",
        "termite",
        "dragonfly",
        "grasshopper",
        "cricket",
        "moth",
        "beetle",
        "spider",
        "worm",
    }

    insect_ids = [
        v["id"]
        for v in new_vocab
        if english_tokens(v["id"]) & insect_keywords
    ]

    def topup(existing: list[str]) -> list[str]:
        s = set(existing)
        for v in new_vocab:
            if v["id"] in s:
                continue
            existing.append(v["id"])
            s.add(v["id"])
            if len(existing) >= TARGET_WORDS_PER_TOPIC:
                break
        return existing

    for t in kb.get("topics", []) or []:
        topic_id = t.get("id")
        words = [wid for wid in (t.get("words") or []) if wid in vocab_ids]

        # Keep curated lists for special topics. Avoid truncation/top-up logic.
        if topic_id in {"topic_numbers", "topic_dates"}:
            t["words"] = words
            continue

        # The dataset may not contain enough specific insect vocabulary. Avoid
        # filling topic_insects with unrelated nouns (e.g., "cat") just to reach 15.
        if topic_id == "topic_insects":
            strict = [wid for wid in words if english_tokens(wid) & insect_keywords]
            if not strict and insect_ids:
                strict = insect_ids[:]
            t["words"] = strict
            continue

        if len(words) < TARGET_WORDS_PER_TOPIC:
            words = topup(words)
        t["words"] = words[:TARGET_WORDS_PER_TOPIC]

    # Repair phrases.
    for p in kb.get("phrases", []) or []:
        if isinstance(p.get("components"), list):
            p["components"] = [cid for cid in p["components"] if cid in vocab_ids]
        if isinstance(p.get("related_word_ids"), list):
            p["related_word_ids"] = [cid for cid in p["related_word_ids"] if cid in vocab_ids]

    KB_PATH.write_text(json.dumps(kb, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")

    print(f"CSV rows parsed: {len(rows)}")
    print(f"New vocabulary size: {len(new_vocab)}")
    print(f"Appended required old items: {len(missing_required)}")
    print(f"Topics: {len(kb.get('topics', []) or [])}")
    print(f"Phrases: {len(kb.get('phrases', []) or [])}")

    return 0


if __name__ == "__main__":
    raise SystemExit(main())
