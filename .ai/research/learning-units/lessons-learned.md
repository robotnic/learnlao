# Lessons Learned (Bootlao – Learning Units)

This file exists to prevent repeating early content-creation mistakes (especially around Lao vs Thai, script accuracy, and JSON packaging).

## 1) Don’t Guess Lao Script
- If the source lesson table has `Lao Script` as `-`, do **not** invent script forms.
- Action: leave `laoScript` empty (`""`) or omit it until verified.
- Action: add a `needsVerification: true` flag on items if required.

## 2) Avoid Thai ↔ Lao Cross-Contamination
Common failure mode: using Thai phrases/romanizations but labeling as Lao.
- Examples of typical mixups:
  - Thai “ขอบคุณ” (khop khun) vs Lao “ຂອບໃຈ” (often romanized khop jai/khop chai)
  - Thai “ใช่” (chai = yes) vs Lao “ແມ່ນ” (men = yes)
- Rule: every vocabulary row must be internally consistent across `laoScript`, `romanization`, `ipa`, and `english`.

## 3) Pick One Romanization Scheme (and Stick to It)
- Decide a single romanization convention for the project (e.g., how to represent ບໍ່ as `bo`, `bò`, `baw`, etc.).
- Apply it consistently across all lessons.
- Store the chosen scheme in a shared place (config/doc) and reference it in lesson JSON.

## 4) Meanings Must Match Natural Lao Usage
- Avoid constructing phrases by literal word-by-word translation if it’s not idiomatic.
- “No, thank you” and “Not well” are especially easy to get wrong.
- Rule: if a phrase is situational/idiomatic, include a short `usageNotes` and verify with a native speaker or trusted reference.

## 5) Keep JSON Valid, and Keep It as Data
- Validate JSON (no trailing commas, correct quoting, etc.).
- Don’t store placeholder values like `"-"` if it causes downstream confusion; prefer empty string or omission.
- If embedding JSON inside markdown, keep the JSON snippet minimal or clearly mark it as “example payload”.

## 6) Content Workflow Checklist (per lesson)
Before shipping a lesson wordlist:
- [ ] Each vocab item has: `romanization`, `english`, and either verified `laoScript` or `needsVerification: true`.
- [ ] No Thai-only spellings/phrases accidentally included.
- [ ] Romanization scheme matches project convention.
- [ ] IPA (if present) matches the romanization/script.
- [ ] Meanings match natural Lao usage (not just literal translations).

## 7) Suggested Fields for Future-Proofing
When uncertain, add explicit metadata rather than guessing:
- `source`: where the form came from (native speaker, dictionary, etc.)
- `confidence`: `high | medium | low`
- `needsVerification`: boolean
- `usageNotes`: short context example

## 8) Specific Mistakes Observed (Jan 27, 2026)
- The lesson wordlist mixed Thai-style romanizations with Lao labels.
- Lao script values were missing in the original source, but were later filled by guessing (unsafe).
- A JSON file under `src/assets/lessons/` was created with placeholder script values and reported a parse/lint error.

Next time: verify forms first, then generate lesson JSON from verified vocabulary.
