# Chunking Strategies for Retrieval

Chunking is the process of splitting a long document into smaller passages before embedding and indexing. The choice of chunking strategy directly affects retrieval quality: chunks that are too large dilute the signal, while chunks that are too small lose context.

## Fixed-Size Chunking

The simplest approach splits text into windows of N tokens with an optional overlap. For example, a chunk size of 256 tokens with a 32-token overlap ensures that sentences spanning a boundary appear in at least one complete chunk. This method is predictable and easy to tune but ignores document structure.

## Semantic Chunking

Semantic chunking splits on natural boundaries such as paragraphs, headings, or sentence groups. A common heuristic is to split on double newlines and then merge adjacent short paragraphs until a target size is reached. This preserves coherent units of meaning at the cost of variable chunk lengths.

## Hierarchical Chunking

Some systems maintain two levels: large parent chunks for context and small child chunks for precise retrieval. The retrieval step finds the best child chunk, then expands to the parent for the final prompt context. This balances precision with completeness.

## Overlap and Its Role

Overlap between adjacent chunks ensures that information near a boundary is not lost. A typical overlap is 10–20% of the chunk size. Too much overlap increases index size and retrieval noise; too little risks missing cross-boundary facts.

## Choosing a Strategy

Start with fixed-size chunking at 100–200 tokens and 10–20% overlap. Measure recall on a held-out evaluation set and switch to semantic chunking if recall is low on long-form documents.
