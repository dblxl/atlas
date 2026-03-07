# Chunking Strategies

## Objective

Create chunks that preserve enough context for retrieval while staying compact enough for indexing and ranking.

## Baseline Strategies

- Fixed-size token windows with overlap.
- Semantic boundaries based on headings and sections.
- Hybrid chunking with semantic preference and fixed-size fallback.

## Evaluation Notes

Measure chunking quality by query class, not only by aggregate averages.
